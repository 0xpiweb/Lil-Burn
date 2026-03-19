import "server-only";

import { db } from "@/db/drizzle";
import { syncState } from "@/db/schema";
import { lilBurnAddress, warChestAddress } from "@/generated";
import type { DBTransaction } from "@/types/DBTransation";
import type { NormalizedLog } from "@/types/NormalizedLog";
import { eq } from "drizzle-orm";
import {
  isAddressEqual,
  zeroAddress,
  type Address,
  type GetLogsReturnType,
} from "viem";
import { processLilBurnLogs, processWarChestLogs } from "./logs";
import { publicClient } from "./wagmi.server";

export async function backfill() {
  const chainId = await publicClient.getChainId();

  await backfillContract(
    "lilBurn",
    process.env.LILBURN_DEPLOY_BLOCK,
    lilBurnAddress[chainId as keyof typeof lilBurnAddress],
    processLilBurnLogs,
  );

  await backfillContract(
    "warChest",
    process.env.WARCHEST_DEPLOY_BLOCK,
    warChestAddress[chainId as keyof typeof warChestAddress],
    processWarChestLogs,
  );
}

function getSyncKey(name: string) {
  return `${name}.lastSyncedBlock`;
}

async function backfillContract(
  name: string,
  deployBlock: string | undefined,
  address: Address | undefined,
  processor: (logs: NormalizedLog[], tx: DBTransaction) => Promise<void>,
) {
  if (!deployBlock) {
    return console.error(`[${name}] Missing deploy block`);
  }

  if (!address || isAddressEqual(address, zeroAddress)) {
    return console.error(`[${name}] No contract on this chain`);
  }

  const { logs, blockNumber } = await getLogs(
    name,
    BigInt(deployBlock),
    address,
  );

  await db.transaction(async (tx) => {
    await processor(logs, tx);

    console.log(`[${name}] Events processed`);

    await tx
      .insert(syncState)
      .values({ key: getSyncKey(name), value: blockNumber })
      .onConflictDoUpdate({
        target: syncState.key,
        set: { value: blockNumber },
      });

    console.log(`[${name}] Sync state updated`);
  });
}

async function getLogs(
  name: string,
  deployBlock: bigint,
  contractAddress: Address,
  logChunkSize = 2000,
  blockConcurency = 10,
): Promise<{ logs: NormalizedLog[]; blockNumber: number }> {
  const toBlock = await publicClient.getBlockNumber();

  const state = await db.query.syncState.findFirst({
    where: eq(syncState.key, getSyncKey(name)),
  });

  const fromBlock = state ? BigInt(state.value + 1) : deployBlock;

  const totalBlocks = toBlock > fromBlock ? toBlock - fromBlock : BigInt(1);

  const logs: GetLogsReturnType = [];

  const bigIntLogChunkSize = BigInt(logChunkSize);

  for (
    let fromChunk = fromBlock;
    fromChunk <= toBlock;
    fromChunk += bigIntLogChunkSize
  ) {
    const toChunk = fromChunk + bigIntLogChunkSize - BigInt(1);

    const percent = Math.round(
      Number(
        ((toChunk < toBlock ? toChunk - fromBlock : totalBlocks) *
          BigInt(100)) /
          totalBlocks,
      ),
    );

    console.log(
      `[${name}] Fetching logs: block ${fromChunk}–${toChunk < toBlock ? toChunk : toBlock} / ${toBlock} (${percent}%)`,
    );

    logs.push(
      ...(
        await publicClient.getLogs({
          address: contractAddress,
          fromBlock: fromChunk,
          toBlock: toChunk < toBlock ? toChunk : toBlock,
        })
      ).filter(
        ({ blockNumber, transactionHash, logIndex }) =>
          blockNumber !== null && transactionHash !== null && logIndex !== null,
      ),
    );
  }

  console.log(
    `[${name}] Found ${logs.length} logs over ${Number(toBlock - fromBlock)} blocks`,
  );

  const blockTimestamps = new Map<bigint, number>();

  const blockNumbers = [...new Set(logs.map(({ blockNumber }) => blockNumber))];

  for (let i = 0; i < blockNumbers.length; i += blockConcurency) {
    await Promise.all(
      blockNumbers.slice(i, i + blockConcurency).map(async (blockNumber) => {
        const { timestamp } = await publicClient.getBlock({ blockNumber });

        blockTimestamps.set(blockNumber, Number(timestamp));
      }),
    );

    const done = Math.min(i + blockConcurency, blockNumbers.length);

    const percent = Math.round((done / blockNumbers.length) * 100);

    console.log(
      `[${name}] Timestamps: ${done}/${blockNumbers.length} (${percent}%)`,
    );
  }

  return {
    logs: logs.map((log) => ({
      ...log,
      blockNumber: Number(log.blockNumber),
      blockTimestamp: blockTimestamps.get(log.blockNumber)!,
    })),
    blockNumber: Number(toBlock),
  };
}
