"use client";

import { GrainOverlay } from "@/components/GrainOverlay";
import { buildGrungeClass } from "@/components/GrungeButton";
import { GrungeCard } from "@/components/GrungeCard";
import { twJoin } from "@/lib/tw";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ComponentType, SVGProps } from "react";

export function LeaderboardTabs({
  tabs,
}: {
  tabs: {
    id: string;
    label: string;
    Icon: ComponentType<SVGProps<SVGSVGElement>>;
    href: string;
  }[];
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentHref =
    pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");

  return (
    <GrungeCard className="flex w-full items-center gap-1 rounded-sm p-1.5 sm:w-auto">
      {tabs.map((tab) => {
        const isActive = currentHref === tab.href;
        return (
          <Link
            key={tab.id}
            href={tab.href}
            scroll={false}
            className={twJoin(
              "flex flex-1 sm:flex-none",
              buildGrungeClass({
                size: "sm",
                icon: tab.Icon,
                active: isActive,
              }),
            )}
          >
            {isActive && <GrainOverlay />}
            <tab.Icon className="size-4 shrink-0" />
            <span className="hidden sm:inline">{tab.label}</span>
          </Link>
        );
      })}
    </GrungeCard>
  );
}
