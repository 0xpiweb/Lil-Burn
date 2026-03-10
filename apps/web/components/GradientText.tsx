import { ReactNode } from "react";

export function GradientText({ children }: { children: ReactNode }) {
  return (
    <span className="bg-linear-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
      {children}
    </span>
  );
}
