import { GrungeCard } from "@/components/ui/GrungeCard";

export const HEIGHT = 102;

export function StatCard({
  value,
  unit,
  label,
}: {
  value: number;
  unit?: string;
  label: string;
}) {
  return (
    <GrungeCard
      className="flex flex-col items-center justify-center gap-2 rounded-sm px-5 py-6"
      style={{ height: HEIGHT }}
    >
      <div className="text-xl font-black text-white">
        {value} {unit}
      </div>

      <div className="text-xs text-zinc-500">{label}</div>
    </GrungeCard>
  );
}
