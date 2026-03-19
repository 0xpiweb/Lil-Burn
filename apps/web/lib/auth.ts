"use server";

import { getUser } from "@/actions/getUser";

export async function requireAdmin() {
  const user = await getUser();

  if (!user || user.role !== "admin") {
    throw new Error("Unauthorized");
  }

  return user;
}
