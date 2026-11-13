import { Mark } from "./Mark";

export const CONTACT = {
  email: "youngscientist.iysa@gmail.com",
  whatsapp: { number: "6288213248890", display: "+62 882 1324 8890" },
  instagram: "https://www.instagram.com/iysa_official/",
  youtube: "https://www.youtube.com/@IYSAOfficial",
  site: "https://iysa.or.id",
};

export function Footer({ organizer }: { organizer?: string }) {
  return (
    <footer className="footer">
      <div className="shell footer-row">
        <div className="footer-brand">
          <Mark size={28} />
          <div>
            <strong>IASCAI</strong>
            <p>International Applied Science Competition on Artificial Intelligence</p>
          </div>
        </div>
        <p className="footer-org">
          Organised by <a href={CONTACT.site} target="_blank" rel="noreferrer">{organizer ?? "Indonesian Young Scientist Association"}</a>
        </p>
        <p className="footer-copy">© {new Date().getFullYear()} IYSA. All rights reserved.</p>
      </div>
    </footer>
  );
}
