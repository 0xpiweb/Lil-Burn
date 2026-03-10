"use client";

import { ReactNode } from "react";

export function StepperButton({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void;
  disabled: boolean;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex size-10 items-center justify-center rounded-sm border border-zinc-700 bg-zinc-800 text-lg text-zinc-300 not-disabled:cursor-pointer not-disabled:hover:border-zinc-500 not-disabled:hover:text-white focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 focus-visible:outline-none disabled:opacity-40"
    >
      {children}
    </button>
  );
}
