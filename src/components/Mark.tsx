/** IASCAI mark — a small neural network. No logo is set in the dashboard yet. */
export function Mark({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <defs>
        <linearGradient id="mk" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--accent)" />
          <stop offset="1" stopColor="var(--accent-2)" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="10" fill="url(#mk)" />
      <g stroke="#fff" strokeOpacity=".75" strokeWidth="1.4">
        <path d="M10 12 L20 20 L10 28 M20 20 L30 13 M20 20 L30 27 M10 12 L30 13 M10 28 L30 27" fill="none" />
      </g>
      <g fill="#fff">
        <circle cx="10" cy="12" r="3" /><circle cx="10" cy="28" r="3" />
        <circle cx="20" cy="20" r="3.6" /><circle cx="30" cy="13" r="3" /><circle cx="30" cy="27" r="3" />
      </g>
    </svg>
  );
}
