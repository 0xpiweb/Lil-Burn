"use client";

import { useTransactionUrl } from "@/hooks/useTransactionUrl";
import { formatHex } from "@/lib/format";
import { twJoin } from "@/lib/tw";
import { type Toast as ToastType } from "@/types/Toast";

export function Toast({
  toast: { id, status, message, transactionHash },
  onRemove,
}: {
  toast: ToastType;
  onRemove: (id: string) => void;
}) {
  const transactionUrl = useTransactionUrl();

  const canBeRemoved = status === "success" || status === "error";

  const borderColor = {
    submitted: "border-amber-600/40",
    success: "border-green-700/50",
    error: "border-red-700/60",
  }[status];

  return (
    <div
      className={twJoin(
        "pointer-events-auto flex h-12 items-center gap-2 rounded-sm border bg-background px-4 text-sm text-zinc-300",
        borderColor,
        canBeRemoved && "cursor-pointer",
      )}
      onClick={canBeRemoved ? () => onRemove(id) : undefined}
    >
      <span className="flex-1">{message}</span>

      {transactionHash && (status === "submitted" || status === "success") && (
        <a
          href={transactionUrl(transactionHash)}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 underline hover:text-zinc-100"
          onClick={(event) => event.stopPropagation()}
        >
          {formatHex(transactionHash)}
        </a>
      )}
    </div>
  );
}
