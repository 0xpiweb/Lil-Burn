"use client";

import { WarChestEpochLeaderboard } from "@/components/war-chest/WarChestEpochLeaderboard";
import { WarChestOverallLeaderboard } from "@/components/war-chest/WarChestOverallLeaderboard";
import { WarChestSponsors } from "@/components/war-chest/WarChestSponsors";
import { useSearchParams } from "next/navigation";
import type { ReactNode } from "react";

export function WarChestContent() {
  const tab = useSearchParams().get("tab") as
    | "overall"
    | "sponsors"
    | undefined;

  let title: ReactNode;
  let description: ReactNode;
  let content: ReactNode;

  if (tab === "overall") {
    title = "All-Time Leaders";
    description = "All time top contributors";
    content = <WarChestOverallLeaderboard />;
  } else if (tab === "sponsors") {
    title = "Partner Projects";
    description =
      "Supporting the burn through tactical sponsorships. 100% of partner contributions are allocated to Mass Burn events.";
    content = <WarChestSponsors />;
  } else {
    title = "Quarter Leaders";
    description = "Current quarter top contributors";
    content = <WarChestEpochLeaderboard />;
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
