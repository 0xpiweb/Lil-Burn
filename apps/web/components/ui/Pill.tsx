import type { ReactNode } from "react";

export function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full bg-orange-500/15 px-3 py-1 text-xs font-bold text-orange-400">
      {children}
    </span>
  );
}
