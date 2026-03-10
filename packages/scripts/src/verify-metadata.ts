import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { CursedAssignment } from "../types/CursedAssignment.js";

const cursedAssignmentPath = process.argv[2];

if (!cursedAssignmentPath) {
  console.error("Error: cursed assignment path missing");

  process.exit(1);
}

const path = join(
  dirname(fileURLToPath(import.meta.url)),
  cursedAssignmentPath,
);

const content = await readFile(path, "utf8");

const { batches } = JSON.parse(content) as CursedAssignment;

const data = batches
  .map(({ supply, tokenIds }) => `${supply}:${tokenIds.join(",")}`)
  .join("\n");

console.log(createHash("sha256").update(data).digest("hex"));
