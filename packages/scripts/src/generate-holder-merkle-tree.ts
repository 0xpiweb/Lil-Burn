import { HolderLeaf } from "@lilburn/types";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { type Address } from "viem";

const MAX_PER_ADDRESS = 10;

const snapshotPath = process.argv[2];

if (!snapshotPath) {
  console.error("Error: snapshot file path missing");

  process.exit(1);
}

const {
  contractAddress,
  chain,
  chainId,
  snapshotBlock,
  snapshotTimestamp,
  holderCount,
  holders: rawHolders,
} = JSON.parse(await readFile(snapshotPath, "utf-8"));

const holders: HolderLeaf[] = (rawHolders as [string, string][]).map(
  ([address, count]) => [
    address as Address,
    BigInt(Math.min(Number(count), MAX_PER_ADDRESS)),
  ],
);

console.log("Holder Merkle Tree");
console.log(`Contract: ${contractAddress}`);
console.log(`Chain: ${chain} (${chainId})`);
console.log(`Snapshot: block ${snapshotBlock} at ${snapshotTimestamp}`);
console.log(`Holders: ${holderCount}\n`);

const tree = StandardMerkleTree.of<HolderLeaf>(holders, ["address", "uint256"]);

console.log(tree.root);

const outputDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../output",
);

await mkdir(outputDir, { recursive: true });

const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

const filename = `holder-merkle-${contractAddress}-${timestamp}.json`;

const filepath = path.join(outputDir, filename);

const outputData = {
  snapshotFile: path.resolve(snapshotPath),
  contractAddress,
  chain,
  chainId,
  snapshotBlock,
  snapshotTimestamp,
  generatedAt: new Date().toISOString(),
  merkleRoot: tree.root,
  holderCount,
  holders: holders.map(([address, count]) => [address, count.toString()]),
  tree: tree.dump(),
};

await writeFile(
  filepath,
  JSON.stringify(
    outputData,
    (_, value) => (typeof value === "bigint" ? value.toString() : value),
    2,
  ),
);

console.log(`Saved to: ${filepath}`);
console.log(`Merkle root: ${tree.root}`);
