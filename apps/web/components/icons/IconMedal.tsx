export function IconMedal({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M4 1L8 1L13 10L9 10Z M16 1L20 1L15 10L11 10Z M6.5 16a5.5 5.5 0 1 0 11 0a5.5 5.5 0 1 0-11 0Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
