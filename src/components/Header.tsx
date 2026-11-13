import Link from "next/link";
import { Mark } from "./Mark";

export type Lembaga = { singkatan: string; nama: string; logo: string | null } | null | undefined;

const NAV = [
  { href: "/#about", label: "About" },
  { href: "/#categories", label: "Categories" },
  { href: "/#timeline", label: "Timeline" },
  { href: "/#fees", label: "Fees" },
  { href: "/#awards", label: "Awards" },
  { href: "/#contact", label: "Contact" },
];

/**
 * Nav logo = the organiser's default logo (lembaga of the edition, falling back to
 * the series' lembaga — resolved by the dashboard as `identitas.lembaga`).
 * When the dashboard has no logo, the IASCAI mark is used.
 */
export function Header({ year, lembaga }: { year?: string; lembaga?: Lembaga }) {
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
        <nav className="nav" aria-label="Main">
          {NAV.map((n) => <a key={n.href} href={n.href}>{n.label}</a>)}
        </nav>
        <div className="header-cta">
          <button type="button" className="btn btn-ghost btn-sm" data-iysa-panduan="IASCAI">Guidebook</button>
          <Link href="/registration" className="btn btn-primary btn-sm">Register</Link>
        </div>
      </div>
    </header>
  );
}
