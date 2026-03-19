export function YieldEpochDetailSubDetailRow({
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
      <p className="text-xs tracking-widest text-zinc-600 uppercase">{label}</p>
      <p className="font-mono text-xs text-zinc-400">
        {value}
        {unit && <span className="ml-2 text-zinc-600">{unit}</span>}
      </p>
    </div>
  );
}
