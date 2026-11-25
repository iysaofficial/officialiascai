"use client";

import { useRef } from "react";
import { Menu } from "lucide-react";

/** Mobile menu on <details>; closes itself when a link is chosen. */
export function MobileNav({ items }: { items: { href: string; label: string }[] }) {
  const ref = useRef<HTMLDetailsElement>(null);
  const close = () => ref.current?.removeAttribute("open");
  return (
    <details className="mnav" ref={ref}>
      <summary aria-label="Menu"><Menu size={22} /></summary>
      <div className="mnav-panel">
        {items.map((n) => <a key={n.href} href={n.href} onClick={close}>{n.label}</a>)}
        <button type="button" data-iysa-panduan="IASCAI" data-iysa-tampil="guidebook" onClick={close}>Guidebook</button>
        <button type="button" data-iysa-panduan="IASCAI" data-iysa-panduan-jenis="tnc" onClick={close}>Terms &amp; Conditions</button>
      </div>
    </details>
  );
}
