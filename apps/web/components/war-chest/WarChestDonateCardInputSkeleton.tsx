export function WarChestDonateCardInputSkeleton() {
  return (
    <>
      <div className="flex h-26 flex-col gap-2">
        <div className="h-3.5 w-24 animate-pulse rounded bg-zinc-800/60" />
        <div className="h-10 w-full animate-pulse rounded bg-zinc-800/80" />
        <div className="h-6 w-48 animate-pulse rounded bg-zinc-800/60" />
      </div>

      <div className="h-15 w-full animate-pulse rounded bg-zinc-700" />
    </>
  );
}
