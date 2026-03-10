import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  createPublicClient,
  getAddress,
  http,
  isAddress,
  isAddressEqual,
  parseAbiItem,
  zeroAddress,
  type Address,
} from "viem";
import { avalanche } from "viem/chains";
import { Snapshot } from "../types/Snapshot.js";

const contractAddress = (() => {
  const contractAddress = process.argv[2];

  if (!contractAddress) {
    console.error("Error: missing contract address");

    process.exit(1);
  } else if (!isAddress(contractAddress, { strict: false })) {
    console.error("Error: invalid contract address");

    process.exit(1);
  }

  return getAddress(contractAddress);
})();

const BLOCK_RANGE = 2048n;
const CONCURRENCY = 10;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 500;

const transferEvent = parseAbiItem(
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
);

type TransferLog = {
  from: Address;
  to: Address;
  tokenId: bigint;
};

const client = createPublicClient({
  chain: avalanche,
  transport: http(),
});

function sleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function findDeploymentBlock(address: Address): Promise<bigint> {
  process.stderr.write("Finding deployment block... ");

  const code = await client.getCode({ address });

  if (!code || code === "0x") {
    console.error("Error: no contract found at this address");

    process.exit(1);
  }

  const latestBlock = await client.getBlockNumber();

  let left = 0n;
  let right = latestBlock;

  while (left < right) {
    const middle = (left + right) / 2n;
    const code = await client.getCode({ address, blockNumber: middle });

    if (code && code !== "0x") {
      right = middle;
    } else {
      left = middle + 1n;
    }
  }

  console.log("done");
  console.log(`Deployment block: ${left}`);

  return left;
}

async function fetchLogsChunk(
  fromBlock: bigint,
  toBlock: bigint,
): Promise<TransferLog[]> {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const logs = await client.getLogs({
        address: contractAddress,
        event: transferEvent,
        fromBlock,
        toBlock,
      });

      return logs.map((log) => ({
        from: log.args.from!,
        to: log.args.to!,
        tokenId: log.args.tokenId!,
      }));
    } catch (error) {
      if (attempt === MAX_RETRIES) {
        throw error;
      }

      const delay = RETRY_DELAY_MS * 2 ** (attempt - 1);

      await sleep(delay);
    }
  }

  return [];
}

async function fetchAllTransferEvents(
  startBlock: bigint,
): Promise<{ events: TransferLog[]; latestBlock: bigint }> {
  const latestBlock = await client.getBlockNumber();
  const totalBlocks = latestBlock - startBlock;
  const totalChunks = Number((totalBlocks + BLOCK_RANGE - 1n) / BLOCK_RANGE);

  console.log(`Latest block: ${latestBlock}`);
  console.log(
    `Blocks to scan: ${totalBlocks} (~${totalChunks} chunks, ${CONCURRENCY} concurrent)\n`,
  );

  const chunks: { from: bigint; to: bigint }[] = [];

  for (let from = startBlock; from <= latestBlock; from += BLOCK_RANGE) {
    const to =
      from + BLOCK_RANGE - 1n > latestBlock
        ? latestBlock
        : from + BLOCK_RANGE - 1n;

    chunks.push({ from, to });
  }

  const allEvents: TransferLog[] = [];

  let completed = 0;

  for (let i = 0; i < chunks.length; i += CONCURRENCY) {
    const batch = chunks.slice(i, i + CONCURRENCY);

    const results = await Promise.all(
      batch.map(({ from, to }) => fetchLogsChunk(from, to)),
    );

    for (const events of results) {
      allEvents.push(...events);
    }

    completed += batch.length;

    const percent = Math.round((completed / chunks.length) * 100);

    process.stderr.write(
      `\rProgress: ${percent}%  [${allEvents.length} events]`,
    );
  }

  console.log(`\nScan complete. Found ${allEvents.length} Transfer events.`);

  return { events: allEvents, latestBlock };
}

function buildOwnershipMap(events: TransferLog[]): [Address, bigint][] {
  const tokenOwners = new Map<bigint, Address>();

  for (const event of events) {
    if (isAddressEqual(event.to, zeroAddress)) {
      tokenOwners.delete(event.tokenId);
    } else {
      tokenOwners.set(event.tokenId, getAddress(event.to));
    }
  }

  const holderCounts = new Map<Address, bigint>();

  for (const owner of tokenOwners.values()) {
    holderCounts.set(owner, (holderCounts.get(owner) ?? 0n) + 1n);
  }

  const holders: [Address, bigint][] = [...holderCounts.entries()].sort(
    ([a], [b]) => a.localeCompare(b),
  );

  console.log(`\nOwnership summary:`);
  console.log(`Total tokens (not burned): ${tokenOwners.size}`);
  console.log(`Unique holders: ${holders.length}`);

  if (holders.length === 0) {
    console.error("Error: No holders found");

    process.exit(1);
  }

  return holders;
}

console.log("\nNFT Holder Snapshot");
console.log(`Contract: ${contractAddress}`);
console.log(`Chain: ${avalanche.name} (${avalanche.id})`);

const startingBlock = process.argv[3];

const deploymentBlock = startingBlock
  ? BigInt(startingBlock)
  : await findDeploymentBlock(contractAddress);

const { events, latestBlock } = await fetchAllTransferEvents(deploymentBlock);

const holders = buildOwnershipMap(events);

const latestBlockData = await client.getBlock({ blockNumber: latestBlock });

const snapshotTimestamp = Number(latestBlockData.timestamp);

const outputDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../output",
);

await mkdir(outputDir, { recursive: true });

const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

const filename = `snapshot-${contractAddress}-${timestamp}.json`;

const filepath = path.join(outputDir, filename);

const outputData = {
  contractAddress,
  chainId: avalanche.id,
  snapshotBlock: Number(latestBlock),
  snapshotTimestamp,
  holderCount: holders.length,
  holders: holders.map(([address, count]) => [address, count.toString()]),
} satisfies Snapshot;

await writeFile(filepath, JSON.stringify(outputData, null, 2));

console.log(`\nSnapshot saved to: ${filepath}`);
