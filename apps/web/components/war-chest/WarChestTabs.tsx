"use client";

import { IconChartBar } from "@/components/icons/IconChartBar";
import { IconStar } from "@/components/icons/IconStar";
import { IconTrophy } from "@/components/icons/IconTrophy";
import { Tabs } from "@/components/ui/Tabs";
import type { ComponentPropsWithoutRef } from "react";

const TABS: ComponentPropsWithoutRef<typeof Tabs>["tabs"] = [
  {
    id: "epoch",
    label: "Quarter Leaderboard",
    Icon: IconChartBar,
    href: "/war-chest",
  },
  {
    id: "overall",
    label: "Overall Leaderboard",
    Icon: IconTrophy,
    href: "/war-chest?tab=overall",
  },
  {
    id: "sponsors",
    label: "Sponsors",
    Icon: IconStar,
    href: "/war-chest?tab=sponsors",
  },
];

export function WarChestTabs() {
  return <Tabs tabs={TABS} />;
}
