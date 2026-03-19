"use server";

import { setCookie } from "@/lib/cookies";
import { encrypt } from "@/lib/jwt";
import { generateSiweNonce } from "viem/siwe";

export async function getNonce() {
  const nonce = generateSiweNonce();

  const expires = new Date(Date.now() + 5 * 60 * 1000);

  const jwt = await encrypt({ nonce }, expires);

  await setCookie("nonce", jwt, { expires });

  return nonce;
}
