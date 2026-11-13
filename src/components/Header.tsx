import Link from "next/link";
import { Mark } from "./Mark";

const NAV = [
  { href: "/#about", label: "About" },
  { href: "/#categories", label: "Categories" },
  { href: "/#timeline", label: "Timeline" },
  { href: "/#fees", label: "Fees" },
  { href: "/#awards", label: "Awards" },
  { href: "/#contact", label: "Contact" },
];

export function Header({ year }: { year?: string }) {
  return (
    <header className="header">
      <div className="shell header-row">
        <Link href="/" className="brand" aria-label="IASCAI home">
          <Mark />
          <span>
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
