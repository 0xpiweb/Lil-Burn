"use client";

import { DiscordIcon, GitbookIcon, XIcon } from "@/components/icons";
import { SocialLink } from "@/components/SocialLink";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-zinc-800/50">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-6 py-5 sm:flex-row">
        <p className="text-center text-xs text-zinc-500">
          Copyright Lil Burn © 2026 - All right reserved
        </p>

        <div className="flex items-center gap-5">
          <SocialLink
            href="https://lil-ecosystem.gitbook.io/lil-burn"
            label="Gitbook"
            icon={GitbookIcon}
          />

          <SocialLink
            href="https://discord.gg/uKSF7R2dJd"
            label="Discord"
            icon={DiscordIcon}
          />

          <SocialLink href="https://x.com/LilCoqNft" label="X" icon={XIcon} />
        </div>
      </div>
    </footer>
  );
}
