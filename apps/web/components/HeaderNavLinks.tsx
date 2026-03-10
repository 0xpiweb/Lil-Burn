"use client";

import { twJoin } from "@/lib/tw";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function HeaderNavLinks({
  links,
  onNavigate,
}: {
  links: { href?: string; label: string }[];
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {links.map(({ href, label }) =>
        href ? (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={twJoin(
              "rounded-sm text-sm font-medium tracking-widest uppercase focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 focus-visible:outline-none",
              pathname === href
                ? "text-red-500"
                : "text-zinc-400 hover:text-zinc-200",
            )}
          >
            {label}
          </Link>
        ) : (
          <div
            key={label}
            className="text-sm font-medium tracking-widest uppercase opacity-20"
          >
            {label}
          </div>
        ),
      )}
    </>
  );
}
