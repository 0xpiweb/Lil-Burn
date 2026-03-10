"use client";

import { GrungeCard } from "@/components/GrungeCard";
import { InfoIcon } from "@/components/icons";
import { WalletActionButton } from "@/components/WalletActionButton";
import { WarChestDonationPresets } from "@/components/WarChestDonationPresets";
import { useDonate } from "@/hooks/useDonate";
import { useMinDonation } from "@/hooks/useMinDonation";
import { useState } from "react";
import { formatEther, parseEther } from "viem";
import { AmountInput } from "./AmountInput";

function DonateInputSkeleton() {
  return (
    <>
      <div className="flex h-26 flex-col gap-2">
        <div className="h-3.5 w-24 animate-pulse rounded bg-zinc-800/60" />
        <div className="h-10 w-full animate-pulse rounded bg-zinc-800/80" />
        <div className="h-6 w-48 animate-pulse rounded bg-zinc-800/60" />
      </div>

      <div className="h-15 w-full animate-pulse rounded bg-zinc-700" />
    </>
  );
}

export function WarChestDonateCard() {
  const { data: minDonation, status: minDonationStatus } = useMinDonation();

  const minEth =
    minDonation !== undefined ? formatEther(minDonation) : undefined;

  const [amount, setAmount] = useState<string | undefined>(undefined);

  const effectiveAmount = amount ?? minEth ?? "";

  const { mutate: donate, isPending: isDonating } = useDonate();

  return (
    <GrungeCard className="flex w-full flex-col gap-5 rounded p-6">
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-black tracking-wide text-white uppercase">
          Support the War
        </h3>

        <p className="text-sm text-zinc-400">
          Contribute AVAX to the War Chest and help fuel the burn. Your support
          strengthens the entire ecosystem and earns you a place on the
          leaderboard.
        </p>
      </div>

      {minDonationStatus === "success" ? (
        <>
          <div className="flex h-26 flex-col gap-2">
            <label className="text-xs font-semibold tracking-wide text-zinc-400 uppercase">
              Amount (AVAX)
            </label>

            <AmountInput
              min={formatEther(minDonation)}
              value={effectiveAmount}
              onChange={setAmount}
              disabled={isDonating}
            />

            <WarChestDonationPresets
              presets={[0.5, 1, 5, 10]}
              amount={effectiveAmount}
              onSelect={setAmount}
              disabled={isDonating}
            />
          </div>

          <WalletActionButton
            onClick={() =>
              donate(
                { value: parseEther(effectiveAmount) },
                { onSuccess: () => setAmount(undefined) },
              )
            }
            disabled={isDonating || !minEth}
            isPending={isDonating}
          >
            Donate AVAX
          </WalletActionButton>
        </>
      ) : (
        <DonateInputSkeleton />
      )}

      <div className="flex items-start gap-3 rounded-sm bg-zinc-800/50 px-4 py-3">
        <InfoIcon className="mt-0.5 size-4 shrink-0 text-zinc-500" />

        <p className="text-xs leading-relaxed text-zinc-500">
          All contributions are on-chain and publicly verifiable. Your wallet
          address will be displayed on the leaderboard. Minimum contribution:
          0.1 AVAX.
        </p>
      </div>
    </GrungeCard>
  );
}
