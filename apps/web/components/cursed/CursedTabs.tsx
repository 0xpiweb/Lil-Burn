"use client";

import { IconFire } from "@/components/icons/IconFire";
import { IconSkull } from "@/components/icons/IconSkull";
import { Tabs } from "@/components/ui/Tabs";
import type { ComponentPropsWithoutRef } from "react";

const TABS: ComponentPropsWithoutRef<typeof Tabs>["tabs"] = [
  {
    id: "cursed",
    label: "Cursed",
    Icon: IconSkull,
    href: "/cursed",
  },
  {
    id: "burned",
    label: "Burned",
    Icon: IconFire,
    href: "/cursed?tab=burned",
  },
];

export function CursedTabs() {
  return <Tabs tabs={TABS} />;
}
