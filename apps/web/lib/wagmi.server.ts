import "server-only";
import { createPublicClient, http } from "viem";
import { avalanche, avalancheFuji, hardhat } from "viem/chains";

function createClient() {
  switch (process.env.NEXT_PUBLIC_CHAIN) {
    case "localhost":
      return createPublicClient({
        chain: hardhat,
        transport: http("http://127.0.0.1:8545"),
      });

    case "avalancheFuji":
      return createPublicClient({ chain: avalancheFuji, transport: http() });

    case "avalanche":
      return createPublicClient({ chain: avalanche, transport: http() });

    default:
      throw new Error("NEXT_PUBLIC_CHAIN not set");
  }
}

export const publicClient = createClient();
