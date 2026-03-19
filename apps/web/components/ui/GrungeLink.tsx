import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { buildGrungeClass } from "@/components/ui/GrungeButton";
import { twJoin } from "@/lib/tw";
import type { GrungeProps } from "@/types/GrungeProps";
import Link, { type LinkProps } from "next/link";

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
