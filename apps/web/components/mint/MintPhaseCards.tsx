"use client";

import { MintPhaseCard } from "@/components/mint/MintPhaseCard";
import { MintPhaseCardsSkeleton } from "@/components/mint/MintPhaseCardsSkeleton";
import { useLilBurnMintProof } from "@/hooks/queries/useLilBurnMintProof";
import { useLilBurnMintStatus } from "@/hooks/queries/useLilBurnMintStatus";
import { useLilBurnMintPhase } from "@/hooks/useLilBurnMintPhase";
import { MintPhase } from "@/types/MintPhase";
import { MintPhaseStatus } from "@/types/MintPhaseStatus";
import { type ComponentPropsWithoutRef, useMemo } from "react";
import { useConnection } from "wagmi";
import { CardsRow } from "../ui/CardsRow";

export function MintPhaseCards() {
  const { address } = useConnection();

  const {
    data: proof,
    isLoading: isLoadingProof,
    isSuccess: isSuccessProof,
  } = useLilBurnMintProof(address);

  const { data: mintStatus, isSuccess: isSuccessMintStatus } =
    useLilBurnMintStatus();

  const mintPhase = useLilBurnMintPhase({
    holderStart: mintStatus?.holderStart,
    whitelistStart: mintStatus?.whitelistStart,
    publicStart: mintStatus?.publicStart,
  });

  const mintPhases = useMemo(
    () =>
      [
        {
          phase: MintPhase.Holder,
          label: "Lil Coq Holders",
          description: "Exclusive access for Lil Coq NFT holders",
          startAt: mintStatus?.holderStart,
          quantity: !isSuccessProof
            ? undefined
            : proof?.holder?.maxQuantity
              ? Number(proof.holder.maxQuantity)
              : null,
        },
        {
          phase: MintPhase.Whitelist,
          label: "Whitelisted",
          description: "Whitelisted community members",
          startAt: mintStatus?.whitelistStart,
          quantity: !isSuccessProof ? undefined : proof?.whitelist ? 2 : null,
        },
        {
          phase: MintPhase.Public,
          label: "Public",
          description: "Open to all",
          startAt: mintStatus?.publicStart,
          quantity: Infinity,
        },
      ].map((phase) => {
        let status: MintPhaseStatus;

        if (phase.phase === mintPhase) {
          status = MintPhaseStatus.Active;
        } else if (phase.phase < mintPhase) {
          status = MintPhaseStatus.Completed;
        } else {
          status = MintPhaseStatus.Locked;
        }

        return { ...phase, status };
      }) satisfies ComponentPropsWithoutRef<typeof MintPhaseCard>[],
    [mintStatus, mintPhase, proof, isSuccessProof],
  );

  if (isLoadingProof || !isSuccessMintStatus) {
    return <MintPhaseCardsSkeleton />;
  }

  return (
    <CardsRow>
      {mintPhases.map((mintPhase) => (
        <MintPhaseCard key={mintPhase.phase} {...mintPhase} />
      ))}
    </CardsRow>
  );
}
