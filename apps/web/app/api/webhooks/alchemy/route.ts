import { lilBurnAddress, warChestAddress } from "@/generated";
import { processLilBurnLogs, processWarChestLogs } from "@/lib/logs";
import { publicClient } from "@/lib/wagmi.server";
import type { NormalizedLog } from "@/types/NormalizedLog";
import type { AlchemyWebhookPayload } from "@lilburn/types";
import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "node:crypto";

export async function POST(request: NextRequest) {
  const signature = request.headers.get("x-alchemy-signature");

  const signingKey = process.env.ALCHEMY_SIGNING_KEY;

  if (!signature || !signingKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rawBody = await request.text();

  const expectedSignature = createHmac("sha256", signingKey)
    .update(rawBody)
    .digest("hex");

  if (expectedSignature !== signature) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const {
    event: {
      network,
      data: { block },
    },
  } = JSON.parse(rawBody) as AlchemyWebhookPayload;

  const chain = process.env.NEXT_PUBLIC_CHAIN;

  if (
    (network === "AVAX" && chain !== "avalanche") ||
    (network === "AVAX_FUJI" && chain !== "avalancheFuji") ||
    (network === "LOCALHOST" && chain !== "localhost")
  ) {
    return NextResponse.json({ error: "Network mismatch" }, { status: 400 });
  }

  console.log("[webhook] Logs received");

  const {
    logs: rawLogs,
    hash: blockHash,
    number: blockNumber,
    timestamp: blockTimestamp,
  } = block;

  const logs: NormalizedLog[] = rawLogs.map(
    ({
      index: logIndex,
      transaction: { hash: transactionHash, index: transactionIndex },
      account: { address },
      data,
      topics,
    }) => ({
      removed: false,
      logIndex,
      transactionIndex,
      transactionHash,
      blockHash,
      blockNumber,
      address,
      data,
      topics,
      blockTimestamp,
    }),
  );

  const logsByAddress = Map.groupBy(logs, ({ address }) =>
    address.toLowerCase(),
  );

  const chainId = await publicClient.getChainId();

  const lilBurnLogs = logsByAddress.get(
    lilBurnAddress[chainId as keyof typeof lilBurnAddress].toLowerCase(),
  );

  const warChestLogs = logsByAddress.get(
    warChestAddress[chainId as keyof typeof warChestAddress].toLowerCase(),
  );

  const totalLogs = (lilBurnLogs?.length ?? 0) + (warChestLogs?.length ?? 0);

  if (totalLogs) {
    console.log(`[webhook] Processing ${totalLogs} logs`);
  } else {
    console.log("[webhook] No logs to process");

    return NextResponse.json({ ok: true });
  }

  const results = await Promise.allSettled([
    processLilBurnLogs(lilBurnLogs),
    processWarChestLogs(warChestLogs),
  ]);

  const rejected = results.filter(({ status }) => status === "rejected");

  if (rejected.length) {
    console.error(
      "[webhook] Failed to process logs:",
      rejected.map((result) => (result as PromiseRejectedResult).reason),
    );

    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }

  console.log("[webgook] Logs processed");

  return NextResponse.json({ ok: true });
}
