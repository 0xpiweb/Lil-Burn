import { Hex } from "viem";

export type Proof = {
  holder: { proof: Hex[]; maxQuantity: bigint } | null;
  whitelist: { proof: Hex[] } | null;
};
