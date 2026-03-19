"use client";

import { type Toast as ToastType } from "@/types/Toast";
import { Toast } from "./Toast";

export function ToastBanner({
  toasts,
  onRemove,
}: {
  toasts: ToastType[];
  onRemove: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-10000 flex -translate-x-1/2 flex-col items-center gap-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}
