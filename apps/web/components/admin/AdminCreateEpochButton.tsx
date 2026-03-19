"use client";

import { GrungeButton } from "@/components/ui/GrungeButton";
import { useCreateYieldEpoch } from "@/hooks/mutations/useCreateYieldEpoch";

export function AdminCreateEpochButton() {
  const { mutate, isPending, isError } = useCreateYieldEpoch();

  return (
    <div className="flex items-center gap-4">
      <GrungeButton size="sm" onClick={() => mutate()} disabled={isPending}>
        {isPending ? "Creating…" : "Create Epoch"}
      </GrungeButton>

      {isError && (
        <span className="font-mono text-xs text-red-400">
          Failed to create epoch.
        </span>
      )}
    </div>
  );
}
