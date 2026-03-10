"use client";

import { useMintProgress } from "@/hooks/useMintProgress";

export const HEIGHT = 76;

export function MintProgress() {
  const {
    data: { minted, mintedPercent, maxSupply },
  } = useMintProgress();

  return (
    <div className="flex w-full flex-col gap-3" style={{ height: HEIGHT }}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold tracking-wide text-zinc-400 uppercase">
          Total Minted
        </span>

        <span className="text-sm font-bold text-white">
          {minted} / {maxSupply}
        </span>
      </div>

      <div className="h-3 w-full overflow-hidden rounded-sm bg-zinc-800">
        <div
          className="h-full bg-red-700"
          style={{ width: `${mintedPercent.toFixed(1)}%` }}
        />
      </div>

      <p className="text-center text-sm font-black tracking-wide text-red-500 uppercase italic">
        {mintedPercent.toFixed(1)}% Minted
      </p>
    </div>
  );
}
