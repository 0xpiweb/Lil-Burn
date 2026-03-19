"use client";

import { IconChartBar } from "@/components/icons/IconChartBar";
import { IconFire } from "@/components/icons/IconFire";
import { Tabs } from "@/components/ui/Tabs";
import type { ComponentPropsWithoutRef } from "react";

const TABS: ComponentPropsWithoutRef<typeof Tabs>["tabs"] = [
  {
    id: "epochs",
    label: "Epochs",
    Icon: IconChartBar,
    href: "/admin",
  },
  {
    id: "burn",
    label: "Burn",
    Icon: IconFire,
    href: "/admin?tab=burn",
  },
];

export function AdminTabs() {
  return <Tabs tabs={TABS} />;
}
