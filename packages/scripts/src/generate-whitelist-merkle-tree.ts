import { type WhitelistLeaf } from "@lilburn/types";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getAddress, isAddress, type Address } from "viem";

const addressesPath = process.argv[2];

if (!addressesPath) {
  console.error("Error: addresses file path missing");

  process.exit(1);
}

const lines = (await readFile(addressesPath, "utf-8"))
  .split("\n")
  .map((line) => line.trim())
  .filter((line) => line.length);

const { addresses, invalid } = lines.reduce(
  (out, line) => {
    if (isAddress(line, { strict: false })) {
      out.addresses.push(getAddress(line));
    } else {
      out.invalid.push(line);
    }

    return out;
  },
  { addresses: [] as Address[], invalid: [] as string[] },
);

if (invalid.length > 0) {
  console.warn(
    `Error: ${invalid.length} invalid ${invalid.length > 1 ? "addresses" : "address"} found:`,
  );

  for (const address of invalid) {
    console.warn(`${address}`);
  }
}

const unique = [...new Set(addresses)].sort();

if (unique.length === 0) {
  console.error("Error: no valid addresses found");

  process.exit(1);
}

console.log("\nWhitelist Merkle Tree");
console.log(`Input: ${addressesPath}`);
console.log(`Addresses: ${lines.length} (${unique.length} unique)\n`);

const tree = StandardMerkleTree.of<WhitelistLeaf>(
  unique.map((address) => [address]),
  ["address"],
);

const outputDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../output",
);

await mkdir(outputDir, { recursive: true });

const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

const filename = `whitelist-${timestamp}.json`;

const filepath = path.join(outputDir, filename);

const outputData = {
  source: path.resolve(addressesPath),
  generatedAt: new Date().toISOString(),
  merkleRoot: tree.root,
  addressCount: unique.length,
  addresses: unique,
  tree: tree.dump(),
};

await writeFile(filepath, JSON.stringify(outputData, null, 2));

console.error(`Saved to: ${filepath}`);
console.log(`Merkle root: ${tree.root}`);
