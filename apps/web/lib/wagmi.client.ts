import { cookieStorage, createConfig, createStorage, http } from "wagmi";
import { getPublicClient } from "wagmi/actions";
import { avalanche, avalancheFuji, hardhat } from "wagmi/chains";
import { walletConnect } from "wagmi/connectors";

const connectors = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID
  ? [
      walletConnect({
        projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
      }),
    ]
  : [];

export function getWagmiConfig() {
  const shared = {
    ssr: true,
    storage: createStorage({ storage: cookieStorage }),
    connectors,
  };

  switch (process.env.NEXT_PUBLIC_CHAIN) {
    case "localhost":
      return createConfig({
        ...shared,
        chains: [hardhat],
        transports: { [hardhat.id]: http("http://127.0.0.1:8545") },
      });

    case "avalancheFuji":
      return createConfig({
        ...shared,
        chains: [avalancheFuji],
        transports: { [avalancheFuji.id]: http() },
      });

    case "avalanche":
      return createConfig({
        ...shared,
        chains: [avalanche],
        transports: { [avalanche.id]: http() },
      });

    default:
      throw new Error("NEXT_PUBLIC_CHAIN not set");
  }
}

export const publicClient = getPublicClient(getWagmiConfig());

declare module "wagmi" {
  interface Register {
    config: ReturnType<typeof getWagmiConfig>;
  }
}
