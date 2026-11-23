/** Section header: small mono label, serif title, optional note. Sits in the left column. */
export function SectionHead({ label, title, lead }: { label: string; title: string; lead?: string }) {
  return (
    <header className="sec-head">
      <p className="label">{label}</p>
      <h2>{title}</h2>
      {lead && <p className="sec-lead">{lead}</p>}
    </header>
  );
}
