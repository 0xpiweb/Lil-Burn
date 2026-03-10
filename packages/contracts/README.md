# Contracts

```ts
type Network = "localhost" | "avalancheFuji" | "avalanche";
```

Variables are loaded from `.env.<network>`, and overwrite `.env`. They can also be passed directly to each task

## LilBurn

```sh
npx hardhat ignition deploy ignition/modules/LilBurn.ts --network <network>
npx hardhat verify --network <network> <contract_address> <initial_owner_address>
npx hardhat lilburn owner-mints --network <network>
npx hardhat lilburn set-base-uri --network <network>
npx hardhat lilburn set-merkle-roots --network <network>
npx hardhat lilburn set-mint-phases --network <network>
npx hardhat lilburn transfer-ownership --network <network>
```

## WarChest

```sh
npx hardhat ignition deploy ignition/modules/WarChest.ts --network <network>
npx hardhat verify --network <network> <contract_address> <initial_owner_address>
npx hardhat warchest transfer-ownership --network <network>
```
