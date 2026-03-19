import { db } from "@/db/drizzle";
import { user as userSchema } from "@/db/schema";
import { getSession } from "@/lib/session";
import { eq } from "drizzle-orm";

export async function getUser() {
  const session = await getSession();

  if (!session) {
    return;
  }

  const [user] = await db
    .select({ address: userSchema.address, role: userSchema.role })
    .from(userSchema)
    .where(eq(userSchema.address, session.address))
    .limit(1);

  return user;
}
