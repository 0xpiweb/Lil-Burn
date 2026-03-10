"use client";

import { twMerge } from "@/lib/tw";
import { ComponentPropsWithoutRef } from "react";

export function GrungeCard({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={twMerge(
        "relative border border-zinc-700/40 bg-[linear-gradient(180deg,rgba(24,24,27,0.8)_0%,rgba(15,15,18,0.9)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.03),0_4px_20px_rgba(0,0,0,0.5)]",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[url('/textures/grain.png')] bg-size-[256px_256px] bg-repeat opacity-[0.035]"
      />
      {children}
    </div>
  );
}
