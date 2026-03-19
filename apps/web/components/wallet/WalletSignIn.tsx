"use client";

import { WalletActionButton } from "@/components/wallet/WalletActionButton";
import { useSignIn } from "@/hooks/mutations/useSignIn";

export function WalletSignIn() {
  const { mutate: signIn, isPending: isSigningIn } = useSignIn();

  return (
    <WalletActionButton onClick={() => signIn()} isPending={isSigningIn}>
      Sign in
    </WalletActionButton>
  );
}
