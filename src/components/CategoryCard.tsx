"use client";

import { useState, type ReactNode } from "react";

/**
 * One row of the category index: number, icon (from the dashboard), name and a
 * two-line description; long descriptions expand in place.
 */
export function CategoryCard({ icon, num, title, text }: { icon: ReactNode; num: string; title: string; text: string }) {
  const [open, setOpen] = useState(false);
  const long = text.length > 140;
  const isi = (
    <>
      <span className="cat-num">{num}</span>
      {icon}
      <span>
        <span className="cat-title" role="heading" aria-level={3}>{title}</span>
        {text && <span className="cat-text">{text}</span>}
      </span>
      {long ? <span className="cat-plus" aria-hidden="true">+</span> : <span />}
    </>
  );
  return (
    <li className={`cat${long ? " cat-toggle" : ""}${open ? " open" : ""}`}>
      {long ? (
        <button type="button" className="cat-row" aria-expanded={open} onClick={() => setOpen((o) => !o)}>{isi}</button>
      ) : (
        <div className="cat-row">{isi}</div>
      )}
    </li>
  );
}
