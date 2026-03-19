"use server";

import { db } from "@/db/drizzle";
import { paginate } from "@/db/paginate";
import { donation } from "@/db/schema";
import { formatNumber } from "@/lib/format";
import type { Paginated } from "@/types/Paginated";
import type { WarChestLeaderboardEntry } from "@/types/WarChestLeaderboardEntry";
import { count, eq, sql, sum } from "drizzle-orm";
import type { SQLiteSelectQueryBuilder } from "drizzle-orm/sqlite-core";

export async function getDonations(
  epoch: number | null,
  page: number,
  pageSize: number,
): Promise<Paginated<WarChestLeaderboardEntry>> {
  function filters<T extends SQLiteSelectQueryBuilder>(query: T) {
    if (epoch != null) {
      query = query.where(eq(donation.epoch, epoch));
    }

    return query.groupBy(donation.donor);
  }

  const query = filters(
    db
      .select({
        address: donation.donor,
        contribution: sum(donation.amountEth),
      })
      .from(donation)
      .orderBy(sql`sum(${donation.amountEth}) desc`)
      .$dynamic(),
  );

  const countQuery = filters(
    db.select({ count: count() }).from(donation).$dynamic(),
  );

  const { items, ...rest } = await paginate(query, countQuery, page, pageSize);

  return {
    items: items.map(({ address, contribution }, i) => ({
      rank: (page - 1) * pageSize + i + 1,
      address,
      contribution: formatNumber(Number(contribution)),
    })),
    ...rest,
  };
}
