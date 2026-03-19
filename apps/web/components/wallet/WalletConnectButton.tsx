"use client";

import { IconWallet } from "@/components/icons/IconWallet";
import { GrungeButton } from "@/components/ui/GrungeButton";
import { OutlineButton } from "@/components/ui/OutlineButton";
import { WalletConnectModal } from "@/components/wallet/WalletConnectModal";
import { formatHex } from "@/lib/format";
import { useState } from "react";
import { useConnection, useDisconnect } from "wagmi";

export function WalletConnectButton() {
  const [modalOpen, setModalOpen] = useState(false);

  const { address, isConnected } = useConnection();

  const { mutate: disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-zinc-100">
          {formatHex(address)}
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
        icon={IconWallet}
      >
        Connect Wallet
      </GrungeButton>

      {modalOpen && <WalletConnectModal onClose={() => setModalOpen(false)} />}
    </>
  );
}
