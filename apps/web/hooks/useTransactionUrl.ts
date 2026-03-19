"use client";

import type { Hex } from "viem";
import { useConfig } from "wagmi";

export function useTransactionUrl() {
  const config = useConfig();

  const explorerBaseUrl = config.chains[0].blockExplorers?.default.url?.replace(
    /\/+$/,
    "",
  );

  return (hash: Hex) =>
    explorerBaseUrl ? `${explorerBaseUrl}/tx/${hash}` : undefined;
}
