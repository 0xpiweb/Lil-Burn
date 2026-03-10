"use client";

import { useMemo } from "react";

const INITIAL_SUPPLY = 1000;

const MILESTONES = [
  { supply: 800, count: 20 },
  { supply: 600, count: 20 },
  { supply: 400, count: 20 },
  { supply: 250, count: 15 },
  { supply: 150, count: 15 },
  { supply: 100, count: 10 },
] as const;

export function useBurnInfos({ burnCount }: { burnCount: number }) {
  const nextMilestone = useMemo(
    () =>
      burnCount != null
        ? MILESTONES.map((milestone) => ({
            ...milestone,
            threshold: INITIAL_SUPPLY - milestone.supply,
          })).find(({ threshold }) => burnCount < threshold)
        : undefined,
    [burnCount],
  );

  const cursed = useMemo(
    () =>
      MILESTONES.filter(
        ({ supply }) => burnCount >= INITIAL_SUPPLY - supply,
      ).reduce((sum, { count }) => sum + count, 0),
    [burnCount],
  );

  return {
    milestones: MILESTONES,
    nextMilestone,
    cursed,
  };
}
