import { Address } from "viem";

export type Snapshot = {
  contractAddress: Address;
  chainId: number;
  snapshotBlock: number;
  snapshotTimestamp: number;
  holderCount: number;
  holders: [Address, string][];
};
