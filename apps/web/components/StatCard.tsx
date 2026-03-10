"use client";

import { GrungeCard } from "@/components/GrungeCard";

export const HEIGHT = 102;

export function StatCard({ value, label }: { value: number; label: string }) {
  return (
    <GrungeCard
      className="flex flex-col items-center justify-center gap-2 rounded-sm px-5 py-6"
      style={{ height: HEIGHT }}
    >
      <div className="text-xl font-black text-white">{value}</div>
      <div className="text-xs text-zinc-500">{label}</div>
    </GrungeCard>
  );
}
