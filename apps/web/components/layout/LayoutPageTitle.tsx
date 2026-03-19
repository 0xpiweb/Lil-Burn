import type { ReactNode } from "react";

export function LayoutPageTitle({ children }: { children: ReactNode }) {
  return (
    <h1 className="font-display text-4xl font-black text-white uppercase sm:text-5xl">
      {children}
    </h1>
  );
}
