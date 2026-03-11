# 🔥 Lil Burn (Lil-B)

### A Hyper-Deflationary NFT Survival Experiment on Avalanche

Lil Burn is a tactical NFT protocol where survival is the only goal. By deploying 90% of mint funds into Avalanche DeFi, the protocol generates autonomous yield to systematically buy back and burn the supply until only the **Final 100 Elite** remain.

---

## Project Status & Timeline

- **✅ Mint Completed:** 3-phase launch successfully concluded (March 4–5, 2026). Public phase sold out in **13 minutes**.
- **✅ Capital Deployed:** **1,800 $AVAX** (90% of total proceeds) converted to **$PHAR/$xPHAR** and staked in Pharaoh autovaults.
- **✅ Yield Active:** Initial **15.27 $AVAX** yield already harvested and secured in the Sweep Wallet for the March 19th Purge.
- **✅ Security:** **SHA-256 Hashed Manifest** published and embedded in the contract for pre-determined game fairness.

---

## The Protocol

### 1. Yield & Harvest (Active Status: Deployed)

- **The Execution:** Following the 100% sell-out of the 1,000 NFT collection, the protocol has finalized its core capital deployment:
  - **1,800 $AVAX Deployed**: 90% of total mint proceeds have been swapped for **$PHAR** and converted into **xPHAR**.
  - **Transparency**: All deployment transactions are verifiable via the official [DeFi Wallet](https://snowtrace.io/address/0x4E028063928b3135a6f74eD5543F5Cfae6D22F97).
  - **Autovault Staking**: The xPHAR is currently staked in Pharaoh’s **autovault**, generating continuous $WAVAX yield.
- **Current Performance:**
  - **Total Staked**: 1,800 $AVAX equivalent in xPHAR.
  - **Accrued Yield**: **15.27 $WAVAX** already harvested, 80% being held in the Buy-backs Wallet for the March 12th Purge.
    
- **The 80/20 Efficiency Rule:** Yield is harvested bi-weekly and distributed:
  - 🔥 **80% (The Purge Fund):** Used exclusively to sweep the Lil Burn floor.
  - 🐓 **5%:** Lil Coq Rewards (supporting ecosystem project).
  - 💎 **5%:** $LIL Staking Rewards (supporting ecosystem project).
  - 🛡️ **10%:** Team Treasury for ecosystem operations and future development.

### 2. The Purge (Bi-Weekly Execution)

The team enters the market every two weeks with one goal: **Delete the Floor.**

- **Ammunition:** 80% of harvested yield is converted to $AVAX.
- **Casualties:** The team market-buys the lowest-priced NFTs.
- **The Furnace:** Purchased NFTs are sent to a dead address forever.

### 3. The Purge Execution (Strategic Manual Sweep)

To ensure absolute fairness and adherence to protocol logic, "The Purge" is executed manually. This prevents "Dumb Bots" from sweeping the wrong assets and allows for precise tie-breaking:

1. **Scan:** The team identifies all NFTs listed at the current floor price.
2. **Priority Tie-Breaker:** In the event that multiple NFTs are listed at the same price, the team cross-references the **Sweep Score** (Mint Priority).
3. **Selection:** The NFT with the **Highest Sweep Score** (earlier mint) is selected for the Purge first.
4. **Execution:** This creates a tactical advantage for early minters: their "Floor Shield" is stronger, as they will be the first to be bought out by the team if they choose to exit at the floor.

---

## Architecture Overview

The Lil-Burn ecosystem is a closed-loop deflationary engine that converts NFT mint revenue and community contributions into persistent buy-pressure on the Avalanche C-Chain.

```mermaid
graph TD
    %% Revenue Streams
    A[Mint Revenue: 2,000 $AVAX] --> B{Treasury Split}
    B -->|90%| C[DeFi Multi-sig Wallet]
    B -->|10%| D[Operational Wallet]
    E[Community War Chest] -->|Donations| F[Node.js Indexer]

    %% Yield Engine (Manual DeFi)
    C -->|Manual Swap| G[Pharaoh Exchange: $PHAR]
    G -->|Convert| H[xPHAR Autovaults]
    H -->|Harvest| I[WAVAX Yield: 15.27+ Accrued]

    %% Data Layer
    F -->|Real-time Sync| J[(Backend Database)]
    J -->|API| K[War Chest Leaderboard]
    J -->|Metadata Logic| L[Cursed 100 Gallery]

    %% Execution (Floor War)
    I -->|Funding| M[Manual Sweep Wallet]
    M -->|Strategic Snipe| N[Secondary Markets: Salvor/Joepegs]
    N -->|Burn Transaction| O[0x00...dead Burn Address]

    %% Final Verification
    O -->|Supply Update| P[Yield Page Dashboard]
    O -->|ID Status Update| L
```

### 1. Technical Component Breakdown

- **Yield Engine**: A team-managed DeFi strategy. 1,800 $AVAX is systematically swapped for $PHAR and staked as xPHAR on Pharaoh Exchange. This generates continuous $WAVAX yield used for market buy-backs.
- **The War Chest**: A donation-based smart contract that triggers a Node.js indexer. It records donor data in a LiteSQL database to serve the real-time Quarterly Leaderboard.
- **Cursed ID Tracker**: A database-driven gallery that cross-references the "Cursed 100" NFT metadata against the burn address, allowing users to filter "At-Large" vs. "Graveyarded" assets.


### 2. Technical Stack

- **Smart Contracts**: Solidity (Avalanche C-Chain).
- **Frontend**: Next.js, Tailwind CSS.
- **Web3 Integration**: WalletConnect with custom network-switching logic.
- **Backend**: Node.js, Express, Database (for Leaderboards/Metadata).
- **DeFi Integration**: Pharaoh Exchange (xPHAR Autovaults).

- `apps/web` dAPP
- `packages/contracts` Smart contracts
- `packages/scripts` Snapshot, merkle tree, and metadata generation scripts
- `packages/types` Shared types

---

## Survival Mechanics

### 1. Sweep Score (Priority & Tie-Breaker)

Your mint order is your life insurance.

- **The Logic:** Earlier mints have higher scores (Mint #1 = 1,000; Mint #1,000 = 1).
- **The Shield:** If multiple NFTs are at the same floor price, the one with the **Highest Sweep Score** is bought and burned first. High-score holders can "match" the floor, while low-score holders must undercut to get out.

### 2. The Floor War (The Strategic Standoff)

Holders compete for the "exit lane" during the Purge Window.

- **The Sprint:** When the Purge budget is announced, holders race to undercut the floor to ensure they are the ones bought by the team.
- **The Result:** The winner gets the $AVAX; the loser stays in the game.

### 3. The War Chest (Community Weapon)

A transparent, public wallet where 100% of voluntary contributions are used to buy and burn NFTs.

- **Autonomous Trigger:** A "Tactical Sweep" occurs whenever the wallet balance matches the floor price.
- **Leaderboards:** Top donors (Burn Architects) earn rewards and airdrops.

---

## The Endgame

### 1. The Cursed 100 (The Landmines)

There are 100 "Cursed" NFT IDs hidden in the supply.

- **The Reveal:** As supply milestones (800, 600, etc.) are hit, the "Hashed Manifest" decrypts, revealing which IDs are Cursed.
- **The Strategy:** If your NFT is revealed as Cursed, you must use the Floor War to get swept/bought by the team. Cursed NFTs that reach the final 100 are **disqualified** from rewards.
- **The Hashed Manifest SHA-256** 77ed49d91ee65ff336660c769544e252a9d5ccb4a2fe2d428adbbc2a38b5b314

### 2. The Final 100 Elite

When the supply hits 100, the burn stops.

- **Concentrated Yield:** These 100 survivors become the sole beneficiaries of the perpetual yield engine.
- **The Survivor's Bonus:** Any yield meant for "Cursed" survivors is redistributed to the "Clean" holders.

---

## Official Links

- Website [lilburn.xyz](https://www.lilburn.xyz/)
- Whitepaper [GitBook](https://lil-ecosystem.gitbook.io/lil-burn)

- Contract [0xf3513f263994a3536cc0a684209013d6808fe443](https://snowtrace.io/address/0xf3513f263994a3536cc0a684209013d6808fe443)
- Mint Wallet [0x4d9C3d09109E7F31398FfE9d3c89F05c869eFafe](https://snowtrace.io/address/0x4d9C3d09109E7F31398FfE9d3c89F05c869eFafe)
- DeFi Wallet [0x4E028063928b3135a6f74eD5543F5Cfae6D22F97](https://snowtrace.io/address/0x4E028063928b3135a6f74eD5543F5Cfae6D22F97)
- Buy-backs Wallet [0x77f2F497a5649C62ed495A6588cF5Ad9E04dea79](https://snowtrace.io/address/0x77f2F497a5649C62ed495A6588cF5Ad9E04dea79)
- Burn Address [0x000000000000000000000000000000000000dEaD](https://snowtrace.io/address/0x000000000000000000000000000000000000dEaD)

- Marketplaces:
[Joepegs](https://joepegs.com/collections/avalanche/0xf3513f263994a3536cc0a684209013d6808fe443)
[Salvor](https://salvor.io/collections/0xf3513f263994a3536cc0a684209013d6808fe443)

- Socials:
[Twitter](https://x.com/LilCoqNft)
[Discord](https://discord.gg/uKSF7R2dJd)
