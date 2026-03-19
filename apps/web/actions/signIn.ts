"use server";

import { db } from "@/db/drizzle";
import { user } from "@/db/schema";
import { deleteCookie, getCookie } from "@/lib/cookies";
import { decrypt } from "@/lib/jwt";
import { createSession, type NonceJWTPayload } from "@/lib/session";
import { publicClient } from "@/lib/wagmi.server";
import type { Hex } from "viem";
import { parseSiweMessage } from "viem/siwe";

export async function signIn({
  message,
  signature,
}: {
  message: string;
  signature: Hex;
}) {
  const jwt = await getCookie("nonce");

  const payload = await decrypt<NonceJWTPayload>(jwt);

  if (!payload?.nonce) {
    throw new Error("No nonce found");
  }

  await deleteCookie("nonce");

  const isMessageValid = await publicClient.verifySiweMessage({
    message,
    signature,
    nonce: payload.nonce,
    // domain: new URL(process.env.URL).hostname,
  });

  if (!isMessageValid) {
    throw new Error("Invalid message");
  }

  const { address } = parseSiweMessage(message);

  if (!address) {
    throw new Error("Failed to parse the message");
  }

  await db
    .insert(user)
    .values({
      address,
    })
    .onConflictDoNothing();

  await createSession({ address });
}
