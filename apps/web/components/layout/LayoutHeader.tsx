"use client";

import { LayoutHeaderDrawerButton } from "@/components/layout/LayoutHeaderDrawerButton";
import { LayoutHeaderLogo } from "@/components/layout/LayoutHeaderLogo";
import { LayoutHeaderNavLinks } from "@/components/layout/LayoutHeaderNavLinks";
import { GrungeLineRed } from "@/components/ui/GrungeLineRed";
import { WalletConnectButton } from "@/components/wallet/WalletConnectButton";
import { type ComponentPropsWithoutRef, useState } from "react";

const LINKS: ComponentPropsWithoutRef<typeof LayoutHeaderNavLinks>["links"] = [
  { href: "/mint", label: "Mint" },
  {
    // href: "/war-chest",
    label: "War Chest",
  },
  {
    // href: "/cursed",
    label: "Cursed",
  },
  { href: "/yield", label: "Yield" },
  process.env.NEXT_PUBLIC_CHAIN === "localhost"
    ? { href: "/admin", label: "ADMIN" }
    : null,
].filter((link) => link != null);

export function LayoutHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="relative border-b border-zinc-800/50">
      <GrungeLineRed />

      <div className="flex items-center justify-between px-6 pt-4 pb-2 md:py-4">
        <LayoutHeaderLogo />

        <div className="flex items-center gap-3">
          <nav className="hidden items-center gap-5 md:flex">
            <LayoutHeaderNavLinks links={LINKS} />
          </nav>

          <div className="hidden md:block">
            <WalletConnectButton />
          </div>

          <LayoutHeaderDrawerButton
            open={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          />
        </div>
      </div>

      <div className="flex justify-center border-t border-zinc-800/40 px-6 pt-2 pb-4 md:hidden">
        <WalletConnectButton />
      </div>

      {menuOpen && (
        <nav className="flex flex-col items-center gap-4 border-t border-zinc-800/50 px-6 py-4 md:hidden">
          <LayoutHeaderNavLinks
            links={LINKS}
            onNavigate={() => setMenuOpen(false)}
          />
        </nav>
      )}
    </header>
  );
}
