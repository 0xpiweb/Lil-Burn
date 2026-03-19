"use client";

import { NftModalProvider } from "@/components/nft/NftModalContext";
import { ToastProvider } from "@/components/ToastContext";
import { getWagmiConfig } from "@/lib/wagmi.client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { type State, WagmiProvider } from "wagmi";

const config = getWagmiConfig();

export function Providers({
  initialState,
  children,
}: {
  initialState?: State;
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60,
          },
        },
      }),
  );

  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <NftModalProvider>{children}</NftModalProvider>
        </ToastProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
