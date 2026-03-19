"use client";

import { AdminCreateEpochButton } from "@/components/admin/AdminCreateEpochButton";
import { GrungeCard } from "@/components/ui/GrungeCard";
import { OutlineButton } from "@/components/ui/OutlineButton";
import { Pagination } from "@/components/ui/Pagination";
import { useUpdateYieldEpoch } from "@/hooks/mutations/useUpdateYieldEpoch";
import { useYieldEpochs } from "@/hooks/queries/useYieldEpochs";
import { usePage } from "@/hooks/usePage";
import type { YieldEpochSummary } from "@/types/YieldEpochSummary";
import { useState } from "react";

const PAGE_SIZE = 10;

function EditField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-mono text-xs text-zinc-500 uppercase">{label}</span>
      <input
        type="number"
        step="any"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => {
          if (value === "") onChange("0");
        }}
        className="w-36 [appearance:textfield] rounded bg-zinc-800 px-2 py-1 font-mono text-xs text-white ring-1 ring-zinc-600 outline-none focus:ring-zinc-400 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
    </div>
  );
}

function EpochRow({ epoch }: { epoch: YieldEpochSummary }) {
  const { mutate, isPending } = useUpdateYieldEpoch();

  const [editing, setEditing] = useState(false);

  const [yieldGenerated, setYieldGenerated] = useState(
    String(epoch.yieldGenerated),
  );

  const [externalRevenue, setExternalRevenue] = useState(
    String(epoch.externalRevenue),
  );

  const [purgeTotalSpent, setPurgeTotalSpent] = useState(
    String(epoch.purgeTotalSpent),
  );

  function update() {
    mutate(
      {
        blockNumber: epoch.startBlockNumber,
        yieldGenerated: Number(yieldGenerated),
        externalRevenue: Number(externalRevenue),
        purgeTotalSpent: Number(purgeTotalSpent),
      },
      { onSuccess: () => setEditing(false) },
    );
  }

  function cancel() {
    setYieldGenerated(String(epoch.yieldGenerated));
    setExternalRevenue(String(epoch.externalRevenue));
    setPurgeTotalSpent(String(epoch.purgeTotalSpent));
    setEditing(false);
  }

  return (
    <>
      <tr className="text-zinc-300">
        <td className="py-2.5 font-mono text-xs text-zinc-400">
          {epoch.number}
        </td>

        <td className="py-2.5 font-mono text-xs">
          {epoch.startBlockTimestamp.toLocaleString()}
        </td>

        <td className="py-2.5 font-mono text-xs text-zinc-400">
          {epoch.endBlockNumber ? (
            epoch.endBlockTimestamp?.toLocaleString()
          ) : (
            <span className="text-orange-400">Active</span>
          )}
        </td>

        <td className="py-2.5 pl-4">
          <div className="flex justify-end">
            <OutlineButton onClick={() => setEditing((v) => !v)}>
              {editing ? "Close" : "Edit"}
            </OutlineButton>
          </div>
        </td>
      </tr>

      {editing && (
        <tr>
          <td colSpan={4} className="pb-4">
            <div className="flex items-end gap-4 rounded border border-zinc-800 bg-zinc-900/60 p-4">
              <EditField
                label="Generated"
                value={yieldGenerated}
                onChange={setYieldGenerated}
              />

              <EditField
                label="Ext. Revenue"
                value={externalRevenue}
                onChange={setExternalRevenue}
              />

              <EditField
                label="Purge Spent"
                value={purgeTotalSpent}
                onChange={setPurgeTotalSpent}
              />

              <div className="ml-auto flex gap-2">
                <OutlineButton onClick={update} isPending={isPending}>
                  Save
                </OutlineButton>
                <OutlineButton onClick={cancel} disabled={isPending}>
                  Cancel
                </OutlineButton>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export function AdminYieldEpochs() {
  const { page, setPage } = usePage();

  const { data, isLoading } = useYieldEpochs(page, PAGE_SIZE);

  const epochs = data?.items ?? [];

  return (
    <>
      <GrungeCard className="flex w-full flex-col gap-4 p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg tracking-wide text-white uppercase">
            Yield Epochs
          </h2>

          <AdminCreateEpochButton />
        </div>

        {isLoading && <p className="text-sm text-zinc-500">Loading…</p>}

        {!isLoading && epochs.length === 0 && (
          <p className="text-sm text-zinc-500">No epochs yet.</p>
        )}

        {epochs.length > 0 && (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-left font-mono text-xs tracking-wide text-zinc-500 uppercase">
                <th className="pb-2 font-normal">Number</th>
                <th className="pb-2 font-normal">Start</th>
                <th className="pb-2 font-normal">End</th>
                <th className="pb-2 font-normal" />
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-800/60">
              {epochs.map((epoch) => (
                <EpochRow key={epoch.number} epoch={epoch} />
              ))}
            </tbody>
          </table>
        )}
      </GrungeCard>

      <Pagination
        page={page}
        onPageChange={setPage}
        totalPages={data?.totalPages ?? 0}
      />
    </>
  );
}
