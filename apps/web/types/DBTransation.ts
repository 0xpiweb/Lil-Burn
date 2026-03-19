import { db } from "@/db/drizzle";

export type DBTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0];
