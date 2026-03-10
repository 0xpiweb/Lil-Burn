"use client";

import { Sponsors } from "@/components/Sponsors";
import { useSearchParams } from "next/navigation";
import { ReactNode } from "react";
import { useConnection } from "wagmi";
import { EpochLeaderboard } from "./EpochLeaderboard";
import { OverallLeaderboard } from "./OverallLeaderboard";

export function WarChestLeaderboard() {
  const tab =
    (useSearchParams().get("tab") as "quarterly" | "sponsors" | undefined) ??
    "overall";

  const { address } = useConnection();

  let title: ReactNode;
  let description: ReactNode;
  let content: ReactNode;

  if (tab === "overall") {
    title = "All-Time Leaders";
    description = "Top contributors to the War Chest";
    content = <OverallLeaderboard address={address} />;
  } else if (tab === "quarterly") {
    title = "Epoch Leaders";
    description = "Top contributors to the War Chest";
    content = <EpochLeaderboard address={address} />;
  } else if (tab === "sponsors") {
    title = "Partner Projects";
    description = "upporting the burn through strategic sponsorships";
    content = <Sponsors />;
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
