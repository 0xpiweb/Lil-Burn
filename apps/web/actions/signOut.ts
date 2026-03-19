"use server";

import { deleteSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function signOut() {
  await deleteSession();

  revalidatePath("/");
}
