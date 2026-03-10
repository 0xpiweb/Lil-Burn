import { readFile } from "node:fs/promises";
import {
  createPublicClient,
  getAddress,
  http,
  parseAbiItem,
  type Address,
} from "viem";
import { avalanche } from "viem/chains";
import { Snapshot } from "../types/Snapshot.js";

const snapshotPath = process.argv[2];

if (!snapshotPath) {
  console.error("Error: snapshot path missing");

  process.exit(1);
}

const BATCH_SIZE = 500;

const abi = parseAbiItem(
  "function balanceOf(address owner) view returns (uint256)",
);

const snapshot = JSON.parse(await readFile(snapshotPath, "utf8")) as Snapshot;

const contractAddress = getAddress(snapshot.contractAddress);

const snapshotBlock = BigInt(snapshot.snapshotBlock);

const holders: [Address, bigint][] = snapshot.holders.map(
  ([address, count]: [string, string]) => [getAddress(address), BigInt(count)],
);

console.log("Verifying snapshot");
console.log(`Contract: ${contractAddress}`);
console.log(`Block: ${snapshotBlock}`);
console.log(`Holders: ${holders.length}\n`);

const client = createPublicClient({
  chain: avalanche,
  transport: http(),
});

let totalSnapshot = 0n;
let totalOnChain = 0n;
let mismatches = 0;

for (let i = 0; i < holders.length; i += BATCH_SIZE) {
  const batch = holders.slice(i, i + BATCH_SIZE);

  const results = await client.multicall({
    contracts: batch.map(([address]) => ({
      address: contractAddress,
      abi: [abi],
      functionName: "balanceOf",
      args: [address],
    })),
    blockNumber: snapshotBlock,
  });

  for (let j = 0; j < batch.length; j++) {
    const [address, snapshotCount] = batch[j];
    const result = results[j];

    totalSnapshot += snapshotCount;

    if (result.status === "success") {
      const onChainCount = result.result;

      totalOnChain += onChainCount;

      if (onChainCount !== snapshotCount) {
        mismatches++;

        console.warn(
          `Mismatch ${address}: snapshot=${snapshotCount}, chain=${onChainCount}`,
        );
      }
    } else {
      console.error(`Error ${address}: ${result.error}`);
    }
  }

  const percent = Math.round(((i + batch.length) / holders.length) * 100);

  process.stderr.write(`\rProgress: ${percent}%`);
}

console.log("Results:");
console.log(`Snapshot total tokens: ${totalSnapshot}`);
console.log(`On-chain total tokens: ${totalOnChain}`);
console.log(`Balance mismatches: ${mismatches}`);
