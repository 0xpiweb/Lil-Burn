"use client";

import { AdminBurn } from "@/components/admin/AdminBurn";
import { AdminTabs } from "@/components/admin/AdminTabs";
import { AdminYieldEpochs } from "@/components/admin/AdminYieldEpochs";
import { LayoutPage } from "@/components/layout/LayoutPage";
import { LayoutPageHero } from "@/components/layout/LayoutPageHero";
import { GradientText } from "@/components/ui/GradientText";
import { WalletSignOut } from "@/components/wallet/WalletSignOut";
import { useSearchParams } from "next/navigation";

export default function AdminPage() {
  const tab = useSearchParams().get("tab");

  return (
    <LayoutPage>
      <LayoutPageHero
        title={
          <>
            <GradientText>Admin</GradientText> Panel
          </>
        }
        introduction={["Manage yield epochs and burn tokens."]}
        action={<WalletSignOut size="sm" />}
      />

      <AdminTabs />

      {tab === "burn" ? <AdminBurn /> : <AdminYieldEpochs />}
    </LayoutPage>
  );
}
