"use client";

import { MintControlsSkeleton } from "@/components/mint/MintControlsSkeleton";
import { GradientText } from "@/components/ui/GradientText";
import { GrungeCard } from "@/components/ui/GrungeCard";
import { StepperButton } from "@/components/ui/StepperButton";
import { WalletActionButton } from "@/components/wallet/WalletActionButton";
import { useLilBurnHolderMint } from "@/hooks/mutations/useLilBurnHolderMint";
import { useLilBurnPublicMint } from "@/hooks/mutations/useLilBurnPublicMint";
import { useLilBurnWhitelistMint } from "@/hooks/mutations/useLilBurnWhitelistMint";
import { useLilBurnMaxPublicMint } from "@/hooks/queries/useLilBurnMaxPublicMint";
import { useLilBurnMintCounts } from "@/hooks/queries/useLilBurnMintCounts";
import { useLilBurnMintPrice } from "@/hooks/queries/useLilBurnMintPrice";
import { useLilBurnMintProgress } from "@/hooks/queries/useLilBurnMintProgress";
import { useLilBurnMintProof } from "@/hooks/queries/useLilBurnMintProof";
import { useLilBurnMintStatus } from "@/hooks/queries/useLilBurnMintStatus";
import { useLilBurnsCount } from "@/hooks/queries/useLilBurnsCount";
import { useLilBurnMintPhase } from "@/hooks/useLilBurnMintPhase";
import { MintPhase } from "@/types/MintPhase";
import { useCallback, useEffect, useMemo, useState } from "react";
import { formatEther } from "viem";
import { useConnection } from "wagmi";

export const HEIGHT = 341;

export function MintControls() {
  const { address } = useConnection();

  const [quantity, setQuantity] = useState(1);

  const { data: mintPrice, isLoading: isPriceLoading } = useLilBurnMintPrice();

  const { data: lilBurnsCount } = useLilBurnsCount(address);

  const { data: mintStatus, isLoading: isStatusLoading } =
    useLilBurnMintStatus();

  const { data: mintProgress, isLoading: isProgressLoading } =
    useLilBurnMintProgress();

  const { data: proof, isPending: isProofLoading } =
    useLilBurnMintProof(address);

  const { data: mintCounts, isLoading: isCountsLoading } =
    useLilBurnMintCounts(address);

  const { data: maxPublicMints } = useLilBurnMaxPublicMint();

  const { mutate: holderMint, isPending: isHolderMintPending } =
    useLilBurnHolderMint();

  const { mutate: whitelistMint, isPending: isWhitelistMintPending } =
    useLilBurnWhitelistMint();

  const { mutate: publicMint, isPending: isPublicMintPending } =
    useLilBurnPublicMint();

  const phase = useLilBurnMintPhase({
    holderStart: mintStatus?.holderStart,
    whitelistStart: mintStatus?.whitelistStart,
    publicStart: mintStatus?.publicStart,
  });

  useEffect(() => {
    setQuantity(1);
  }, [phase, address]);

  const isMinting =
    isHolderMintPending || isWhitelistMintPending || isPublicMintPending;

  const isCheckingProof = phase !== MintPhase.Public && isProofLoading;

  const minted = mintProgress?.minted ?? 0;
  const maxSupply = mintProgress?.maxSupply ?? 0;
  const mintedPercent = mintProgress?.mintedPercent ?? 0;
  const holderMintCount = mintCounts?.holderMintCount;
  const whitelistMintCount = mintCounts?.whitelistMintCount;
  const isPaused = mintStatus?.isPaused ?? false;

  const value = useMemo(
    () => BigInt(quantity) * (mintPrice ?? BigInt(0)),
    [quantity, mintPrice],
  );

  const isEligible = useMemo(
    () =>
      (phase === MintPhase.Public && mintedPercent < 100) ||
      (phase === MintPhase.Holder && proof?.holder != null) ||
      (phase === MintPhase.Whitelist && proof?.whitelist != null),
    [phase, proof, mintedPercent],
  );

  const holderMaxQuantity = proof?.holder?.maxQuantity ?? null;

  const maxQuantity = useMemo(() => {
    if (phase === MintPhase.Holder && holderMaxQuantity !== null) {
      return Math.max(
        0,
        Number(holderMaxQuantity) -
          (holderMintCount !== undefined ? Number(holderMintCount) : 0),
      );
    }

    if (phase === MintPhase.Whitelist) {
      return Math.max(
        0,
        2 - (whitelistMintCount !== undefined ? Number(whitelistMintCount) : 0),
      );
    }

    if (phase === MintPhase.Public) {
      return Math.min(maxSupply - minted, Number(maxPublicMints));
    }

    return null;
  }, [
    phase,
    holderMaxQuantity,
    holderMintCount,
    whitelistMintCount,
    minted,
    maxSupply,
    maxPublicMints,
  ]);

  const mint = useCallback(async () => {
    const variables = {
      quantity,
      value,
    };

    const options = {
      onSuccess: () => setQuantity(1),
      onError: (error: Error) => console.error(error),
    };

    if (phase === MintPhase.Public) {
      publicMint(variables, options);
    } else if (phase === MintPhase.Holder && proof?.holder) {
      holderMint(
        {
          ...variables,
          maxQuantity: proof.holder.maxQuantity,
          proof: proof.holder.proof,
        },
        options,
      );
    } else if (phase === MintPhase.Whitelist && proof?.whitelist) {
      whitelistMint(
        {
          ...variables,
          proof: proof.whitelist.proof,
        },
        options,
      );
    }
  }, [phase, quantity, proof, value, holderMint, publicMint, whitelistMint]);

  const isClosed = phase === MintPhase.Closed;

  const isMintedOut = !isClosed && mintedPercent >= 100;

  const isDisabled =
    isClosed ||
    isMintedOut ||
    isCheckingProof ||
    !isEligible ||
    isMinting ||
    !maxQuantity ||
    isPaused;

  const buttonLabel = useMemo(() => {
    if (isPaused) return "Mint paused";
    if (isClosed) return "Mint Closed";
    if (isMintedOut) return "Minted Out";
    if (isCheckingProof) return "Checking eligibility…";
    if (!isEligible) return "Not Eligible";
    if (isMinting) return "Minting…";
    return "Mint Now";
  }, [isClosed, isMintedOut, isCheckingProof, isEligible, isMinting, isPaused]);

  const maxLabel = useMemo(() => {
    if (phase === MintPhase.Holder && holderMaxQuantity != null) {
      return `Max ${Number(holderMaxQuantity)} (Minted ${holderMintCount})`;
    }

    if (phase === MintPhase.Whitelist) {
      return `Max 2 per wallet (Minted ${whitelistMintCount})`;
    }

    if (phase === MintPhase.Public) {
      return `Minted ${lilBurnsCount ?? 0}`;
    }
  }, [
    phase,
    holderMintCount,
    holderMaxQuantity,
    whitelistMintCount,
    lilBurnsCount,
  ]);

  function handleQuantityChange(delta: number) {
    setQuantity((quantity) => {
      const next = quantity + delta;

      if (next < 1) {
        return 1;
      }

      if (maxQuantity !== null && next > maxQuantity) {
        return maxQuantity;
      }

      return next;
    });
  }

  if (
    isPriceLoading ||
    isStatusLoading ||
    isProgressLoading ||
    isCountsLoading
  ) {
    return <MintControlsSkeleton />;
  }

  return (
    <GrungeCard
      className="flex w-full flex-col gap-5 rounded p-6"
      style={{ height: HEIGHT }}
    >
      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold tracking-wide text-white uppercase">
          Quantity
        </label>

        <div className="flex items-center gap-2">
          <StepperButton
            onClick={() => handleQuantityChange(-1)}
            disabled={isDisabled || quantity <= 1}
          >
            &minus;
          </StepperButton>

          <div className="flex h-10 flex-1 items-center justify-center rounded-sm border border-zinc-700 bg-zinc-800 text-lg font-semibold text-white">
            {quantity}
          </div>

          <StepperButton
            onClick={() => handleQuantityChange(1)}
            disabled={
              isDisabled || (maxQuantity !== null && quantity >= maxQuantity)
            }
          >
            +
          </StepperButton>
        </div>
        <div className="h-4">
          {maxLabel ? (
            <span className="text-xs text-zinc-500">{maxLabel}</span>
          ) : (
            <span className="text-xs text-zinc-700">---</span>
          )}
        </div>
      </div>

      <div className="flex flex-col divide-y divide-zinc-700/50 rounded-sm border border-zinc-700/50 bg-zinc-800/50">
        <div className="flex items-center justify-between px-5 py-3">
          <span className="text-sm font-semibold text-zinc-300 uppercase">
            Price per NFT
          </span>

          <span className="text-sm font-bold text-white">
            {formatEther(mintPrice!)} AVAX
          </span>
        </div>

        <div className="flex items-center justify-between px-5 py-3">
          <span className="text-sm font-bold text-white uppercase">
            Total Price
          </span>

          <GradientText>
            <span className="text-xl font-black">
              {formatEther(value)} AVAX
            </span>
          </GradientText>
        </div>
      </div>

      <WalletActionButton
        onClick={mint}
        disabled={isDisabled}
        isPending={isMinting}
      >
        {buttonLabel}
      </WalletActionButton>
    </GrungeCard>
  );
}
