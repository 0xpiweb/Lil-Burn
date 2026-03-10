"use client";

import { GrainOverlay } from "@/components/GrainOverlay";
import { twJoin, twMerge } from "@/lib/tw";
import { ComponentPropsWithoutRef, ComponentType } from "react";

export type GrungeProps = {
  size?: "base" | "sm";
  icon?: ComponentType<{ className?: string }>;
  active?: boolean;
  className?: string;
};

export function buildGrungeClass({
  size = "base",
  icon,
  active = true,
  className,
}: GrungeProps) {
  return twMerge(
    "relative overflow-hidden rounded-sm",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
    size === "sm" ? "py-2.5" : "py-4",
    size === "sm" ? "text-sm" : "text-lg",
    "px-5 tracking-wide uppercase font-bold items-center justify-center",
    icon && "gap-2",
    active
      ? twJoin(
          "text-white grunge-glow",
          "bg-[linear-gradient(180deg,rgba(185,28,28,1)_0%,rgba(127,29,29,1)_100%)]",
          "[text-shadow:0_1px_2px_rgba(0,0,0,0.5)]",
        )
      : "text-zinc-400 hover:text-zinc-200",
    className,
  );
}

export function GrungeButton({
  className,
  children,
  size = "base",
  icon: Icon,
  active = true,
  ...props
}: ComponentPropsWithoutRef<"button"> & GrungeProps) {
  return (
    <button
      className={twJoin(
        "flex not-disabled:cursor-pointer disabled:opacity-50",
        buildGrungeClass({ size, icon: Icon, active, className }),
      )}
      {...props}
    >
      {active && <GrainOverlay />}

      {Icon && <Icon className={size === "sm" ? "size-4" : "size-5"} />}

      {children}
    </button>
  );
}
