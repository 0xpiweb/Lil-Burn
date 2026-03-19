import "server-only";

import { jwtVerify, SignJWT, type JWTPayload } from "jose";

const key = new TextEncoder().encode(process.env.JWT_SECRET);

export async function encrypt<T extends JWTPayload>(
  payload: T,
  expires?: Date,
) {
  const jwt = new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt();

  if (expires) {
    jwt.setExpirationTime(expires);
  }

  return jwt.sign(key);
}

export async function decrypt<T>(jwt?: string) {
  if (!jwt?.length) {
    return;
  }

  try {
    const { payload } = await jwtVerify<T>(jwt, key, {
      algorithms: ["HS256"],
    });

    return payload;
  } catch (error) {
    console.error(error);

    console.log("Failed to verify JWT");
  }
}
