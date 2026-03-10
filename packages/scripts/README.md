# Scripts

## `generate-snapshot`

Build the NFT holder snapshot

```sh
npm run generate-snapshot <contract_address> [starting_block]
```

- `contract_address` LilBurn contract address on Avalanche
- `starting_block` Optional block number to start the snapshot at, the script will try to find it otherwise

Outputs a JSON to `output/snapshot-<address>-<timestamp>.json`

---

## `verify-snapshot`

Verifies a snapshot generated with `generate-snapshot` on chain

```sh
npm run verify-snapshot <snapshot>
```

- `snapshot` Snapshot file path

---

## `generate-holder-merkle-tree`

Build the holder merkle tree from a snapshot generate with `generate-snapshot`

```sh
npm run generate-holder-merkle-tree <snapshot>
```

- `snapshot` Snapshot file path

Outputs a JSON to `output/holder-merkle-<address>-<timestamp>.json`

---

## `generate-whitelist-merkle-tree`

Builds the whitelist merkle tree from a file with one address per line

```sh
npm run generate-whitelist-merkle-tree <addresses>
```

- `addresses` Addresses file path

Outputs a JSON to `output/whitelist-<timestamp>.json`

---

## `generate-metadata`

Deterministically generate the metadata, using `METADATA_SEED`

```sh
npm run generate-metadata
```

It needs the following images named as `<artist> - <illustration>.png`

- `assets/1-1/` 5 png images
- `assets/Collection/` 25 png images

It outputs

- `output/unrevealed/` Unrevealed metadata
- `output/revealed/` Revealed metadata (cursed status hidden)
- `output/cursed/<supply>/` Cursed metadata revealed at each burn milestone (800, 600, 400, 250, 150, 100)
- `output/cursed/final/` Fully revealed metadata
- `output/cursed-assignment.json` The token that will be cursed at each interval
- `output/commitment-hash.txt` SHA-256 commitment to prove integrity

---

## `verify-metadata`

Compute the SHA-256 hash from `cursed-assignment.json`

```sh
npm run verify-metadata <cursed_assignment>
```

- `addresses` Cursed assignment json file path
