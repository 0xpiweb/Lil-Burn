import { IconSearch } from "@/components/icons/IconSearch";
import type { ReactNode } from "react";

export function FilterBar({
  search,
  onSearchChange,
  children,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  children?: ReactNode;
}) {
  return (
    <div
      className={`flex items-center gap-2 rounded-sm border border-zinc-700/60 bg-zinc-900/60 px-3 py-2`}
    >
      <div className="flex flex-1 items-center gap-2 border-r border-zinc-700/60 pr-3">
        <IconSearch className="size-4 shrink-0 text-zinc-500" />

        <input
          type="number"
          value={search}
          onChange={({ target: { value } }) => onSearchChange(value)}
          placeholder="Search by ID"
          className="w-full [appearance:textfield] bg-transparent text-sm text-zinc-300 outline-none placeholder:text-zinc-600 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
      </div>
      {children}
    </div>
  );
}
