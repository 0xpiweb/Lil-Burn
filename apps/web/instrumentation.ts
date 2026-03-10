export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const url = process.env.DATABASE_URL;

    if (!url) {
      return;
    }

    if (process.env.NODE_ENV === "development" && url.startsWith("file:")) {
      process.stdout.write(`Deleting ${url}... `);

      const path = url.slice("file:".length);

      const { unlink } = await import("node:fs/promises");

      await unlink(path).catch(() => {});

      console.log("done.");
    }

    process.stdout.write(`Migrating ${url}... `);

    const { db } = await import("./db/drizzle");

    const { migrate } = await import("drizzle-orm/libsql/migrator");

    await migrate(db, { migrationsFolder: "./db/migrations" });

    console.log("done.");

    const { backfillDonations } = await import("./scripts/backfillDonations");

    await backfillDonations();
  }
}
