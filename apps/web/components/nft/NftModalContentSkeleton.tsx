import { CloseButton } from "@/components/ui/CloseButton";
import { GrungeCard } from "@/components/ui/GrungeCard";

export function NftModalContentSkeleton({ onClose }: { onClose: () => void }) {
  return (
    <GrungeCard className="w-full max-w-3xl overflow-hidden rounded shadow-2xl">
      <div className="flex flex-col sm:flex-row">
        <div className="aspect-square w-full shrink-0 animate-pulse bg-zinc-800 sm:w-96 md:w-125" />

        <div className="flex grow flex-col gap-4 p-5">
          <div className="flex items-start justify-between gap-2">
            <div className="h-7 w-24 animate-pulse rounded bg-zinc-800" />

            <CloseButton onClose={onClose} />
          </div>

          <div className="flex flex-col gap-3">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="h-10 animate-pulse rounded bg-zinc-800" />
            ))}
          </div>
        </div>
      </div>
    </GrungeCard>
  );
}
