"use client";

import { WalletActionButton } from "@/components/wallet/WalletActionButton";
import { useSignOut } from "@/hooks/mutations/useSignOut";
import type { ComponentPropsWithoutRef } from "react";

export function WalletSignOut({
  size,
}: {
  size?: ComponentPropsWithoutRef<typeof WalletActionButton>["size"];
}) {
  const { mutate: signOut, isPending: isSigningOut } = useSignOut();

  return (
    <WalletActionButton
      onClick={() => signOut()}
      isPending={isSigningOut}
      size={size}
    >
      Sign out
    </WalletActionButton>
  );
}
