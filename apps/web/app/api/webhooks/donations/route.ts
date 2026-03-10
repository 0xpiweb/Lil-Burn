import { db } from "@/db/drizzle";
import { donation } from "@/db/schema";
import { warChestAbi } from "@/generated";
import type { AlchemyWebhookPayload } from "@lilburn/types";
import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "node:crypto";
import { decodeEventLog, formatEther } from "viem";

function verifySignature(rawBody: string, signature: string): boolean {
  const signingKey = process.env.ALCHEMY_SIGNING_KEY;

  if (!signingKey) {
    return false;
  }

  const expected = createHmac("sha256", signingKey)
    .update(rawBody)
    .digest("hex");

  return expected === signature;
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-alchemy-signature") ?? "";

  if (!verifySignature(rawBody, signature)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = JSON.parse(rawBody) as AlchemyWebhookPayload;

  if (
    (payload.event.network === "AVAX" &&
      process.env.NEXT_PUBLIC_CHAIN !== "avalanche") ||
    (payload.event.network === "AVAX_FUJI" &&
      process.env.NEXT_PUBLIC_CHAIN !== "avalancheFuji") ||
    (payload.event.network === "LOCALHOST" &&
      process.env.NEXT_PUBLIC_CHAIN !== "localhost")
  ) {
    return NextResponse.json({ error: "Network mismatch" }, { status: 400 });
  }

  const decoded = payload.event.data.block.logs.flatMap(
    ({ data, topics, index, transaction }) => {
      try {
        const { eventName, args } = decodeEventLog({
          abi: warChestAbi,
          data,
          topics,
        });

        return eventName === "Donated"
          ? {
              donor: args.donor,
              epoch: args.epoch,
              amount: args.amount,
              index,
              transaction,
            }
          : [];
      } catch {
        return [];
      }
    },
  );

  await Promise.all(
    decoded.map(({ donor, epoch, amount, index, transaction }) =>
      db
        .insert(donation)
        .values({
          txHash: transaction.hash,
          logIndex: index,
          donor,
          epoch: Number(epoch),
          amountWei: amount,
          amountEth: Number(formatEther(amount)),
          blockNumber: payload.event.data.block.number,
          createdAt: new Date(payload.event.data.block.timestamp * 1000),
        })
        .onConflictDoNothing(),
    ),
  );

  return NextResponse.json({ ok: true });
}
