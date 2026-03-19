import type { Hex } from "viem";

export type LilBurn = {
  tokenId: number;
  name: string;
  image: string;
  artist: string;
  f1r3Crew: string;
  sweepScore: number;
  isCursed: boolean;
  cursedMilestone: number | null;
  cursedAt: Date | null;
  isBurned: boolean;
  burnTransactionHash: Hex | null;
  burnBlockNumber: number | null;
  burnBlockTimestamp: Date | null;
};
