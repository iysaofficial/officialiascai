/** IASCAI mark used only when the dashboard has no organiser logo: a plain ink square with the initials. */
export function Mark({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <rect width="40" height="40" fill="var(--ink)" />
      <text x="20" y="25.5" textAnchor="middle" fontFamily="var(--font-mono), monospace" fontSize="13" fontWeight="600" fill="var(--paper)">AI</text>
    </svg>
  );
}
