import { IconFire } from "@/components/icons/IconFire";
import { IconSkull } from "@/components/icons/IconSkull";

export function NftVariantIcon({
  isBurned,
  isCursed,
}: {
  isBurned: boolean;
  isCursed: boolean;
}) {
  if (!isBurned && !isCursed) {
    return null;
  }

  return (
    <div className="absolute top-2 right-2 flex gap-1">
      {isCursed && (
        <div className="rounded-full bg-black/50 p-2">
          <IconSkull className="size-5 text-orange-400" />
        </div>
      )}

      {isBurned && (
        <div className="rounded-full bg-black/50 p-2">
          <IconFire className="size-5 text-red-400" />
        </div>
      )}
    </div>
  );
}
