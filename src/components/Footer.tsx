import { NAV, type Lembaga } from "./Header";

export const CONTACT = {
  email: "youngscientist.iysa@gmail.com",
  whatsapp: { number: "6288213248890", display: "+62 882 1324 8890" },
  instagram: "https://www.instagram.com/iysa_official/",
  youtube: "https://www.youtube.com/@IYSAOfficial",
  site: "https://iysa.or.id",
};

export function Footer({ organizer, lembaga }: { organizer?: string; lembaga?: Lembaga }) {
  return (
    <footer className="footer">
      <div className="shell footer-grid">
        <div>
          <p className="footer-name">International Applied Science Competition on Artificial Intelligence</p>
          <p className="footer-org">
            Organised by{" "}
            <a href={CONTACT.site} target="_blank" rel="noreferrer">{organizer ?? "Indonesian Young Scientist Association"}</a>
          </p>
          {lembaga?.logo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={lembaga.logo} alt={lembaga.nama} className="footer-logo" width={400} height={225} />
          )}
        </div>
        <nav className="footer-col" aria-label="Footer">
          <p className="label">Pages</p>
          {NAV.map((n) => <a key={n.href} href={n.href}>{n.label}</a>)}
          <a href="/registration">Registration</a>
        </nav>
        <div className="footer-col">
          <p className="label">Contact</p>
          <a href={`https://wa.me/${CONTACT.whatsapp.number}`} target="_blank" rel="noreferrer">WhatsApp {CONTACT.whatsapp.display}</a>
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
          <a href={CONTACT.instagram} target="_blank" rel="noreferrer">Instagram</a>
          <a href={CONTACT.youtube} target="_blank" rel="noreferrer">YouTube</a>
        </div>
      </div>
      <div className="shell">
        <p className="footer-bottom">© {new Date().getFullYear()} Indonesian Young Scientist Association</p>
      </div>
    </footer>
  );
}
