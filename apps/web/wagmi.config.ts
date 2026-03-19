import { defineConfig } from "@wagmi/cli";
import { actions, hardhat } from "@wagmi/cli/plugins";
import { zeroAddress } from "viem";
import {
  avalanche,
  avalancheFuji,
  hardhat as hardhatChain,
} from "wagmi/chains";

export default defineConfig({
  out: "generated.ts",
  plugins: [
    {
      name: "Hardhat",
      async contracts() {
        const contracts = await hardhat({
          project: "../../packages/contracts",
          deployments: {
            LilBurn: {
              [hardhatChain.id]: "0x5fbdb2315678afecb367f032d93f642f64180aa3",
              [avalancheFuji.id]: "0xEff143eF02060C8e3D2412299f04054BC1b603E5",
              [avalanche.id]: "0xF3513f263994A3536cc0A684209013d6808fE443",
            },
            WarChest: {
              [hardhatChain.id]: "0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0",
              [avalancheFuji.id]: "0x686F9aA85863D9153ccFc70D860F033a0a486ae3",
              [avalanche.id]: zeroAddress,
            },
          },
        }).contracts();
        return contracts
          .map((contract) => {
            switch (contract.name) {
              case "LilBurn": {
                return {
                  ...contract,
                  abi: contract.abi.filter((item) => {
                    switch (item.type) {
                      case "event":
                        return ["Transfer"].includes(item.name);

                      case "error":
                        return false;

                      case "function":
                        return [
                          "burnCount",
                          "MINT_PRICE",
                          "MAX_SUPPLY",
                          "paused",
                          "mintPhase",
                          "holderStart",
                          "whitelistStart",
                          "publicStart",
                          "totalSupply",
                          "holderMintCount",
                          "whitelistMintCount",
                          "publicMint",
                          "holderMint",
                          "whitelistMint",
                          "tokensOfOwner",
                          "balanceOf",
                          "MAX_PUBLIC_MINT",
                          "nextTokenId",
                          "tokensOfOwner",
                          "burn",
                        ].includes(item.name);
                    }
                  }),
                };
              }

              case "WarChest": {
                return {
                  ...contract,
                  abi: contract.abi.filter((item) => {
                    switch (item.type) {
                      case "event":
                        return ["Donated"].includes(item.name);

                      case "error":
                        return false;

                      case "function":
                        return [
                          "MIN_DONATION",
                          "donate",
                          "currentEpoch",
                          "nextEpochStart",
                        ].includes(item.name);
                    }
                  }),
                };
              }

              default:
                return null;
            }
          })
          .filter((contract) => contract !== null);
      },
    },
    actions(),
  ],
});
