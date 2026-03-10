"use client";

import { ConnectModal } from "@/components/ConnectModal";
import { GrungeButton } from "@/components/GrungeButton";
import { WalletIcon } from "@/components/icons";
import { OutlineButton } from "@/components/OutlineButton";
import { truncateAddress } from "@/utils/truncateAddress";
import { useState } from "react";
import { useConnection, useDisconnect } from "wagmi";

export function ConnectButton() {
  const [modalOpen, setModalOpen] = useState(false);

  const { address, isConnected } = useConnection();

  const { mutate: disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-zinc-100">
          {truncateAddress(address)}
        </span>

        <OutlineButton
          onClick={() => {
            disconnect();
            setModalOpen(false);
          }}
        >
          Disconnect
        </OutlineButton>
      </div>
    );
  }

  return (
    <>
      <GrungeButton
        onClick={() => setModalOpen(true)}
        size="sm"
        icon={WalletIcon}
      >
        Connect Wallet
      </GrungeButton>

      {modalOpen && <ConnectModal onClose={() => setModalOpen(false)} />}
    </>
  );
}
