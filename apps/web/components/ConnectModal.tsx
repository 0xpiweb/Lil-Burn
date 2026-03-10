"use client";

import { GrungeCard } from "@/components/GrungeCard";
import { OutlineButton } from "@/components/OutlineButton";
import { useConnect, useConnectors } from "wagmi";

export function ConnectModal({ onClose }: { onClose: () => void }) {
  const connectors = useConnectors();

  const { mutate, isPending, variables } = useConnect();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <GrungeCard
        className="w-full max-w-sm rounded p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 text-center font-display text-lg font-semibold text-zinc-100">
          Connect Wallet
        </h2>

        <div className="flex flex-col gap-2">
          {connectors.map((connector) => (
            <OutlineButton
              key={connector.uid}
              onClick={() => mutate({ connector }, { onSuccess: onClose })}
              disabled={isPending}
              isPending={isPending && variables?.connector === connector}
              className="h-12"
            >
              {connector.name}
            </OutlineButton>
          ))}
        </div>
      </GrungeCard>
    </div>
  );
}
