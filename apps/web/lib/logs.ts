import "server-only";

import { db } from "@/db/drizzle";
import { burn, donation, sweep } from "@/db/schema";
import { lilBurnAbi, warChestAbi } from "@/generated";
import type { DBTransaction } from "@/types/DBTransation";
import type { NormalizedLog } from "@/types/NormalizedLog";
import {
  decodeEventLog,
  formatEther,
  getAddress,
  isAddress,
  isAddressEqual,
  zeroAddress,
} from "viem";

export async function processLilBurnLogs(
  logs?: NormalizedLog[],
  tx?: DBTransaction,
) {
  if (!logs) {
    return;
  }

  const executor = tx ?? db;

  const decoded = logs.flatMap(({ data, topics, ...rest }) => {
    try {
      return [
        { ...decodeEventLog({ abi: lilBurnAbi, data, topics }), ...rest },
      ];
    } catch {
      return [];
    }
  });

  const sweepAddresses = process.env.SWEEPER_ADDRESSES?.split(",")
    .map((address) => address.trim())
    .filter((address) => isAddress(address, { strict: false }))
    .map((address) => getAddress(address));

  const sweepLogs =
    sweepAddresses &&
    decoded.filter(
      ({ eventName, args: { to } }) =>
        eventName === "Transfer" &&
        sweepAddresses.some((sweepAddress) => isAddressEqual(to, sweepAddress)),
    );

  if (sweepLogs?.length) {
    await executor
      .insert(sweep)
      .values(
        sweepLogs.map(
          ({
            logIndex,
            transactionHash,
            blockNumber,
            blockTimestamp,
            args: { tokenId, to },
          }) => ({
            logIndex,
            transactionHash,
            blockNumber,
            blockTimestamp: new Date(blockTimestamp * 1000),
            tokenId: Number(tokenId),
            address: to,
          }),
        ),
      )
      .onConflictDoNothing();
  }

  const burnLogs = decoded.filter(
    ({ eventName, args: { to } }) =>
      eventName === "Transfer" && isAddressEqual(to, zeroAddress),
  );

  if (burnLogs.length) {
    await executor
      .insert(burn)
      .values(
        burnLogs.map(
          ({
            logIndex,
            transactionHash,
            blockNumber,
            blockTimestamp,
            args: { tokenId, from },
          }) => ({
            logIndex,
            transactionHash,
            blockNumber,
            blockTimestamp: new Date(blockTimestamp * 1000),
            tokenId: Number(tokenId),
            address: from,
          }),
        ),
      )
      .onConflictDoNothing();
  }
}

export async function processWarChestLogs(
  logs?: NormalizedLog[],
  tx?: DBTransaction,
) {
  if (!logs) {
    return;
  }

  const executor = tx ?? db;

  const decoded = logs.flatMap(({ data, topics, ...rest }) => {
    try {
      return [
        { ...decodeEventLog({ abi: warChestAbi, data, topics }), ...rest },
      ];
    } catch {
      return [];
    }
  });

  const donatedLogs = decoded.filter(
    ({ eventName }) => eventName === "Donated",
  );

  if (donatedLogs.length) {
    await executor
      .insert(donation)
      .values(
        donatedLogs.map(
          ({
            logIndex,
            transactionHash,
            blockNumber,
            blockTimestamp,
            args: { donor, epoch, amount },
          }) => ({
            logIndex,
            transactionHash,
            blockNumber,
            blockTimestamp: new Date(blockTimestamp * 1000),
            donor,
            epoch: Number(epoch),
            amount,
            amountEth: Number(formatEther(amount)),
          }),
        ),
      )
      .onConflictDoNothing();
  }
}
