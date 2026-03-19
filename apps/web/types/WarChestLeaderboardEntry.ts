import type { Address } from "viem";

export type WarChestLeaderboardEntry = {
  rank: number;
  address: Address;
  contribution: number;
};
