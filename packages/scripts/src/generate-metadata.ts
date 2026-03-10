import { createHash } from "node:crypto";
import { mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { CursedAssignment } from "../types/CursedAssignment.js";

try {
  process.loadEnvFile(new URL("../.env", import.meta.url));
} catch {}

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const SEED =
  process.env.METADATA_SEED ??
  (() => {
    console.warn("Warning: METADATA_SEED not set, using default seed");

    return "seed";
  })();

const IMAGES_BASE_URL = "https://lilburn.xyz/images";

const DESCRIPTION = "LilBurn NFT";

const HONORARY: { id: number; filename: string }[] = [
  { id: 1, filename: "Lil-B - Piweb.png" },
  { id: 2, filename: "Lil-B - Optimas.png" },
  { id: 3, filename: "Lil-B - Tigresa.png" },
] as const;

const CURSED_MILESTONES = [
  { supply: 800, count: 20 },
  { supply: 600, count: 20 },
  { supply: 400, count: 20 },
  { supply: 250, count: 15 },
  { supply: 150, count: 15 },
  { supply: 100, count: 10 },
] as const;

const milestonesTotal = CURSED_MILESTONES.reduce(
  (total, { count }) => total + count,
  0,
);

if (milestonesTotal !== 100) {
  console.error(
    `Error: invalid milestones, total ${milestonesTotal}, expecting 100`,
  );

  process.exit(1);
}

type TokenInfo = {
  id: number;
  artist: string;
  illustration: string;
  sweepScore: number;
  imageFilename: string;
};

type UnrevealedAttributes = [
  { trait_type: "Sweep Score"; value: number },
  { trait_type: "Cursed"; value: "Unrevealed" },
];

type RevealedAttributes = [
  { trait_type: "Artist"; value: string },
  { trait_type: "F1R3 Crew"; value: string },
  { trait_type: "Sweep Score"; value: number },
  { trait_type: "Cursed"; value: "Unrevealed" | boolean },
];

type Metadata = {
  name: `Lil-B #${number}`;
  description: string;
  image: string;
  attributes: UnrevealedAttributes | RevealedAttributes;
};

function sha256hex(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}

function makeRng(hexSeed: string) {
  let state = BigInt(`0x${hexSeed.slice(0, 16)}`);

  return function () {
    state =
      (state * 6364136223846793005n + 1442695040888963407n) &
      0xffffffffffffffffn;

    return Number(state >> 32n) / 0x100000000;
  };
}

function shuffle<T>(arr: T[], rng: () => number): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));

    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}

function parseFilename(filename: string): {
  artist: string;
  illustration: string;
} {
  const withoutExtension = filename.replace(/\.png$/i, "");

  const separator = withoutExtension.indexOf(" - ");

  if (separator === -1) {
    return { artist: withoutExtension, illustration: withoutExtension };
  }

  return {
    artist: withoutExtension.slice(0, separator),
    illustration: withoutExtension.slice(separator + 3),
  };
}

function sweepScore(id: number): number {
  if (id <= 3) {
    return 0;
  }

  if (id <= 8) {
    return 1000;
  }

  return 1009 - id;
}

function writeJson(path: string, data: unknown): void {
  writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
}

const oneOnOneImages = readdirSync(join(ROOT, "assets/1-1"))
  .filter((image) => image.endsWith(".png"))
  .sort();

if (oneOnOneImages.length !== 5) {
  console.error(
    `Error: expected 5 images in assets/1-1/, found ${oneOnOneImages.length}`,
  );

  process.exit(1);
}

const collectionImages = readdirSync(join(ROOT, "assets/Collection"))
  .filter((image) => image.endsWith(".png"))
  .sort();

if (collectionImages.length !== 25) {
  console.error(
    `Error: expected 25 images in assets/Collection/, found ${collectionImages.length}`,
  );

  process.exit(1);
}

const oneOnOneRng = makeRng(sha256hex(`${SEED}:1-1`));
const collectionRng = makeRng(sha256hex(`${SEED}:collection`));
const cursedRng = makeRng(sha256hex(`${SEED}:cursed`));

shuffle(oneOnOneImages, oneOnOneRng);

const collectionSlots = Array.from(
  { length: 992 },
  (_, i) => collectionImages[i % 25]!,
);

shuffle(collectionSlots, collectionRng);

const tokens = new Map<number, TokenInfo>();

for (const { id, filename } of HONORARY) {
  const { artist, illustration } = parseFilename(filename);

  tokens.set(id, {
    id,
    artist,
    illustration,
    sweepScore: sweepScore(id),
    imageFilename: filename,
  });
}

for (let i = 0; i < 5; ++i) {
  const id = 4 + i;

  const filename = oneOnOneImages[i]!;

  const { artist, illustration } = parseFilename(filename);

  tokens.set(id, {
    id,
    artist,
    illustration,
    sweepScore: sweepScore(id),
    imageFilename: filename,
  });
}

for (let i = 0; i < 992; i++) {
  const id = 9 + i;

  const filename = collectionSlots[i]!;

  const { artist, illustration } = parseFilename(filename);

  tokens.set(id, {
    id,
    artist,
    illustration,
    sweepScore: sweepScore(id),
    imageFilename: filename,
  });
}

const pool = Array.from({ length: 1000 }, (_, i) => i + 1);

const batches: { supply: number; tokenIds: number[] }[] = [];

for (const { supply, count } of CURSED_MILESTONES) {
  shuffle(pool, cursedRng);

  const selected = pool.splice(0, count).sort((a, b) => a - b);

  batches.push({ supply, tokenIds: selected });
}

const allCursedIds = new Set(batches.flatMap(({ tokenIds }) => tokenIds));

function buildUnrevealedMetadata(id: number): Metadata {
  return {
    name: `Lil-B #${id}`,
    description: DESCRIPTION,
    image: `${IMAGES_BASE_URL}/unrevealed.png`,
    attributes: [
      { trait_type: "Sweep Score", value: sweepScore(id) },
      { trait_type: "Cursed", value: "Unrevealed" },
    ],
  };
}

function buildRevealedMetadata(
  { id, imageFilename, artist, illustration, sweepScore }: TokenInfo,
  cursed: boolean | "Unrevealed",
): Metadata {
  return {
    name: `Lil-B #${id}`,
    description: DESCRIPTION,
    image: `${IMAGES_BASE_URL}/${encodeURIComponent(imageFilename)}`,
    attributes: [
      { trait_type: "Artist", value: artist },
      { trait_type: "F1R3 Crew", value: illustration },
      { trait_type: "Sweep Score", value: sweepScore },
      { trait_type: "Cursed", value: cursed },
    ],
  };
}

const unrevealedDir = join(ROOT, "output", "unrevealed");

mkdirSync(unrevealedDir, { recursive: true });

process.stderr.write("Writing unrevealed metadata... ");

for (let id = 1; id <= 1000; id++) {
  writeJson(join(unrevealedDir, `${id}.json`), buildUnrevealedMetadata(id));
}

console.log("done");

const revealedDir = join(ROOT, "output/revealed");

mkdirSync(revealedDir, { recursive: true });

process.stderr.write("Writing revealed metadata... ");

for (const [id, token] of tokens) {
  writeJson(
    join(revealedDir, `${id}.json`),
    buildRevealedMetadata(token, "Unrevealed"),
  );
}

console.log("done");

const cursedSoFar = new Set<number>();

for (const { supply, tokenIds } of batches) {
  const batchDir = join(ROOT, `output/cursed/${String(supply)}`);

  mkdirSync(batchDir, { recursive: true });

  process.stdout.write(
    `Writing cursed/${supply}/ (${tokenIds.length} files)... `,
  );

  for (const id of tokenIds) {
    const token = tokens.get(id)!;

    writeJson(join(batchDir, `${id}.json`), buildRevealedMetadata(token, true));

    cursedSoFar.add(id);
  }

  console.log("done");
}

const finalDir = join(ROOT, "output/cursed/final");

mkdirSync(finalDir, { recursive: true });

process.stderr.write("Writing cursed/final/ (1000 files)... ");

for (const [id, token] of tokens) {
  const cursed = allCursedIds.has(id) ? true : false;

  writeJson(join(finalDir, `${id}.json`), buildRevealedMetadata(token, cursed));
}

console.log("done");

const outputDir = join(ROOT, "output");

const cursedAssignment = { seed: SEED, batches } satisfies CursedAssignment;

writeJson(join(outputDir, "cursed-assignment.json"), cursedAssignment);

console.log("Wrote output/cursed-assignment.json");

const commitmentInput = batches
  .map(({ supply, tokenIds }) => `${supply}:${tokenIds.join(",")}`)
  .join("\n");

const commitmentHash = sha256hex(commitmentInput);

writeFileSync(join(outputDir, "commitment-hash.txt"), commitmentHash + "\n");

console.log(commitmentHash);
console.log(`Commitment hash: ${commitmentHash}`);
console.log("Written to output/commitment-hash.txt");
