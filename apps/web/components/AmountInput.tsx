"use client";

export function AmountInput({
  value,
  min,
  disabled,
  onChange,
}: {
  value: string;
  min: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={() => {
        const n = parseFloat(value);
        if (!value || isNaN(n) || n < parseFloat(min)) onChange(min);
      }}
      min={min}
      step="0.1"
      disabled={disabled}
      placeholder={`Custom amount (min ${min})`}
      className="h-12 w-full [appearance:textfield] rounded-sm border border-zinc-700 bg-zinc-800 px-4 text-sm text-zinc-300 outline-none placeholder:text-zinc-600 focus:border-zinc-400 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
    />
  );
}
