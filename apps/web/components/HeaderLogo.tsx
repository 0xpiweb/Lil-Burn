"use client";

import Image from "next/image";
import Link from "next/link";

export function HeaderLogo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 rounded-sm font-bold text-white focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 focus-visible:outline-none"
    >
      <Image
        src="/logo.png"
        className="h-20 w-16"
        alt="Lil-Burn logo"
        width={80}
        height={64}
        preload
      />

      <span className="text-lg tracking-tight">LIL-BURN</span>
    </Link>
  );
}
