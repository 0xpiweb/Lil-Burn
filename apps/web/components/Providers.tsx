"use client";

import { getWagmiConfig } from "@/lib/wagmi.client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { State, WagmiProvider } from "wagmi";

const config = getWagmiConfig();

export function Providers({
  initialState,
  children,
}: {
  initialState?: State;
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
