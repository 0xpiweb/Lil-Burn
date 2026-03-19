"use client";

import { CursedBurnedNFTs } from "@/components/cursed/CursedBurnedNFTs";
import { CursedNFTs } from "@/components/cursed/CursedNFTs";
import { useSearchParams } from "next/navigation";
import type { ReactNode } from "react";

export function CursedContent() {
  const tab = useSearchParams().get("tab") as "burned" | undefined;

  let title: ReactNode;
  let description: ReactNode;
  let content: ReactNode;

  if (tab === "burned") {
    title = "Burned";
    description = "Lil-Burns that were sacrificed to the flame, gone forever.";
    content = <CursedBurnedNFTs />;
  } else {
    title = "Cursed";
    description = "Lil-Burns that were cursed and bear the mark for eternity.";
    content = <CursedNFTs />;
  }

  return (
    <>
      <div className="flex w-full flex-col items-center gap-2">
        <h2 className="font-display text-2xl font-bold tracking-wide text-white">
          {title}
        </h2>

        <p className="text-center text-sm text-zinc-500">{description}</p>
      </div>

      {content}
    </>
  );
}
