"use server";

import { getYieldEpoch } from "@/actions/getYieldEpoch";
import { getYieldEpochs } from "@/actions/getYieldEpochs";
import type { Paginated } from "@/types/Paginated";
import type { YieldEpochDetail } from "@/types/YieldEpochDetail";
import type { YieldEpochSummary } from "@/types/YieldEpochSummary";

export async function getYieldEpochsAndFirstDetail(
  page: number,
  pageSize: number,
): Promise<
  Paginated<YieldEpochSummary> & {
    firstEpochDetail: YieldEpochDetail | null;
  }
> {
  const listResult = await getYieldEpochs(page, pageSize);

  const firstEpoch = listResult.items[0];

  const firstEpochDetail = firstEpoch
    ? await getYieldEpoch(firstEpoch.number)
    : null;

  return { ...listResult, firstEpochDetail };
}
