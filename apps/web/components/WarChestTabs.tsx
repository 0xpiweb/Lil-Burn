"use client";

import { LeaderboardTabs } from "@/components/LeaderboardTabs";
import { ChartBarIcon, StarIcon, TrophyIcon } from "@/components/icons";
import { ComponentPropsWithoutRef } from "react";

const TABS: ComponentPropsWithoutRef<typeof LeaderboardTabs>["tabs"] = [
  {
    id: "overall",
    label: "Overall Leaderboard",
    Icon: TrophyIcon,
    href: "/war-chest",
  },
  {
    id: "quarterly",
    label: "Epoch Leaderboard",
    Icon: ChartBarIcon,
    href: "/war-chest?tab=quarterly",
  },
  {
    id: "sponsors",
    label: "Sponsors",
    Icon: StarIcon,
    href: "/war-chest?tab=sponsors",
  },
];

export function WarChestTabs() {
  return <LeaderboardTabs tabs={TABS} />;
}
