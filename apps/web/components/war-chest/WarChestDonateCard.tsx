"use client";

import { IconInfo } from "@/components/icons/IconInfo";
import { AmountInput } from "@/components/ui/AmountInput";
import { GrungeCard } from "@/components/ui/GrungeCard";
import { WalletActionButton } from "@/components/wallet/WalletActionButton";
import { WarChestDonationPresets } from "@/components/war-chest/WarChestDonationPresets";
import { useWarChestDonate } from "@/hooks/mutations/useWarChestDonate";
import { useWarChestMinDonation } from "@/hooks/queries/useWarChestMinDonation";
import { useState } from "react";
import { formatEther, parseEther } from "viem";
import { WarChestDonateCardInputSkeleton } from "./WarChestDonateCardInputSkeleton";

export function WarChestDonateCard() {
  const { data: minDonation, isSuccess: isSuccessMinDonation } =
    useWarChestMinDonation();

  const minEth =
    minDonation !== undefined ? formatEther(minDonation) : undefined;

  const [amount, setAmount] = useState<string | undefined>(undefined);

  const effectiveAmount = amount ?? minEth ?? "";

  const { mutate: donate, isPending: isDonating } = useWarChestDonate();

  return (
    <GrungeCard className="flex w-full flex-col gap-5 rounded p-6">
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-black tracking-wide text-white uppercase">
          Support the War
        </h3>

        <p className="text-sm text-zinc-400">
          Contribute $AVAX to the War Chest and help fuel the burn. Your support
          strengthen the entire ecosystem and earns you a place on the
          leaderboard.
        </p>
      </div>

      {!isSuccessMinDonation ? (
        <WarChestDonateCardInputSkeleton />
      ) : (
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
      )}

      <div className="flex items-start gap-3 rounded-sm bg-zinc-800/50 px-4 py-3">
        <IconInfo className="mt-0.5 size-4 shrink-0 text-zinc-500" />

        <p className="text-xs leading-relaxed text-zinc-500">
          All contributions are on-chain and publicly verifiable. Your wallet
          address will be displayed on the leaderboard. Minimum contribution:
          0.1 AVAX.
        </p>
      </div>
    </GrungeCard>
  );
}
