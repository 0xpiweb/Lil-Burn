"use client";

import { NftModal } from "@/components/nft/NftModal";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  createContext,
  type ReactNode,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const NftModalContext = createContext<{
  openNftModal: (tokenId: number) => void;
} | null>(null);

export function NftModalProvider({ children }: { children: ReactNode }) {
  const [tokenId, setTokenId] = useState<number | null>(null);

  const router = useRouter();

  const pathname = usePathname();

  const openNftModal = useCallback(
    (tokenId: number) => {
      setTokenId(tokenId);

      const params = new URLSearchParams(window.location.search);
      params.set("nft", String(tokenId));

      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname],
  );

  const closeNftModal = useCallback(() => {
    setTokenId(null);

    const params = new URLSearchParams(window.location.search);
    params.delete("nft");

    const search = params.toString();

    router.replace(search ? `${pathname}?${search}` : pathname, {
      scroll: false,
    });
  }, [router, pathname]);

  return (
    <NftModalContext.Provider value={{ openNftModal }}>
      {children}

      <Suspense>
        <UrlSync />
      </Suspense>

      {tokenId != null && <NftModal id={tokenId} onClose={closeNftModal} />}
    </NftModalContext.Provider>
  );
}

function UrlSync() {
  const searchParams = useSearchParams();

  const { openNftModal } = useNftModal();

  useEffect(() => {
    const nftId = searchParams.get("nft");

    if (nftId != null) {
      openNftModal(Number(nftId));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}

export function useNftModal() {
  const ctx = useContext(NftModalContext);

  if (ctx == null) {
    throw new Error("useNftModal must be used within NftModalProvider");
  }

  return ctx;
}
