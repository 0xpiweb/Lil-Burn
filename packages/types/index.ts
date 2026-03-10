import type { Address, Hex } from "viem";

export type HolderLeaf = [Address, bigint];

export type SerializedHolderLeaf = [Address, string];

export type WhitelistLeaf = [Address];

export type AlchemyWebhookPayload = {
  webhookId: string;
  id: string;
  createdAt: string;
  type: string;
  event: {
    sequenceNumber: string;
    network: "AVAX" | "AVAX_FUJI" | "LOCALHOST";
    data: {
      block: {
        hash: Hex;
        number: number;
        timestamp: number;
        logs: {
          data: Hex;
          topics: [Hex, ...Hex[]];
          index: number;
          account: { address: Address };
          transaction: {
            hash: Hex;
            nonce: number;
            index: number;
            from: { address: Address };
            to: { address: Address };
            value: Hex;
            gasPrice: Hex;
            maxFeePerGas: Hex;
            maxPriorityFeePerGas: Hex;
            gas: number;
            status: number;
            gasUsed: number;
            cumulativeGasUsed: number;
            effectiveGasPrice: Hex;
            createdContract: string | null;
          };
        }[];
      };
    };
  };
};
