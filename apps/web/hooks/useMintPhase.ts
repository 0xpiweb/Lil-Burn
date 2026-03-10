"use client";

import { MintPhase } from "@/types/MintPhase";
import { useEffect, useState } from "react";

function getMintPhase(
  holderStart: bigint,
  whitelistStart: bigint,
  publicStart: bigint,
) {
  const now = Math.floor(Date.now() / 1000);

  if (publicStart !== BigInt(0) && now >= publicStart) {
    return MintPhase.Public;
  } else if (whitelistStart !== BigInt(0) && now >= whitelistStart) {
    return MintPhase.Whitelist;
  } else if (holderStart !== BigInt(0) && now >= holderStart) {
    return MintPhase.Holder;
  }

  return MintPhase.Closed;
}

export function useMintPhase({
  holderStart,
  whitelistStart,
  publicStart,
}: {
  holderStart: bigint;
  whitelistStart: bigint;
  publicStart: bigint;
}) {
  const [mintPhase, setMintPhase] = useState(() =>
    getMintPhase(holderStart, whitelistStart, publicStart),
  );

  useEffect(() => {
    const handle = setInterval(
      () =>
        setMintPhase(getMintPhase(holderStart, whitelistStart, publicStart)),
      1000,
    );

    return () => clearInterval(handle);
  }, [holderStart, whitelistStart, publicStart]);

  return mintPhase;
}
