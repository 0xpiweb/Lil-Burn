import type { Address, Hex } from "viem";

export type NormalizedLog = {
  removed: boolean;
  logIndex: number;
  transactionIndex: number;
  transactionHash: Hex;
  blockHash: Hex;
  blockNumber: number;
  address: Address;
  data: Hex;
  topics: [] | [Hex, ...Hex[]];
  blockTimestamp: number;
};
