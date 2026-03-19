import "server-only";

import { deleteCookie, getCookie, setCookie } from "@/lib/cookies";
import { decrypt, encrypt } from "@/lib/jwt";
import type { Address } from "viem";

export type NonceJWTPayload = {
  nonce: string;
};

export type SessionJWTPayload = {
  address: Address;
};

export async function createSession(payload: SessionJWTPayload) {
  const jwt = await encrypt(payload);

  await setCookie("session", jwt);

  return jwt;
}

export async function getSession() {
  const jwt = await getCookie("session");

  return decrypt<SessionJWTPayload>(jwt);
}

export async function deleteSession() {
  await deleteCookie("session");
}
