import type { Hex } from "viem";

export type Toast = {
  id: string;
  status: "submitted" | "success" | "error";
  message: string;
  transactionHash?: Hex;
};
