import { ROW_HEIGHT } from "@/components/war-chest/WarChestLeaderboard";

export function WarChestLeaderboardRowSkeleton() {
  return (
    <div
      className="flex items-center border-b border-zinc-800/50 px-5 last:border-b-0"
      style={{ height: ROW_HEIGHT }}
    >
      <div className="h-4 w-full animate-pulse rounded-sm bg-zinc-800" />
    </div>
  );
}
