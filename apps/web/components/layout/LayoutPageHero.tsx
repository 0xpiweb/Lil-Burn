import { LayoutPageTitle } from "@/components/layout/LayoutPageTitle";
import type { ReactNode } from "react";

export function LayoutPageHero({
  title,
  introduction,
  action,
}: {
  title: ReactNode;
  introduction: ReactNode[];
  action?: ReactNode;
}) {
  return (
    <div className="flex w-full flex-col items-center gap-3 text-center">
      <LayoutPageTitle>{title}</LayoutPageTitle>

      {introduction.length > 0 && (
        <div className="flex max-w-2xl flex-col gap-4 text-center">
          {introduction.map((text, i) => (
            <p key={i} className="text-sm leading-relaxed text-zinc-400">
              {text}
            </p>
          ))}
        </div>
      )}

      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
