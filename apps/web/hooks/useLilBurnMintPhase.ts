"use client";

import { MintPhase } from "@/types/MintPhase";
import { useEffect, useState } from "react";

function getMintPhase(
  holderStart: number,
  whitelistStart: number,
  publicStart: number,
) {
  const now = Math.floor(Date.now() / 1000);

  if (publicStart !== 0 && now >= publicStart) {
    return MintPhase.Public;
  } else if (whitelistStart !== 0 && now >= whitelistStart) {
    return MintPhase.Whitelist;
  } else if (holderStart !== 0 && now >= holderStart) {
    return MintPhase.Holder;
  }

  return MintPhase.Closed;
}

export function useLilBurnMintPhase({
  holderStart = 0,
  whitelistStart = 0,
  publicStart = 0,
}: {
  holderStart?: number;
  whitelistStart?: number;
  publicStart?: number;
}) {
  const [mintPhase, setMintPhase] = useState(() =>
    getMintPhase(holderStart, whitelistStart, publicStart),
  );

  useEffect(() => {
    setMintPhase(getMintPhase(holderStart, whitelistStart, publicStart)); // eslint-disable-line react-hooks/set-state-in-effect

    const handle = setInterval(
      () =>
        setMintPhase(getMintPhase(holderStart, whitelistStart, publicStart)),
      1000,
    );

    return () => clearInterval(handle);
  }, [holderStart, whitelistStart, publicStart]);

  return mintPhase;
}
