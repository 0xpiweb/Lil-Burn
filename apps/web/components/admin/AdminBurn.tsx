"use client";

import { GrungeCard } from "@/components/ui/GrungeCard";
import { OutlineButton } from "@/components/ui/OutlineButton";
import { WalletActionButton } from "@/components/wallet/WalletActionButton";
import { useLilBurnBurn } from "@/hooks/mutations/useLilBurnBurn";
import { useLilBurnTokenIds } from "@/hooks/queries/useLilBurnTokenIds";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { useConnection } from "wagmi";

function TokenCell({
  tokenId,
  selected,
  onToggle,
  disabled,
}: {
  tokenId: number;
  selected: boolean;
  onToggle: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      className={`relative rounded border px-3 py-2 text-center outline-none not-disabled:cursor-pointer focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 ${selected ? "border-red-500 bg-red-950/50" : "border-zinc-700 bg-zinc-900 hover:border-zinc-500"}`}
    >
      <span className="text-sm text-zinc-300">#{tokenId}</span>
    </button>
  );
}

export function AdminBurn() {
  const { address } = useConnection();

  const { data: tokenIds, isLoading: tokensLoading } =
    useLilBurnTokenIds(address);

  const burn = useLilBurnBurn();

  const queryClient = useQueryClient();

  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const ids = useMemo(
    () => (Array.isArray(tokenIds) ? (tokenIds as number[]) : []),
    [tokenIds],
  );

  const toggle = useCallback((id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  }, []);

  const selectAll = useCallback(() => setSelectedIds(new Set(ids)), [ids]);

  const clearSelection = useCallback(() => setSelectedIds(new Set()), []);

  function refresh() {
    queryClient.invalidateQueries({ queryKey: ["lilBurnTokenIds", address] });
  }

  function burnSelected() {
    burn.mutate(
      { tokenIds: Array.from(selectedIds) },
      { onSuccess: () => setSelectedIds(new Set()) },
    );
  }

  return (
    <GrungeCard className="flex w-full flex-col gap-4 p-6">
      <h2 className="font-display text-lg tracking-wide text-white uppercase">
        Burn Tokens
      </h2>

      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-2">
          {ids.length > 0 && (
            <>
              <OutlineButton
                onClick={
                  selectedIds.size === ids.length ? clearSelection : selectAll
                }
                disabled={burn.isPending}
              >
                {selectedIds.size === ids.length
                  ? "Deselect all"
                  : "Select all"}
              </OutlineButton>

              <OutlineButton onClick={clearSelection} disabled={burn.isPending}>
                Clear
              </OutlineButton>
            </>
          )}

          <OutlineButton onClick={refresh} disabled={burn.isPending}>
            Refresh
          </OutlineButton>
        </div>

        <WalletActionButton
          onClick={burnSelected}
          isPending={burn.isPending}
          disabled={selectedIds.size === 0}
          size="sm"
        >
          {`Burn ${selectedIds.size} token${selectedIds.size > 1 ? "s" : ""}`}
        </WalletActionButton>
      </div>

      {!address && (
        <p className="text-sm text-zinc-500">
          Connect your wallet to see your tokens.
        </p>
      )}

      {address && tokensLoading && (
        <p className="text-sm text-zinc-500">Loading tokens…</p>
      )}

      {address && !tokensLoading && ids.length === 0 && (
        <p className="text-sm text-zinc-500">No tokens found.</p>
      )}

      {ids.length > 0 && (
        <div className="grid w-full grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
          {ids.map((id) => (
            <TokenCell
              key={id}
              tokenId={id}
              selected={selectedIds.has(id)}
              onToggle={() => toggle(id)}
              disabled={burn.isPending}
            />
          ))}
        </div>
      )}
    </GrungeCard>
  );
}
