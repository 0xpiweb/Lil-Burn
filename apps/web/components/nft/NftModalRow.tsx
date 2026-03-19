export function NftModalRow({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div>
      <dt className="mb-0.5 text-xs tracking-wide text-zinc-500 uppercase">
        {label}
      </dt>

      <dd className="text-zinc-300">
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-zinc-100"
          >
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}
