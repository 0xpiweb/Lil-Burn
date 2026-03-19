import type { ReactNode } from "react";

export const HEIGHT = 30;

export function Badge({
  children,
  width = "auto",
}: {
  children: ReactNode;
  width?: "auto" | number;
}) {
  return (
    <span
      className="rounded-sm border border-red-800/40 bg-red-900/20 px-4 py-1.5 text-center text-xs font-bold tracking-wide text-red-500 uppercase"
      style={{ width, height: HEIGHT }}
    >
      {children}
    </span>
  );
}
