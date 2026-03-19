import { IconDiscord } from "@/components/icons/IconDiscord";
import { IconGitbook } from "@/components/icons/IconGitbook";
import { IconX } from "@/components/icons/IconX";
import { SocialLink } from "@/components/ui/SocialLink";

export function LayoutFooter() {
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
            icon={IconGitbook}
          />

          <SocialLink
            href="https://discord.gg/uKSF7R2dJd"
            label="Discord"
            icon={IconDiscord}
          />

          <SocialLink href="https://x.com/LilCoqNft" label="X" icon={IconX} />
        </div>
      </div>
    </footer>
  );
}
