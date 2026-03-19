import { twJoin } from "@/lib/tw";
import type { ReactNode } from "react";

export function PaginationButton({
  onClick,
  disabled,
  active,
  "aria-label": ariaLabel,
  "aria-current": ariaCurrent,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  "aria-label"?: string;
  "aria-current"?: "page";
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-current={ariaCurrent}
      className={twJoin(
        "inline-flex h-9 min-w-9 items-center justify-center rounded px-2 text-sm font-medium focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 focus-visible:outline-none",
        disabled
          ? "text-zinc-600"
          : active
            ? "bg-red-800 text-white"
            : "bg-zinc-800 text-zinc-300 not-disabled:cursor-pointer hover:bg-zinc-700",
      )}
    >
      {children}
    </button>
  );
}
