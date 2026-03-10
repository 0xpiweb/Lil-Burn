"use client";

import { useBurnCount } from "@/hooks/useBurnCount";
import { useBurnInfos } from "@/hooks/useBurnInfos";

export const HEIGHT = 34;

export function CursedMilestoneProgress() {
  const { data: burnCount } = useBurnCount();

  const { nextMilestone } = useBurnInfos({ burnCount });

  const progress = nextMilestone
    ? Math.min((burnCount / nextMilestone.threshold) * 100, 100)
    : 100;

  return (
    <div className="flex w-full flex-col gap-2" style={{ height: HEIGHT }}>
      <div className="flex items-center justify-between text-sm">
        {nextMilestone ? (
          <>
            <span className="font-semibold text-zinc-400">
              Next reveal{" "}
              <span className="hidden sm:inline">
                <span className="text-white">
                  ({nextMilestone.count} cursed)
                </span>
                {" at "}
                <span className="text-white">
                  {nextMilestone.threshold} burns
                </span>
              </span>
            </span>
            <span className="font-semibold text-zinc-500">
              {burnCount} / {nextMilestone.threshold}
            </span>
          </>
        ) : (
          <span className="font-semibold text-zinc-400">
            All milestones complete
          </span>
        )}
      </div>

      <div className="h-1.5 w-full rounded-full bg-zinc-800">
        <div
          className="h-1.5 rounded-full bg-linear-to-r from-orange-500 to-red-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
