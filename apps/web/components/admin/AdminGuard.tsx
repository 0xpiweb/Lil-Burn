import { getUser } from "@/actions/getUser";
import { RestrictedPage } from "@/components/layout/RestrictedPage";
import { WalletSignIn } from "@/components/wallet/WalletSignIn";
import { WalletSignOut } from "@/components/wallet/WalletSignOut";
import { getSession } from "@/lib/session";
import type { ReactNode } from "react";

export async function RequireGuard({ children }: { children: ReactNode }) {
  const session = await getSession();

  if (!session?.address) {
    return (
      <RestrictedPage
        introduction="You must sign in with your wallet to be granted access"
        action={<WalletSignIn />}
      />
    );
  }

  const user = await getUser();

  if (!user || user.role !== "admin") {
    return (
      <RestrictedPage
        introduction={`You do not have permission to access this page with ${user?.address}`}
        action={<WalletSignOut />}
      />
    );
  }

  return children;
}
