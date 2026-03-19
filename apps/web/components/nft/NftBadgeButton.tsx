"use client";

import { IconFire } from "@/components/icons/IconFire";
import { IconSkull } from "@/components/icons/IconSkull";
import { useNftModal } from "@/components/nft/NftModalContext";
import type { ReactNode } from "react";

const ICON: Record<"burned" | "cursed", ReactNode> = {
  cursed: <IconSkull className="h-3 w-3 text-orange-400" />,
  burned: <IconFire className="h-3 w-3 text-red-400" />,
};

export function NftBadgeButton({
  tokenId,
  variant,
}: {
  tokenId: number;
  variant?: "burned" | "cursed";
}) {
  const { openNftModal } = useNftModal();

  return (
    <button
      onClick={() => openNftModal(tokenId)}
      className="flex cursor-pointer items-center gap-1 rounded-sm border border-zinc-700 bg-zinc-800/80 px-2 py-1 font-mono text-sm text-zinc-300 outline-none hover:border-zinc-500 hover:text-white focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
    >
      {variant && ICON[variant]}#{tokenId}
    </button>
  );
}
