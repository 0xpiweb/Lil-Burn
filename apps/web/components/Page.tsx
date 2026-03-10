"use client";

import { twMerge } from "@/lib/tw";
import { type ComponentPropsWithoutRef } from "react";

export function Page({
  className,
  ...props
}: ComponentPropsWithoutRef<"main">) {
  return (
    <main
      className={twMerge(
        "mx-auto flex w-full max-w-4xl grow flex-col items-center gap-10 px-4 pt-12 pb-20 md:px-8 md:pt-16",
        className,
      )}
      {...props}
    />
  );
}
