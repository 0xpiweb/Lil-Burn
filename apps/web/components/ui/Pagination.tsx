"use client";

import { IconChevronLeft } from "@/components/icons/IconChevronLeft";
import { IconChevronRight } from "@/components/icons/IconChevronRight";
import { PaginationButton } from "@/components/ui/PaginationButton";
import { PaginationEllipsis } from "@/components/ui/PaginationEllipsis";
import { twJoin } from "@/lib/tw";
import { useMemo } from "react";

const MAX_VISIBLE = 7;
const HEIGHT = 36;

export function Pagination({
  page,
  totalPages,
  onPageChange,
  isFetching = false,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isFetching?: boolean;
}) {
  const slots = useMemo((): (number | "…")[] => {
    if (totalPages <= MAX_VISIBLE) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (page <= 4) {
      return [1, 2, 3, 4, 5, "…", totalPages];
    }

    if (page >= totalPages - 3) {
      return [
        1,
        "…",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [1, "…", page - 1, page, page + 1, "…", totalPages];
  }, [page, totalPages]);

  const isFirst = page === 1;

  const isLast = page === totalPages;

  return totalPages <= 1 ? (
    <div style={{ height: HEIGHT }} />
  ) : (
    <div
      className={twJoin(
        "flex items-center justify-center gap-1",
        isFetching && "pointer-events-none opacity-60",
      )}
      style={{ height: HEIGHT }}
    >
      <PaginationButton
        onClick={() => onPageChange(page - 1)}
        disabled={isFirst}
        aria-label="Previous page"
      >
        <IconChevronLeft className="size-4" />
      </PaginationButton>

      {slots.map((slot, i) =>
        slot === "…" ? (
          <PaginationEllipsis key={`ellipsis-${i}`} />
        ) : (
          <PaginationButton
            key={slot}
            onClick={() => onPageChange(slot)}
            active={slot === page}
            aria-current={slot === page ? "page" : undefined}
          >
            {slot}
          </PaginationButton>
        ),
      )}

      <PaginationButton
        onClick={() => onPageChange(page + 1)}
        disabled={isLast}
        aria-label="Next page"
      >
        <IconChevronRight className="size-4" />
      </PaginationButton>
    </div>
  );
}
