"use client";

import { useMintPhase } from "@/hooks/useMintPhase";
import { useMintStatus } from "@/hooks/useMintStatus";
import { useProof } from "@/hooks/useProof";
import { MintPhase } from "@/types/MintPhase";
import { MintPhaseStatus } from "@/types/MintPhaseStatus";
import { ComponentPropsWithoutRef, useMemo } from "react";
import { useConnection } from "wagmi";
import { MintPhaseCard } from "./MintPhaseCard";

export function MintPhaseCards() {
  const {
    data: { holderStart, whitelistStart, publicStart },
  } = useMintStatus();

  const { address } = useConnection();

  const { data: proof, isLoading: isProofLoading } = useProof(address);

  const mintPhase = useMintPhase({ holderStart, whitelistStart, publicStart });

  const mintPhases = useMemo(() => {
    return [
      {
        phase: MintPhase.Holder,
        label: "Lil Coq Holders",
        description: "Exclusive access for Lil Coq NFT holders",
        startAt: holderStart,
        quantity: isProofLoading
          ? undefined
          : proof?.holder?.maxQuantity
            ? Number(proof.holder.maxQuantity)
            : null,
      },
      {
        phase: MintPhase.Whitelist,
        label: "Whitelisted",
        description: "Whitelisted community members",
        startAt: whitelistStart,
        quantity: isProofLoading ? undefined : proof?.whitelist ? 2 : null,
      },
      {
        phase: MintPhase.Public,
        label: "Public",
        description: "Open to all",
        startAt: publicStart,
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
    }) satisfies ComponentPropsWithoutRef<typeof MintPhaseCard>[];
  }, [
    holderStart,
    whitelistStart,
    publicStart,
    mintPhase,
    proof,
    isProofLoading,
  ]);

  return (
    <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-3">
      {mintPhases.map((mintPhase) => (
        <MintPhaseCard key={mintPhase.phase} {...mintPhase} />
      ))}
    </div>
  );
}
