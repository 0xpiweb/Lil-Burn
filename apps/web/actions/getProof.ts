"use server";

import { type Proof } from "@/types/Proof";
import { type SerializedHolderLeaf, type WhitelistLeaf } from "@lilburn/types";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { Hex, isAddress, isAddressEqual } from "viem";

export async function getProof(address: string): Promise<Proof> {
  if (!isAddress(address)) {
    throw new Error("Invalid address");
  }

  const chain = process.env.NEXT_PUBLIC_CHAIN;

  if (!chain) {
    throw new Error("CHAIN is not set");
  }

  const holderTreeFilename = `holder-tree-${chain}.json`;
  const whitelistTreeFilename = `whitelist-tree-${chain}.json`;

  let holderTreeRaw: string;
  let whitelistTreeRaw: string;

  const dataDir = join(process.cwd(), "data");

  try {
    [holderTreeRaw, whitelistTreeRaw] = await Promise.all([
      readFile(join(dataDir, holderTreeFilename), "utf-8"),
      readFile(join(dataDir, whitelistTreeFilename), "utf-8"),
    ]);
  } catch {
    throw new Error(
      `Tree file not found: ${holderTreeFilename} or ${whitelistTreeFilename}`,
    );
  }

  const holderTree = StandardMerkleTree.load<SerializedHolderLeaf>(
    JSON.parse(holderTreeRaw),
  );

  let holderProof: Proof["holder"] = null;

  for (const [i, [leafAddress, maxQuantity]] of holderTree.entries()) {
    if (!isAddressEqual(leafAddress, address)) {
      continue;
    }

    holderProof = {
      proof: holderTree.getProof(i) as Hex[],
      maxQuantity: BigInt(maxQuantity),
    };
  }

  const whitelistTree = StandardMerkleTree.load<WhitelistLeaf>(
    JSON.parse(whitelistTreeRaw),
  );

  let whitelistProof: Proof["whitelist"] = null;

  for (const [i, [leafAddress]] of whitelistTree.entries()) {
    if (!isAddressEqual(leafAddress, address)) {
      continue;
    }

    whitelistProof = { proof: whitelistTree.getProof(i) as Hex[] };
  }

  return { holder: holderProof, whitelist: whitelistProof };
}
