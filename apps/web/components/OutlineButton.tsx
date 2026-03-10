"use client";

import { FireIcon } from "@/components/icons";
import { twMerge } from "@/lib/tw";
import { ComponentPropsWithoutRef } from "react";

export function OutlineButton({
  className,
  children,
  isPending = false,
  ...props
}: ComponentPropsWithoutRef<"button"> & { isPending?: boolean }) {
  return (
    <button
      className={twMerge(
        "relative items-center justify-center rounded-sm border border-zinc-700 px-4 py-2 not-disabled:cursor-pointer",
        "text-sm font-medium text-zinc-100",
        "not-disabled:hover:bg-zinc-800 disabled:opacity-50",
        "focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 focus-visible:outline-none",
        className,
      )}
      disabled={isPending || props.disabled}
      {...props}
    >
      <span className={isPending ? "invisible" : undefined}>{children}</span>
      {isPending && (
        <FireIcon className="absolute inset-0 m-auto size-4 animate-flame" />
      )}
    </button>
  );
}
