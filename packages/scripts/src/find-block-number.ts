import { createPublicClient, http } from "viem";
import { avalanche } from "viem/chains";

const client = createPublicClient({
  chain: avalanche,
  transport: http(),
});

type Rounding = "round" | "floor" | "ceil";

async function findBlockNumber(
  timestamp: bigint,
  rounding: Rounding = "round",
) {
  process.stderr.write("Finding closest block... ");

  const latestBlock = await client.getBlock({ blockTag: "latest" });

  if (timestamp >= latestBlock.timestamp) {
    return { number: latestBlock.number, timestamp: latestBlock.timestamp };
  }

  let left = 0n;
  let right = latestBlock.number;

  while (left < right) {
    const middle = (left + right) / 2n;
    const block = await client.getBlock({ blockNumber: middle });

    if (block.timestamp < timestamp) {
      left = middle + 1n;
    } else {
      right = middle;
    }
  }

  // `left` is the first block with timestamp >= target
  if (rounding === "ceil") {
    const block = await client.getBlock({ blockNumber: left });
    console.log("done");
    return block;
  }

  if (rounding === "floor") {
    const block = await client.getBlock({ blockNumber: left - 1n });
    console.log("done");
    return block;
  }

  // round: pick whichever neighbor is closer
  const [blockAt, blockBefore] = await Promise.all([
    client.getBlock({ blockNumber: left }),
    client.getBlock({ blockNumber: left - 1n }),
  ]);

  const block =
    timestamp - blockBefore.timestamp <= blockAt.timestamp - timestamp
      ? blockBefore
      : blockAt;

  console.log("done");
  return block;
}

const isoTimestamp = process.argv[2];

if (!isoTimestamp) {
  console.error("Error: missing timestamp (ISO 8601)");

  process.exit(1);
}

const timestamp = BigInt(Math.floor(new Date(isoTimestamp).getTime() / 1000));

if (isNaN(Number(timestamp))) {
  console.error("Error: invalid timestamp");

  process.exit(1);
}

const rounding = (process.argv[3] ?? "round") as Rounding;

if (!["round", "floor", "ceil"].includes(rounding)) {
  console.error("Error: rounding must be round, floor, or ceil");

  process.exit(1);
}

console.log(`Looking for closest block to ${isoTimestamp} (${rounding})`);

const { number: blockNumber, timestamp: blockTimestamp } =
  await findBlockNumber(timestamp, rounding);

console.log(`Block number: ${blockNumber}`);
console.log(
  `Block timestamp: ${blockTimestamp} (${new Date(Number(blockTimestamp) * 1000).toISOString()})`,
);
