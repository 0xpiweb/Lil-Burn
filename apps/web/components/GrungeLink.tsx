"use client";

import { GrainOverlay } from "@/components/GrainOverlay";
import { buildGrungeClass, GrungeProps } from "@/components/GrungeButton";
import { twJoin } from "@/lib/tw";
import Link, { LinkProps } from "next/link";

export function GrungeLink({
  className,
  children,
  size = "base",
  icon: Icon,
  active = true,
  ...props
}: LinkProps &
  Pick<React.AnchorHTMLAttributes<HTMLAnchorElement>, "target" | "rel"> &
  GrungeProps & {
    children?: React.ReactNode;
  }) {
  return (
    <Link
      className={twJoin(
        "inline-flex cursor-pointer",
        buildGrungeClass({ size, icon: Icon, active, className }),
      )}
      {...props}
    >
      {active && <GrainOverlay />}
      {Icon && <Icon className={size === "sm" ? "size-4" : "size-5"} />}
      {children}
    </Link>
  );
}
