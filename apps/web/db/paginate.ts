import type { Paginated } from "@/types/Paginated";
import type { SQLiteSelect } from "drizzle-orm/sqlite-core";

export async function paginate<T extends SQLiteSelect>(
  query: T,
  countQuery: Promise<{ count: number }[]>,
  page: number,
  pageSize: number,
) {
  const [items, countResult] = await Promise.all([
    query.limit(pageSize).offset((page - 1) * pageSize),
    countQuery,
  ]);

  const total = countResult[0]?.count ?? 0;

  const totalPages = Math.ceil(total / pageSize);

  return { items, total, totalPages } satisfies Paginated<Awaited<T>[number]>;
}
