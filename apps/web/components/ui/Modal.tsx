"use client";

import { useEffect } from "react";

export function Modal({
  onClose,
  children,
}: {
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    function handleKey({ key }: KeyboardEvent) {
      if (key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKey);

    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm md:px-8"
      onClick={({ target, currentTarget }) => {
        if (target === currentTarget) {
          onClose();
        }
      }}
    >
      {children}
    </div>
  );
}
