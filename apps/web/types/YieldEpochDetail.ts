import type { YieldEpochSummary } from "@/types/YieldEpochSummary";
import type { Hex } from "viem";

export type YieldEpochDetail = YieldEpochSummary & {
  incomingRollover: number | null;
  rollover: number;
  totalBurnsAtEnd: number;
  burns: {
    tokenId: number;
    transactionHash: Hex;
    blockNumber: number;
    blockTimestamp: Date;
  }[];
  sweeps: {
    tokenId: number;
    transactionHash: Hex;
    blockNumber: number;
    blockTimestamp: Date;
  }[];
};
