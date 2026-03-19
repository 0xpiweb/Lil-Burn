"use client";

import { signOut } from "@/actions/signOut";
import { GrungeCard } from "@/components/ui/GrungeCard";
import { Modal } from "@/components/ui/Modal";
import { OutlineButton } from "@/components/ui/OutlineButton";
import { useConnect, useConnectors } from "wagmi";

export function WalletConnectModal({ onClose }: { onClose: () => void }) {
  const connectors = useConnectors();

  const { mutate, isPending, variables } = useConnect();

  return (
    <Modal onClose={onClose}>
      <GrungeCard className="w-full max-w-sm rounded p-6 shadow-xl">
        <h2 className="mb-4 text-center font-display text-lg font-semibold text-zinc-100">
          Connect Wallet
        </h2>

        <div className="flex flex-col gap-2">
          {connectors.map((connector) => (
            <OutlineButton
              key={connector.uid}
              onClick={() =>
                mutate(
                  { connector },
                  {
                    onSuccess: () => {
                      signOut();
                      onClose();
                    },
                  },
                )
              }
              disabled={isPending}
              isPending={isPending && variables?.connector === connector}
              className="h-12"
            >
              {connector.name}
            </OutlineButton>
          ))}
        </div>
      </GrungeCard>
    </Modal>
  );
}
