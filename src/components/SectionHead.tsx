/** Section header: numbered mono label, display title, optional lead. */
export function SectionHead({ num, label, title, lead }: { num: string; label: string; title: string; lead?: string }) {
  return (
    <header className="sec-head">
      <p className="label"><span>{num}</span>{label}</p>
      <h2>{title}</h2>
      {lead && <p className="sec-lead">{lead}</p>}
    </header>
  );
}
