"use client";

import { GrungeCard } from "@/components/GrungeCard";
import { CheckIcon, FireIcon, LockIcon } from "@/components/icons";
import { useCountdown } from "@/hooks/useCountdown";
import { twJoin } from "@/lib/tw";
import { MintPhase } from "@/types/MintPhase";
import { MintPhaseStatus } from "@/types/MintPhaseStatus";

export const HEIGHT = 210;

export function MintPhaseCard({
  phase,
  label,
  description,
  startAt,
  status,
  quantity,
}: {
  phase: MintPhase;
  label: string;
  description: string;
  startAt?: bigint;
  status: MintPhaseStatus;
  quantity?: number | null;
}) {
  const isActive = status === MintPhaseStatus.Active;
  const isCompleted = status === MintPhaseStatus.Completed;
  const isLocked = status === MintPhaseStatus.Locked;

  const countdown = useCountdown(isLocked ? startAt : undefined);

  return (
    <GrungeCard
      className={twJoin(
        "relative flex flex-1 flex-col items-center gap-3 rounded-sm p-6",
        isActive && "glow-border-red border-red-800",
      )}
      style={{ height: HEIGHT }}
    >
      <span
        className={twJoin(
          "absolute -top-2.5 -right-2.5 flex size-6 items-center justify-center rounded-sm text-xs font-bold",
          isActive
            ? "bg-red-700 text-white"
            : isCompleted
              ? "bg-zinc-800 text-zinc-300"
              : "bg-zinc-800 text-zinc-400",
        )}
      >
        {phase}
      </span>

      {isCompleted && <CheckIcon className="size-10 text-red-500" />}

      {isActive && <FireIcon className="size-10 text-red-500" />}

      {isLocked && <LockIcon className="size-10 text-zinc-500" />}

      <span
        className={twJoin(
          "text-center text-sm font-bold tracking-wide uppercase",
          isActive
            ? "text-red-500"
            : isCompleted
              ? "text-red-400"
              : "text-zinc-400",
        )}
      >
        {label}
      </span>

      <span className="grow text-center text-xs text-zinc-500">
        {description}
      </span>

      <div className="flex flex-col items-center gap-2">
        {countdown !== null && (
          <div
            className={twJoin(
              "font-mono text-sm font-semibold tabular-nums duration-300",
              countdown === undefined ? "text-zinc-700" : "text-zinc-400",
            )}
          >
            {countdown ?? "--:--"}
          </div>
        )}

        <div className="font-mono text-xs font-semibold text-zinc-700 tabular-nums duration-300">
          {quantity === undefined
            ? "--"
            : quantity === Infinity
              ? "As much as you want"
              : quantity
                ? quantity > 1
                  ? `${quantity} mints`
                  : `${quantity} mint`
                : "Ineligible"}
        </div>
      </div>
    </GrungeCard>
  );
}
