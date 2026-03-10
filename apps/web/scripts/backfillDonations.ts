import { db } from "@/db/drizzle";
import { donation, syncState } from "@/db/schema";
import { warChestAbi, warChestAddress } from "@/generated";
import { eq } from "drizzle-orm";
import "server-only";
import { formatEther, getAbiItem, isAddressEqual, zeroAddress } from "viem";
import { publicClient } from "../lib/wagmi.server";

const SYNC_KEY = "donations.lastScannedBlock";
const LOG_CHUNK_SIZE = BigInt(2000);
const TIMESTAMP_CHUNK_SIZE = 5;

export async function backfillDonations() {
  if (!process.env.WARCHEST_DEPLOY_BLOCK) {
    return console.error("Backfill: missing warchest deploy block");
  }

  const [toBlock, chainId] = await Promise.all([
    publicClient.getBlockNumber(),
    publicClient.getChainId(),
  ]);

  const address = warChestAddress[chainId as keyof typeof warChestAddress];

  if (!address || isAddressEqual(address, zeroAddress)) {
    return console.error(`Backfill: no WarChest contract on chain ${chainId}`);
  }

  const [state] = await db
    .select()
    .from(syncState)
    .limit(1)
    .where(eq(syncState.key, SYNC_KEY));

  const deployBlock = BigInt(process.env.WARCHEST_DEPLOY_BLOCK);

  const fromBlock = state ? BigInt(state.value + 1) : deployBlock;

  if (fromBlock > toBlock) {
    return console.log(`Backfill: already up to date at block ${toBlock}.`);
  }

  console.log(`Backfill: scanning blocks ${fromBlock}–${toBlock}...`);

  // fetch logs
  const event = getAbiItem({ abi: warChestAbi, name: "Donated" });

  function fetchLogChunk(fromBlock: bigint, toBlock: bigint) {
    return publicClient.getLogs({
      address,
      event,
      fromBlock,
      toBlock,
    });
  }

  const logChunks: Awaited<ReturnType<typeof fetchLogChunk>>[] = [];

  for (let chunk = fromBlock; chunk <= toBlock; chunk += LOG_CHUNK_SIZE) {
    const chunkEnd = chunk + LOG_CHUNK_SIZE - BigInt(1);

    logChunks.push(
      await fetchLogChunk(chunk, chunkEnd < toBlock ? chunkEnd : toBlock),
    );
  }

  // filter pending logs
  const logs = logChunks
    .flat()
    .filter(
      ({ blockNumber, transactionHash, logIndex }) =>
        blockNumber !== null && transactionHash !== null && logIndex !== null,
    );

  const blockNumbers = [...new Set(logs.map(({ blockNumber }) => blockNumber))];

  // fetch block timestamps
  const blockTimestamps = new Map<bigint, number>();

  for (let i = 0; i < blockNumbers.length; i += TIMESTAMP_CHUNK_SIZE) {
    await Promise.all(
      blockNumbers
        .slice(i, i + TIMESTAMP_CHUNK_SIZE)
        .map(async (blockNumber) => {
          const { timestamp } = await publicClient.getBlock({ blockNumber });

          blockTimestamps.set(blockNumber, Number(timestamp));
        }),
    );
  }

  await db.transaction(async (tx) => {
    if (logs.length > 0) {
      const { rowsAffected } = await tx
        .insert(donation)
        .values(
          logs.map((log) => ({
            txHash: log.transactionHash,
            logIndex: log.logIndex,
            donor: log.args.donor!,
            epoch: Number(log.args.epoch!),
            amountWei: log.args.amount!,
            amountEth: Number(formatEther(log.args.amount!)),
            blockNumber: Number(log.blockNumber),
            createdAt: new Date(blockTimestamps.get(log.blockNumber)! * 1000),
          })),
        )
        .onConflictDoNothing();

      console.log(`Backfill: inserted ${rowsAffected} missing donations`);
    }

    await tx
      .insert(syncState)
      .values({ key: SYNC_KEY, value: Number(toBlock) })
      .onConflictDoUpdate({
        target: syncState.key,
        set: { value: Number(toBlock) },
      });
  });

  console.log(`Backfill: Scanned to block ${toBlock}`);
}
