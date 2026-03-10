"use client";

import { twJoin } from "@/lib/tw";

export function WarChestDonationPresets({
  amount,
  presets,
  onSelect,
  disabled = false,
}: {
  amount: string;
  presets: number[];
  onSelect: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex grow-0 gap-2">
      {presets.map((preset) => (
        <button
          key={preset}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(String(preset))}
          className={twJoin(
            "rounded-full px-3 py-1 text-xs font-semibold outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-1 focus-visible:ring-offset-zinc-900",
            Number(amount) === preset
              ? "bg-zinc-300 text-zinc-900"
              : "bg-zinc-700 text-zinc-300 not-disabled:cursor-pointer not-disabled:hover:bg-zinc-600 not-disabled:hover:text-white",
          )}
        >
          {preset}
        </button>
      ))}
    </div>
  );
}
