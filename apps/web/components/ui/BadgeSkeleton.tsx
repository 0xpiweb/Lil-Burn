import { HEIGHT } from "./Badge";

export function BadgeSkeleton({ width }: { width: number }) {
  return (
    <span
      className="block h-6.5 animate-pulse rounded-sm bg-zinc-700/60"
      style={{ width, height: HEIGHT }}
    />
  );
}
