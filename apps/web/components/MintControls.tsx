"use client";

import { useHolderMint } from "@/hooks/useHolderMint";
import { useMintCounts } from "@/hooks/useMintCounts";
import { useMintPrice } from "@/hooks/useMintPrice";
import { useProof } from "@/hooks/useProof";
import { usePublicMint } from "@/hooks/usePublicMint";
import { useWhitelistMint } from "@/hooks/useWhitelistMint";
import { MintPhase } from "@/types/MintPhase";
import { useCallback, useEffect, useMemo, useState } from "react";
import { formatEther } from "viem";
import { useConnection } from "wagmi";

import { useLilBurnsCount } from "@/hooks/useLilBurnsCount";
import { useMaxPublicMints } from "@/hooks/useMaxPublicMints";
import { useMintPhase } from "@/hooks/useMintPhase";
import { useMintProgress } from "@/hooks/useMintProgress";
import { useMintStatus } from "@/hooks/useMintStatus";
import { GradientText } from "./GradientText";
import { GrungeCard } from "./GrungeCard";
import { StepperButton } from "./StepperButton";
import { WalletActionButton } from "./WalletActionButton";

export const HEIGHT = 341;

export function MintControls() {
  const { address } = useConnection();

  const [quantity, setQuantity] = useState(1);

  const { data: mintPrice } = useMintPrice();

  const { data: lilBurnsCount } = useLilBurnsCount(address);

  const {
    data: { isPaused, holderStart, whitelistStart, publicStart },
  } = useMintStatus();

  const phase = useMintPhase({ holderStart, whitelistStart, publicStart });

  const {
    data: { minted, maxSupply, mintedPercent },
  } = useMintProgress();

  const price = useMemo(
    () => BigInt(quantity) * mintPrice,
    [quantity, mintPrice],
  );

  const { data: proof, isPending: isProofLoading } = useProof(address);

  const {
    data: { holderMintCount, whitelistMintCount },
  } = useMintCounts(address);

  const { data: maxPublicMints } = useMaxPublicMints();

  const { mutate: holderMint, isPending: isHolderMintPending } =
    useHolderMint();

  const { mutate: whitelistMint, isPending: isWhitelistMintPending } =
    useWhitelistMint();

  const { mutate: publicMint, isPending: isPublicMintPending } =
    usePublicMint();

  const isMinting =
    isHolderMintPending || isWhitelistMintPending || isPublicMintPending;

  useEffect(() => {
    setQuantity(1);
  }, [phase, address]);

  const isCheckingProof = phase !== MintPhase.Public && isProofLoading;

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

  function handleQuantityChange(delta: number) {
    setQuantity((q) => {
      const next = q + delta;
      if (next < 1) return 1;
      if (maxQuantity !== null && next > maxQuantity) return maxQuantity;
      return next;
    });
  }

  const mint = useCallback(async () => {
    const variables = {
      quantity,
      value: price,
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
  }, [phase, quantity, proof, price, holderMint, publicMint, whitelistMint]);

  const isClosed = phase === MintPhase.Closed;

  const isDisabled =
    isClosed ||
    isCheckingProof ||
    !isEligible ||
    isMinting ||
    !maxQuantity ||
    isPaused;

  const buttonLabel = useMemo(() => {
    if (isPaused) return "Mint paused";
    if (isClosed) return "Mint Closed";
    if (isCheckingProof) return "Checking eligibility…";
    if (!isEligible) return "Not Eligible";
    if (isMinting) return "Minting…";
    return "Mint Now";
  }, [isClosed, isCheckingProof, isEligible, isMinting, isPaused]);

  const maxLabel = useMemo(() => {
    if (phase === MintPhase.Holder && holderMaxQuantity != null) {
      return `Max ${Number(holderMaxQuantity)} (Minted ${holderMintCount})`;
    }

    if (phase === MintPhase.Whitelist) {
      return `Max 2 per wallet (Minted ${whitelistMintCount})`;
    }

    if (phase === MintPhase.Public) {
      return `Minted ${lilBurnsCount}`;
    }
  }, [
    phase,
    holderMintCount,
    holderMaxQuantity,
    whitelistMintCount,
    lilBurnsCount,
  ]);

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
            {formatEther(mintPrice)} AVAX
          </span>
        </div>

        <div className="flex items-center justify-between px-5 py-3">
          <span className="text-sm font-bold text-white uppercase">
            Total Price
          </span>
          <GradientText>
            <span className="text-xl font-black">
              {formatEther(price)} AVAX
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
