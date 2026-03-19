import { IconChevronLeft } from "@/components/icons/IconChevronLeft";
import { IconChevronRight } from "@/components/icons/IconChevronRight";
import { PaginationButton } from "@/components/ui/PaginationButton";

export function CompactPagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-2">
      <PaginationButton
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        <IconChevronLeft className="size-4" />
      </PaginationButton>

      <span className="font-mono text-xs text-zinc-500">
        {page} / {totalPages}
      </span>

      <PaginationButton
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
      >
        <IconChevronRight className="size-4" />
      </PaginationButton>
    </div>
  );
}
