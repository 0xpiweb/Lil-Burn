"use client";

import { ConnectModal } from "@/components/ConnectModal";
import { GrungeButton, GrungeProps } from "@/components/GrungeButton";
import { FireIcon, WalletIcon } from "@/components/icons";
import { ComponentPropsWithoutRef, useState } from "react";
import { useChains, useConnection, useSwitchChain } from "wagmi";

export function WalletActionButton({
  children,
  isPending = false,
  ...props
}: ComponentPropsWithoutRef<"button"> & GrungeProps & { isPending?: boolean }) {
  const [connectOpen, setConnectOpen] = useState(false);

  const { address, chainId } = useConnection();

  const chains = useChains();

  const { mutate: switchChain, isPending: isSwitching } = useSwitchChain();

  const isWrongChain = !!address && !chains.some((c) => c.id === chainId);

  if (!address) {
    return (
      <>
        <GrungeButton icon={WalletIcon} onClick={() => setConnectOpen(true)}>
          Connect Wallet
        </GrungeButton>

        {connectOpen && <ConnectModal onClose={() => setConnectOpen(false)} />}
      </>
    );
  }

  if (isWrongChain) {
    const target = chains[0];

    return (
      <GrungeButton
        onClick={() => switchChain({ chainId: target.id })}
        disabled={isSwitching}
      >
        {isSwitching ? "Switching…" : `Switch to ${target.name}`}
      </GrungeButton>
    );
  }

  return (
    <GrungeButton {...props} disabled={isPending || props.disabled}>
      <span className={isPending ? "invisible" : undefined}>{children}</span>
      {isPending && (
        <FireIcon className="absolute inset-0 m-auto size-5 animate-flame" />
      )}
    </GrungeButton>
  );
}
