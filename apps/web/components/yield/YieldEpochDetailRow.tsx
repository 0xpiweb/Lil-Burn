export function YieldEpochDetailDetailRow({
  label,
  value,
  unit,
}: {
  label: string;
  value: string | number;
  unit?: string;
}) {
  return (
    <div className="flex items-baseline justify-between">
      <p className="text-xs tracking-widest text-zinc-500 uppercase">{label}</p>
      <p className="font-mono text-sm font-bold text-white">
        {value}
        {unit && <span className="ml-2 text-xs text-zinc-600">{unit}</span>}
      </p>
    </div>
  );
}
