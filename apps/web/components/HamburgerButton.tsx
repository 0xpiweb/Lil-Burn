"use client";

export function HamburgerButton({
  open,
  onClick,
}: {
  open: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className="flex size-9 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-sm border border-zinc-700 bg-zinc-800/60 text-zinc-400 focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 focus-visible:outline-none md:hidden"
      onClick={onClick}
      aria-label="Toggle menu"
    >
      {open ? (
        <>
          <span className="block h-0.5 w-5 translate-y-1.75 rotate-45 bg-current" />
          <span className="block h-0.5 w-5 bg-current opacity-0" />
          <span className="block h-0.5 w-5 -translate-y-1.75 -rotate-45 bg-current" />
        </>
      ) : (
        <>
          <span className="block h-0.5 w-5 bg-current" />
          <span className="block h-0.5 w-5 bg-current" />
          <span className="block h-0.5 w-5 bg-current" />
        </>
      )}
    </button>
  );
}
