import "server-only";

import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";

enum Cookies {
  nonce = "lilburn.nonce",
  session = "lilburn.session",
}

type CookieName = keyof typeof Cookies;

export async function getCookie(name: CookieName) {
  const cookieStore = await cookies();

  return cookieStore.get(Cookies[name])?.value;
}

export async function setCookie(
  name: CookieName,
  value: string,
  options?: Partial<ResponseCookie>,
) {
  const cookieStore = await cookies();

  cookieStore.set(Cookies[name], value, {
    httpOnly: true,
    secure: true,
    path: "/",
    sameSite: "lax",
    ...options,
  });
}

export async function deleteCookie(name: CookieName) {
  const cookieStore = await cookies();

  cookieStore.delete(Cookies[name]);
}
