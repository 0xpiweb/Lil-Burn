export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const url = process.env.DATABASE_URL;

    if (!url) {
      return;
    }

    if (
      process.env.NODE_ENV === "development" &&
      url.startsWith("file:") &&
      process.env.RESET_DB === "true"
    ) {
      const path = url.slice("file:".length);

      const { unlink } = await import("node:fs/promises");

      await unlink(path).catch(() => {});

      console.log(`[db] Deleted ${path}`);
    }

    const { db } = await import("./db/drizzle");
    const { migrate } = await import("drizzle-orm/libsql/migrator");

    await migrate(db, { migrationsFolder: "./db/migrations" });

    console.log("[db] Migrations ran");

    const { backfill } = await import("./lib/backfill");

    await backfill();

    const { seed } = await import("./lib/seeds");

    await seed();
  }
}
