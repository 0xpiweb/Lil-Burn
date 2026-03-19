"use client";

import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { buildGrungeClass } from "@/components/ui/GrungeButton";
import { GrungeCard } from "@/components/ui/GrungeCard";
import { twJoin } from "@/lib/tw";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { ComponentType, SVGProps } from "react";

export function Tabs({
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

  const allTabParams = tabs.flatMap(({ href }) => [
    ...new URL(href, "http://example.com").searchParams.keys(),
  ]);

  return (
    <GrungeCard className="flex w-full items-center gap-1 rounded-sm p-1.5 sm:w-auto">
      {tabs.map((tab) => {
        const tabUrl = new URL(tab.href, "http://example.com");

        const tabParams = [...tabUrl.searchParams.entries()];

        const isActive =
          pathname === tabUrl.pathname &&
          (tabParams.length > 0
            ? tabParams.every(
                ([name, value]) => searchParams.get(name) === value,
              )
            : allTabParams.every((name) => !searchParams.has(name)));

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
