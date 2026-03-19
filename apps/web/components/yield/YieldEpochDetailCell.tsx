import type { ReactNode } from "react";

export function YieldEpochDetailDetailCell({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs tracking-widest text-zinc-500 uppercase">{label}</p>

      <p className="font-mono text-sm font-bold text-white">{value}</p>
    </div>
  );
}
