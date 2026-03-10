import hardhatToolboxViemPlugin from "@nomicfoundation/hardhat-toolbox-viem";
import hardhatVerify from "@nomicfoundation/hardhat-verify";
import { configVariable, defineConfig, emptyTask } from "hardhat/config";
import { avalanche, avalancheFuji, hardhat } from "viem/chains";
import { lilburnOwnerMints } from "./tasks/lilburn/owner-mints.js";
import { lilburnSetBaseUri } from "./tasks/lilburn/set-base-uri.js";
import { lilburnSetMerkleRoots } from "./tasks/lilburn/set-merkle-roots.js";
import { lilburnSetMintPhases } from "./tasks/lilburn/set-mint-phases.js";
import { lilburnSetPaused } from "./tasks/lilburn/set-paused.js";
import { lilburnTransferOwnership } from "./tasks/lilburn/transfer-ownership.js";
import { warchestTransferOwnership } from "./tasks/warchest/transfer-ownership.js";

if (process.env.NODE_ENV !== "test") {
  try {
    process.loadEnvFile();
    console.log("loaded .env");
  } catch {
    console.log("no .env file found");
  }

  const networkArgIndex = process.argv.indexOf("--network");

  const networkArg =
    networkArgIndex !== -1 ? process.argv[networkArgIndex + 1] : undefined;

  if (networkArg && networkArg !== "simulated") {
    try {
      process.loadEnvFile(`.env.${networkArg}`);
      console.log(`loaded .env.${networkArg}`);
    } catch {
      console.log(`no .env.${networkArg} file found`);
    }
  }
}

export default defineConfig({
  plugins: [hardhatVerify, hardhatToolboxViemPlugin],
  tasks: [
    emptyTask("lilburn", "LilBurn contract management").build(),
    lilburnOwnerMints(),
    lilburnSetBaseUri(),
    lilburnSetMerkleRoots(),
    lilburnSetMintPhases(),
    lilburnSetPaused(),
    lilburnTransferOwnership(),

    emptyTask("warchest", "WarChest contract management").build(),
    warchestTransferOwnership(),
  ],
  solidity: {
    profiles: {
      default: {
        version: "0.8.28",
      },
      production: {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  },
  verify: {
    etherscan: {
      apiKey: configVariable("SNOWTRACE_API_KEY"),
    },
    sourcify: {
      enabled: true,
    },
  },
  chainDescriptors: {
    [avalancheFuji.id]: {
      name: "Avalanche Fuji",
      blockExplorers: {
        etherscan: {
          name: "Snowtrace",
          url: "https://testnet.snowtrace.io",
          apiUrl:
            "https://api.routescan.io/v2/network/testnet/evm/43113/etherscan",
        },
      },
    },
    [avalanche.id]: {
      name: "Avalanche",
      blockExplorers: {
        etherscan: {
          name: "Snowtrace",
          url: "https://snowtrace.io",
          apiUrl:
            "https://api.routescan.io/v2/network/mainnet/evm/43114/etherscan",
        },
      },
    },
  },
  networks: {
    simulated: {
      type: "edr-simulated",
      chainType: "l1",
    },
    localhost: {
      type: "http",
      chainId: hardhat.id,
      chainType: "l1",
      url: "http://127.0.0.1:8545",
      accounts: [configVariable("DEPLOY_PK")],
    },
    avalancheFuji: {
      chainId: avalancheFuji.id,
      type: "http",
      chainType: "l1",
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      accounts: [configVariable("DEPLOY_PK")],
      ignition: {
        explorerUrl: "https://testnet.snowtrace.io/tx",
      },
    },
    avalanche: {
      chainId: avalanche.id,
      type: "http",
      chainType: "l1",
      url: "https://api.avax.network/ext/bc/C/rpc",
      accounts: [configVariable("DEPLOY_PK")],
      ignition: {
        explorerUrl: "https://snowtrace.io/tx",
      },
    },
  },
});
