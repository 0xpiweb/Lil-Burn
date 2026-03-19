"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function usePage() {
  const searchParams = useSearchParams();

  const router = useRouter();

  const page = Number(searchParams.get("page") ?? "1");

  const setPage = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());

      if (page === 1) {
        params.delete("page");
      } else {
        params.set("page", String(page));
      }

      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  return { page, setPage };
}
