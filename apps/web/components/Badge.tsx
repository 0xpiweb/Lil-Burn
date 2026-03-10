import { ReactNode } from "react";

export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-sm border border-red-800/40 bg-red-900/20 px-4 py-1.5 text-xs font-bold tracking-wide text-red-500 uppercase">
      {children}
    </span>
  );
}
