"use client";

import { ConnectButton } from "@/components/ConnectButton";
import { GrungeLineRed } from "@/components/GrungeLineRed";
import { HamburgerButton } from "@/components/HamburgerButton";
import { HeaderLogo } from "@/components/HeaderLogo";
import { HeaderNavLinks } from "@/components/HeaderNavLinks";
import { ComponentPropsWithoutRef, useState } from "react";

const LINKS: ComponentPropsWithoutRef<typeof HeaderNavLinks>["links"] = [
  { href: "/mint", label: "Mint" },
  { href: "/war-chest", label: "War Chest" },
  { href: "/cursed", label: "Cursed" },
  { label: "Yield" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="relative border-b border-zinc-800/50">
      <GrungeLineRed />

      <div className="flex items-center justify-between px-6 pt-4 pb-2 md:py-4">
        <HeaderLogo />

        <div className="flex items-center gap-3">
          <nav className="hidden items-center gap-5 md:flex">
            <HeaderNavLinks links={LINKS} />
          </nav>

          <div className="hidden md:block">
            <ConnectButton />
          </div>

          <HamburgerButton
            open={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          />
        </div>
      </div>

      <div className="flex justify-center border-t border-zinc-800/40 px-6 pt-2 pb-4 md:hidden">
        <ConnectButton />
      </div>

      {menuOpen && (
        <nav className="flex flex-col items-center gap-4 border-t border-zinc-800/50 px-6 py-4 md:hidden">
          <HeaderNavLinks links={LINKS} onNavigate={() => setMenuOpen(false)} />
        </nav>
      )}
    </header>
  );
}
