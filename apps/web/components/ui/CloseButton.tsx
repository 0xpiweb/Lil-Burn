export function CloseButton({ onClose }: { onClose: () => void }) {
  return (
    <button
      onClick={onClose}
      className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded text-zinc-400 hover:text-zinc-100 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none"
      aria-label="Close"
    >
      ✕
    </button>
  );
}
