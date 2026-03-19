import type { ReactNode } from "react";

export function CardsRow({ children }: { children: ReactNode }) {
  return (
    <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-3">
      {children}
    </div>
  );
}
