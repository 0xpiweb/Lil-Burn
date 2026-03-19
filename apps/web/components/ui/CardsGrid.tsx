import type { ReactNode } from "react";

export function CardsGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      {children}
    </div>
  );
}
