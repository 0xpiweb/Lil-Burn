import {
  createReadContract,
  createSimulateContract,
  createWatchContractEvent,
  createWriteContract,
} from "wagmi/codegen";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// LilBurn
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * -
 * - [__View Contract on Avalanche Fuji Snow Trace__](https://testnet.snowtrace.io/address/0xEff143eF02060C8e3D2412299f04054BC1b603E5)
 * - [__View Contract on Avalanche Snow Trace__](https://snowtrace.io/address/0xF3513f263994A3536cc0A684209013d6808fE443)
 */
export const lilBurnAbi = [
  {
    type: "function",
    inputs: [],
    name: "MAX_PUBLIC_MINT",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "MAX_SUPPLY",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "MINT_PRICE",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "owner", internalType: "address", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "burnCount",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "quantity", internalType: "uint256", type: "uint256" },
      { name: "maxQuantity", internalType: "uint256", type: "uint256" },
      { name: "proof", internalType: "bytes32[]", type: "bytes32[]" },
    ],
    name: "holderMint",
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    inputs: [{ name: "", internalType: "address", type: "address" }],
    name: "holderMintCount",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "holderStart",
    outputs: [{ name: "", internalType: "uint64", type: "uint64" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "mintPhase",
    outputs: [
      { name: "", internalType: "enum LilBurn.MintPhase", type: "uint8" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "nextTokenId",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "paused",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "quantity", internalType: "uint256", type: "uint256" }],
    name: "publicMint",
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    inputs: [],
    name: "publicStart",
    outputs: [{ name: "", internalType: "uint64", type: "uint64" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "owner", internalType: "address", type: "address" }],
    name: "tokensOfOwner",
    outputs: [{ name: "", internalType: "uint256[]", type: "uint256[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "quantity", internalType: "uint256", type: "uint256" },
      { name: "proof", internalType: "bytes32[]", type: "bytes32[]" },
    ],
    name: "whitelistMint",
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    inputs: [{ name: "", internalType: "address", type: "address" }],
    name: "whitelistMintCount",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "whitelistStart",
    outputs: [{ name: "", internalType: "uint64", type: "uint64" }],
    stateMutability: "view",
  },
] as const;

/**
 * -
 * - [__View Contract on Avalanche Fuji Snow Trace__](https://testnet.snowtrace.io/address/0xEff143eF02060C8e3D2412299f04054BC1b603E5)
 * - [__View Contract on Avalanche Snow Trace__](https://snowtrace.io/address/0xF3513f263994A3536cc0A684209013d6808fE443)
 */
export const lilBurnAddress = {
  31337: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  43113: "0xEff143eF02060C8e3D2412299f04054BC1b603E5",
  43114: "0xF3513f263994A3536cc0A684209013d6808fE443",
} as const;

/**
 * -
 * - [__View Contract on Avalanche Fuji Snow Trace__](https://testnet.snowtrace.io/address/0xEff143eF02060C8e3D2412299f04054BC1b603E5)
 * - [__View Contract on Avalanche Snow Trace__](https://snowtrace.io/address/0xF3513f263994A3536cc0A684209013d6808fE443)
 */
export const lilBurnConfig = {
  address: lilBurnAddress,
  abi: lilBurnAbi,
} as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// WarChest
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * -
 * - [__View Contract on Avalanche Fuji Snow Trace__](https://testnet.snowtrace.io/address/0xAA0EA56C3BAc0102FFb0f739029413F6511aa4A7)
 * - [__View Contract on Avalanche Snow Trace__](https://snowtrace.io/address/0x0000000000000000000000000000000000000000)
 */
export const warChestAbi = [
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "donor",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "epoch",
        internalType: "uint256",
        type: "uint256",
        indexed: true,
      },
      {
        name: "amount",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
    ],
    name: "Donated",
  },
  {
    type: "function",
    inputs: [],
    name: "MIN_DONATION",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "currentEpoch",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "donate",
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    inputs: [],
    name: "totalDonated",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "totalDonations",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "totalDonors",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
] as const;

/**
 * -
 * - [__View Contract on Avalanche Fuji Snow Trace__](https://testnet.snowtrace.io/address/0xAA0EA56C3BAc0102FFb0f739029413F6511aa4A7)
 * - [__View Contract on Avalanche Snow Trace__](https://snowtrace.io/address/0x0000000000000000000000000000000000000000)
 */
export const warChestAddress = {
  31337: "0x0165878A594ca255338adfa4d48449f69242Eb8F",
  43113: "0xAA0EA56C3BAc0102FFb0f739029413F6511aa4A7",
  43114: "0x0000000000000000000000000000000000000000",
} as const;

/**
 * -
 * - [__View Contract on Avalanche Fuji Snow Trace__](https://testnet.snowtrace.io/address/0xAA0EA56C3BAc0102FFb0f739029413F6511aa4A7)
 * - [__View Contract on Avalanche Snow Trace__](https://snowtrace.io/address/0x0000000000000000000000000000000000000000)
 */
export const warChestConfig = {
  address: warChestAddress,
  abi: warChestAbi,
} as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Action
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link lilBurnAbi}__
 *
 * -
 * - [__View Contract on Avalanche Fuji Snow Trace__](https://testnet.snowtrace.io/address/0xEff143eF02060C8e3D2412299f04054BC1b603E5)
 * - [__View Contract on Avalanche Snow Trace__](https://snowtrace.io/address/0xF3513f263994A3536cc0A684209013d6808fE443)
 */
export const readLilBurn = /*#__PURE__*/ createReadContract({
  abi: lilBurnAbi,
  address: lilBurnAddress,
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link lilBurnAbi}__ and `functionName` set to `"MAX_PUBLIC_MINT"`
 *
 * -
 * - [__View Contract on Avalanche Fuji Snow Trace__](https://testnet.snowtrace.io/address/0xEff143eF02060C8e3D2412299f04054BC1b603E5)
 * - [__View Contract on Avalanche Snow Trace__](https://snowtrace.io/address/0xF3513f263994A3536cc0A684209013d6808fE443)
 */
export const readLilBurnMaxPublicMint = /*#__PURE__*/ createReadContract({
  abi: lilBurnAbi,
  address: lilBurnAddress,
  functionName: "MAX_PUBLIC_MINT",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link lilBurnAbi}__ and `functionName` set to `"MAX_SUPPLY"`
 *
 * -
 * - [__View Contract on Avalanche Fuji Snow Trace__](https://testnet.snowtrace.io/address/0xEff143eF02060C8e3D2412299f04054BC1b603E5)
 * - [__View Contract on Avalanche Snow Trace__](https://snowtrace.io/address/0xF3513f263994A3536cc0A684209013d6808fE443)
 */
export const readLilBurnMaxSupply = /*#__PURE__*/ createReadContract({
  abi: lilBurnAbi,
  address: lilBurnAddress,
  functionName: "MAX_SUPPLY",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link lilBurnAbi}__ and `functionName` set to `"MINT_PRICE"`
 *
 * -
 * - [__View Contract on Avalanche Fuji Snow Trace__](https://testnet.snowtrace.io/address/0xEff143eF02060C8e3D2412299f04054BC1b603E5)
 * - [__View Contract on Avalanche Snow Trace__](https://snowtrace.io/address/0xF3513f263994A3536cc0A684209013d6808fE443)
 */
export const readLilBurnMintPrice = /*#__PURE__*/ createReadContract({
  abi: lilBurnAbi,
  address: lilBurnAddress,
  functionName: "MINT_PRICE",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link lilBurnAbi}__ and `functionName` set to `"balanceOf"`
 *
 * -
 * - [__View Contract on Avalanche Fuji Snow Trace__](https://testnet.snowtrace.io/address/0xEff143eF02060C8e3D2412299f04054BC1b603E5)
 * - [__View Contract on Avalanche Snow Trace__](https://snowtrace.io/address/0xF3513f263994A3536cc0A684209013d6808fE443)
 */
export const readLilBurnBalanceOf = /*#__PURE__*/ createReadContract({
  abi: lilBurnAbi,
  address: lilBurnAddress,
  functionName: "balanceOf",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link lilBurnAbi}__ and `functionName` set to `"burnCount"`
 *
 * -
 * - [__View Contract on Avalanche Fuji Snow Trace__](https://testnet.snowtrace.io/address/0xEff143eF02060C8e3D2412299f04054BC1b603E5)
 * - [__View Contract on Avalanche Snow Trace__](https://snowtrace.io/address/0xF3513f263994A3536cc0A684209013d6808fE443)
 */
export const readLilBurnBurnCount = /*#__PURE__*/ createReadContract({
  abi: lilBurnAbi,
  address: lilBurnAddress,
  functionName: "burnCount",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link lilBurnAbi}__ and `functionName` set to `"holderMintCount"`
 *
 * -
 * - [__View Contract on Avalanche Fuji Snow Trace__](https://testnet.snowtrace.io/address/0xEff143eF02060C8e3D2412299f04054BC1b603E5)
 * - [__View Contract on Avalanche Snow Trace__](https://snowtrace.io/address/0xF3513f263994A3536cc0A684209013d6808fE443)
 */
export const readLilBurnHolderMintCount = /*#__PURE__*/ createReadContract({
  abi: lilBurnAbi,
  address: lilBurnAddress,
  functionName: "holderMintCount",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link lilBurnAbi}__ and `functionName` set to `"holderStart"`
 *
 * -
 * - [__View Contract on Avalanche Fuji Snow Trace__](https://testnet.snowtrace.io/address/0xEff143eF02060C8e3D2412299f04054BC1b603E5)
 * - [__View Contract on Avalanche Snow Trace__](https://snowtrace.io/address/0xF3513f263994A3536cc0A684209013d6808fE443)
 */
export const readLilBurnHolderStart = /*#__PURE__*/ createReadContract({
  abi: lilBurnAbi,
  address: lilBurnAddress,
  functionName: "holderStart",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link lilBurnAbi}__ and `functionName` set to `"mintPhase"`
 *
 * -
 * - [__View Contract on Avalanche Fuji Snow Trace__](https://testnet.snowtrace.io/address/0xEff143eF02060C8e3D2412299f04054BC1b603E5)
 * - [__View Contract on Avalanche Snow Trace__](https://snowtrace.io/address/0xF3513f263994A3536cc0A684209013d6808fE443)
 */
export const readLilBurnMintPhase = /*#__PURE__*/ createReadContract({
  abi: lilBurnAbi,
  address: lilBurnAddress,
  functionName: "mintPhase",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link lilBurnAbi}__ and `functionName` set to `"nextTokenId"`
 *
 * -
 * - [__View Contract on Avalanche Fuji Snow Trace__](https://testnet.snowtrace.io/address/0xEff143eF02060C8e3D2412299f04054BC1b603E5)
 * - [__View Contract on Avalanche Snow Trace__](https://snowtrace.io/address/0xF3513f263994A3536cc0A684209013d6808fE443)
 */
export const readLilBurnNextTokenId = /*#__PURE__*/ createReadContract({
  abi: lilBurnAbi,
  address: lilBurnAddress,
  functionName: "nextTokenId",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link lilBurnAbi}__ and `functionName` set to `"paused"`
 *
 * -
 * - [__View Contract on Avalanche Fuji Snow Trace__](https://testnet.snowtrace.io/address/0xEff143eF02060C8e3D2412299f04054BC1b603E5)
 * - [__View Contract on Avalanche Snow Trace__](https://snowtrace.io/address/0xF3513f263994A3536cc0A684209013d6808fE443)
 */
export const readLilBurnPaused = /*#__PURE__*/ createReadContract({
  abi: lilBurnAbi,
  address: lilBurnAddress,
  functionName: "paused",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link lilBurnAbi}__ and `functionName` set to `"publicStart"`
 *
 * -
 * - [__View Contract on Avalanche Fuji Snow Trace__](https://testnet.snowtrace.io/address/0xEff143eF02060C8e3D2412299f04054BC1b603E5)
 * - [__View Contract on Avalanche Snow Trace__](https://snowtrace.io/address/0xF3513f263994A3536cc0A684209013d6808fE443)
 */
export const readLilBurnPublicStart = /*#__PURE__*/ createReadContract({
  abi: lilBurnAbi,
  address: lilBurnAddress,
  functionName: "publicStart",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link lilBurnAbi}__ and `functionName` set to `"tokensOfOwner"`
 *
 * -
 * - [__View Contract on Avalanche Fuji Snow Trace__](https://testnet.snowtrace.io/address/0xEff143eF02060C8e3D2412299f04054BC1b603E5)
 * - [__View Contract on Avalanche Snow Trace__](https://snowtrace.io/address/0xF3513f263994A3536cc0A684209013d6808fE443)
 */
export const readLilBurnTokensOfOwner = /*#__PURE__*/ createReadContract({
  abi: lilBurnAbi,
  address: lilBurnAddress,
  functionName: "tokensOfOwner",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link lilBurnAbi}__ and `functionName` set to `"totalSupply"`
 *
 * -
 * - [__View Contract on Avalanche Fuji Snow Trace__](https://testnet.snowtrace.io/address/0xEff143eF02060C8e3D2412299f04054BC1b603E5)
 * - [__View Contract on Avalanche Snow Trace__](https://snowtrace.io/address/0xF3513f263994A3536cc0A684209013d6808fE443)
 */
export const readLilBurnTotalSupply = /*#__PURE__*/ createReadContract({
  abi: lilBurnAbi,
  address: lilBurnAddress,
  functionName: "totalSupply",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link lilBurnAbi}__ and `functionName` set to `"whitelistMintCount"`
 *
 * -
 * - [__View Contract on Avalanche Fuji Snow Trace__](https://testnet.snowtrace.io/address/0xEff143eF02060C8e3D2412299f04054BC1b603E5)
 * - [__View Contract on Avalanche Snow Trace__](https://snowtrace.io/address/0xF3513f263994A3536cc0A684209013d6808fE443)
 */
export const readLilBurnWhitelistMintCount = /*#__PURE__*/ createReadContract({
  abi: lilBurnAbi,
  address: lilBurnAddress,
  functionName: "whitelistMintCount",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link lilBurnAbi}__ and `functionName` set to `"whitelistStart"`
 *
 * -
 * - [__View Contract on Avalanche Fuji Snow Trace__](https://testnet.snowtrace.io/address/0xEff143eF02060C8e3D2412299f04054BC1b603E5)
 * - [__View Contract on Avalanche Snow Trace__](https://snowtrace.io/address/0xF3513f263994A3536cc0A684209013d6808fE443)
 */
export const readLilBurnWhitelistStart = /*#__PURE__*/ createReadContract({
  abi: lilBurnAbi,
  address: lilBurnAddress,
  functionName: "whitelistStart",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link lilBurnAbi}__
 *
 * -
 * - [__View Contract on Avalanche Fuji Snow Trace__](https://testnet.snowtrace.io/address/0xEff143eF02060C8e3D2412299f04054BC1b603E5)
 * - [__View Contract on Avalanche Snow Trace__](https://snowtrace.io/address/0xF3513f263994A3536cc0A684209013d6808fE443)
 */
export const writeLilBurn = /*#__PURE__*/ createWriteContract({
  abi: lilBurnAbi,
  address: lilBurnAddress,
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link lilBurnAbi}__ and `functionName` set to `"holderMint"`
 *
 * -
 * - [__View Contract on Avalanche Fuji Snow Trace__](https://testnet.snowtrace.io/address/0xEff143eF02060C8e3D2412299f04054BC1b603E5)
 * - [__View Contract on Avalanche Snow Trace__](https://snowtrace.io/address/0xF3513f263994A3536cc0A684209013d6808fE443)
 */
export const writeLilBurnHolderMint = /*#__PURE__*/ createWriteContract({
  abi: lilBurnAbi,
  address: lilBurnAddress,
  functionName: "holderMint",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link lilBurnAbi}__ and `functionName` set to `"publicMint"`
 *
 * -
 * - [__View Contract on Avalanche Fuji Snow Trace__](https://testnet.snowtrace.io/address/0xEff143eF02060C8e3D2412299f04054BC1b603E5)
 * - [__View Contract on Avalanche Snow Trace__](https://snowtrace.io/address/0xF3513f263994A3536cc0A684209013d6808fE443)
 */
export const writeLilBurnPublicMint = /*#__PURE__*/ createWriteContract({
  abi: lilBurnAbi,
  address: lilBurnAddress,
  functionName: "publicMint",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link lilBurnAbi}__ and `functionName` set to `"whitelistMint"`
 *
 * -
 * - [__View Contract on Avalanche Fuji Snow Trace__](https://testnet.snowtrace.io/address/0xEff143eF02060C8e3D2412299f04054BC1b603E5)
 * - [__View Contract on Avalanche Snow Trace__](https://snowtrace.io/address/0xF3513f263994A3536cc0A684209013d6808fE443)
 */
export const writeLilBurnWhitelistMint = /*#__PURE__*/ createWriteContract({
  abi: lilBurnAbi,
  address: lilBurnAddress,
  functionName: "whitelistMint",
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link lilBurnAbi}__
 *
 * -
 * - [__View Contract on Avalanche Fuji Snow Trace__](https://testnet.snowtrace.io/address/0xEff143eF02060C8e3D2412299f04054BC1b603E5)
 * - [__View Contract on Avalanche Snow Trace__](https://snowtrace.io/address/0xF3513f263994A3536cc0A684209013d6808fE443)
 */
export const simulateLilBurn = /*#__PURE__*/ createSimulateContract({
  abi: lilBurnAbi,
  address: lilBurnAddress,
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link lilBurnAbi}__ and `functionName` set to `"holderMint"`
 *
 * -
 * - [__View Contract on Avalanche Fuji Snow Trace__](https://testnet.snowtrace.io/address/0xEff143eF02060C8e3D2412299f04054BC1b603E5)
 * - [__View Contract on Avalanche Snow Trace__](https://snowtrace.io/address/0xF3513f263994A3536cc0A684209013d6808fE443)
 */
export const simulateLilBurnHolderMint = /*#__PURE__*/ createSimulateContract({
  abi: lilBurnAbi,
  address: lilBurnAddress,
  functionName: "holderMint",
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link lilBurnAbi}__ and `functionName` set to `"publicMint"`
 *
 * -
 * - [__View Contract on Avalanche Fuji Snow Trace__](https://testnet.snowtrace.io/address/0xEff143eF02060C8e3D2412299f04054BC1b603E5)
 * - [__View Contract on Avalanche Snow Trace__](https://snowtrace.io/address/0xF3513f263994A3536cc0A684209013d6808fE443)
 */
export const simulateLilBurnPublicMint = /*#__PURE__*/ createSimulateContract({
  abi: lilBurnAbi,
  address: lilBurnAddress,
  functionName: "publicMint",
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link lilBurnAbi}__ and `functionName` set to `"whitelistMint"`
 *
 * -
 * - [__View Contract on Avalanche Fuji Snow Trace__](https://testnet.snowtrace.io/address/0xEff143eF02060C8e3D2412299f04054BC1b603E5)
 * - [__View Contract on Avalanche Snow Trace__](https://snowtrace.io/address/0xF3513f263994A3536cc0A684209013d6808fE443)
 */
export const simulateLilBurnWhitelistMint =
  /*#__PURE__*/ createSimulateContract({
    abi: lilBurnAbi,
    address: lilBurnAddress,
    functionName: "whitelistMint",
  });

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link warChestAbi}__
 *
 * -
 * - [__View Contract on Avalanche Fuji Snow Trace__](https://testnet.snowtrace.io/address/0xAA0EA56C3BAc0102FFb0f739029413F6511aa4A7)
 * - [__View Contract on Avalanche Snow Trace__](https://snowtrace.io/address/0x0000000000000000000000000000000000000000)
 */
export const readWarChest = /*#__PURE__*/ createReadContract({
  abi: warChestAbi,
  address: warChestAddress,
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link warChestAbi}__ and `functionName` set to `"MIN_DONATION"`
 *
 * -
 * - [__View Contract on Avalanche Fuji Snow Trace__](https://testnet.snowtrace.io/address/0xAA0EA56C3BAc0102FFb0f739029413F6511aa4A7)
 * - [__View Contract on Avalanche Snow Trace__](https://snowtrace.io/address/0x0000000000000000000000000000000000000000)
 */
export const readWarChestMinDonation = /*#__PURE__*/ createReadContract({
  abi: warChestAbi,
  address: warChestAddress,
  functionName: "MIN_DONATION",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link warChestAbi}__ and `functionName` set to `"currentEpoch"`
 *
 * -
 * - [__View Contract on Avalanche Fuji Snow Trace__](https://testnet.snowtrace.io/address/0xAA0EA56C3BAc0102FFb0f739029413F6511aa4A7)
 * - [__View Contract on Avalanche Snow Trace__](https://snowtrace.io/address/0x0000000000000000000000000000000000000000)
 */
export const readWarChestCurrentEpoch = /*#__PURE__*/ createReadContract({
  abi: warChestAbi,
  address: warChestAddress,
  functionName: "currentEpoch",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link warChestAbi}__ and `functionName` set to `"totalDonated"`
 *
 * -
 * - [__View Contract on Avalanche Fuji Snow Trace__](https://testnet.snowtrace.io/address/0xAA0EA56C3BAc0102FFb0f739029413F6511aa4A7)
 * - [__View Contract on Avalanche Snow Trace__](https://snowtrace.io/address/0x0000000000000000000000000000000000000000)
 */
export const readWarChestTotalDonated = /*#__PURE__*/ createReadContract({
  abi: warChestAbi,
  address: warChestAddress,
  functionName: "totalDonated",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link warChestAbi}__ and `functionName` set to `"totalDonations"`
 *
 * -
 * - [__View Contract on Avalanche Fuji Snow Trace__](https://testnet.snowtrace.io/address/0xAA0EA56C3BAc0102FFb0f739029413F6511aa4A7)
 * - [__View Contract on Avalanche Snow Trace__](https://snowtrace.io/address/0x0000000000000000000000000000000000000000)
 */
export const readWarChestTotalDonations = /*#__PURE__*/ createReadContract({
  abi: warChestAbi,
  address: warChestAddress,
  functionName: "totalDonations",
});

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link warChestAbi}__ and `functionName` set to `"totalDonors"`
 *
 * -
 * - [__View Contract on Avalanche Fuji Snow Trace__](https://testnet.snowtrace.io/address/0xAA0EA56C3BAc0102FFb0f739029413F6511aa4A7)
 * - [__View Contract on Avalanche Snow Trace__](https://snowtrace.io/address/0x0000000000000000000000000000000000000000)
 */
export const readWarChestTotalDonors = /*#__PURE__*/ createReadContract({
  abi: warChestAbi,
  address: warChestAddress,
  functionName: "totalDonors",
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link warChestAbi}__
 *
 * -
 * - [__View Contract on Avalanche Fuji Snow Trace__](https://testnet.snowtrace.io/address/0xAA0EA56C3BAc0102FFb0f739029413F6511aa4A7)
 * - [__View Contract on Avalanche Snow Trace__](https://snowtrace.io/address/0x0000000000000000000000000000000000000000)
 */
export const writeWarChest = /*#__PURE__*/ createWriteContract({
  abi: warChestAbi,
  address: warChestAddress,
});

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link warChestAbi}__ and `functionName` set to `"donate"`
 *
 * -
 * - [__View Contract on Avalanche Fuji Snow Trace__](https://testnet.snowtrace.io/address/0xAA0EA56C3BAc0102FFb0f739029413F6511aa4A7)
 * - [__View Contract on Avalanche Snow Trace__](https://snowtrace.io/address/0x0000000000000000000000000000000000000000)
 */
export const writeWarChestDonate = /*#__PURE__*/ createWriteContract({
  abi: warChestAbi,
  address: warChestAddress,
  functionName: "donate",
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link warChestAbi}__
 *
 * -
 * - [__View Contract on Avalanche Fuji Snow Trace__](https://testnet.snowtrace.io/address/0xAA0EA56C3BAc0102FFb0f739029413F6511aa4A7)
 * - [__View Contract on Avalanche Snow Trace__](https://snowtrace.io/address/0x0000000000000000000000000000000000000000)
 */
export const simulateWarChest = /*#__PURE__*/ createSimulateContract({
  abi: warChestAbi,
  address: warChestAddress,
});

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link warChestAbi}__ and `functionName` set to `"donate"`
 *
 * -
 * - [__View Contract on Avalanche Fuji Snow Trace__](https://testnet.snowtrace.io/address/0xAA0EA56C3BAc0102FFb0f739029413F6511aa4A7)
 * - [__View Contract on Avalanche Snow Trace__](https://snowtrace.io/address/0x0000000000000000000000000000000000000000)
 */
export const simulateWarChestDonate = /*#__PURE__*/ createSimulateContract({
  abi: warChestAbi,
  address: warChestAddress,
  functionName: "donate",
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link warChestAbi}__
 *
 * -
 * - [__View Contract on Avalanche Fuji Snow Trace__](https://testnet.snowtrace.io/address/0xAA0EA56C3BAc0102FFb0f739029413F6511aa4A7)
 * - [__View Contract on Avalanche Snow Trace__](https://snowtrace.io/address/0x0000000000000000000000000000000000000000)
 */
export const watchWarChestEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: warChestAbi,
  address: warChestAddress,
});

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link warChestAbi}__ and `eventName` set to `"Donated"`
 *
 * -
 * - [__View Contract on Avalanche Fuji Snow Trace__](https://testnet.snowtrace.io/address/0xAA0EA56C3BAc0102FFb0f739029413F6511aa4A7)
 * - [__View Contract on Avalanche Snow Trace__](https://snowtrace.io/address/0x0000000000000000000000000000000000000000)
 */
export const watchWarChestDonatedEvent = /*#__PURE__*/ createWatchContractEvent(
  { abi: warChestAbi, address: warChestAddress, eventName: "Donated" },
);
