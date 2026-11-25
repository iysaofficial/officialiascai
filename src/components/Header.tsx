import Link from "next/link";
import { Mark } from "./Mark";
import { MobileNav } from "./MobileNav";

export type Lembaga = { singkatan: string; nama: string; logo: string | null } | null | undefined;

export const NAV = [
  { href: "/#about", label: "About" },
  { href: "/#categories", label: "Categories" },
  { href: "/#timeline", label: "Timeline" },
  { href: "/#contact", label: "Contact" },
];

/**
 * Nav logo = the edition's own logo (`identitas.logo`, Event → Edit → logo in the
 * dashboard). It is the full IASCAI wordmark, so no text name is shown beside it.
 * Without it: the organiser's logo (`identitas.lembaga`), then the IASCAI mark.
 */
export function Header({ year, lembaga, logo }: { year?: string; lembaga?: Lembaga; logo?: string | null }) {
  if (logo) {
    return (
      <header className="header">
        <div className="shell header-row">
          <Link href="/" className="brand" aria-label="IASCAI home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo} alt="IASCAI" className="brand-event-logo" width={2560} height={480} />
            {year && <span className="brand-text with-logo"><small>{year}</small></span>}
          </Link>
          <HeaderNav />
        </div>
      </header>
    );
  }
  return (
    <header className="header">
      <div className="shell header-row">
        <Link href="/" className="brand" aria-label="IASCAI home">
          {lembaga?.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={lembaga.logo} alt={lembaga.nama} className="brand-logo" width={400} height={225} />
          ) : (
            <Mark />
          )}
          <span className={lembaga?.logo ? "brand-text with-logo" : "brand-text"}>
            <strong>IASCAI</strong>
            {year && <small>{year}</small>}
          </span>
        </Link>
        <HeaderNav />
      </div>
    </header>
  );
}

function HeaderNav() {
  return (
    <>
      <nav className="nav" aria-label="Main">
        {NAV.map((n) => <a key={n.href} href={n.href}>{n.label}</a>)}
      </nav>
      <div className="header-cta">
        {/* Shown/hidden live by embed/status.js from the dashboard toggles (no redeploy):
            Guidebook only once published, Register only while registration is open. */}
        <button type="button" className="btn btn-line btn-sm hide-sm" data-iysa-panduan="IASCAI" data-iysa-tampil="guidebook">Guidebook</button>
        <Link href="/registration" className="btn btn-primary btn-sm" data-iysa-tampil="dibuka">Register</Link>
        <Link href="/registration" className="btn btn-line btn-sm" data-iysa-tampil="ditutup">Registration opens soon</Link>
        <MobileNav items={NAV} />
      </div>
    </>
  );
}
