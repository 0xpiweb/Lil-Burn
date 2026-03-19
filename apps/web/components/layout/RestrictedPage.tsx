import { LayoutPage } from "@/components/layout/LayoutPage";
import { LayoutPageHero } from "@/components/layout/LayoutPageHero";
import { GradientText } from "@/components/ui/GradientText";
import type { ReactNode } from "react";

export function RestrictedPage({
  introduction,
  action,
}: {
  introduction: string;
  action: ReactNode;
}) {
  return (
    <LayoutPage className="items-center justify-center">
      <LayoutPageHero
        title={
          <>
            <GradientText>Restricted</GradientText> Area
          </>
        }
        introduction={[introduction]}
      />

      {action}
    </LayoutPage>
  );
}
