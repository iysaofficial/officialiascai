"use client";

import { useState, type ReactNode } from "react";

/**
 * Category card: description clamped to three lines; clicking the card (or the
 * toggle) shows the full text. Short descriptions get no toggle.
 */
export function CategoryCard({ icon, num, title, text }: { icon: ReactNode; num: string; title: string; text: string }) {
  const [open, setOpen] = useState(false);
  const long = text.length > 140;
  return (
    <li
      className={`card${long ? " card-toggle" : ""}${open ? " open" : ""}`}
      onClick={long ? () => setOpen((o) => !o) : undefined}
    >
      <div className="card-top">
        {icon}
        <span className="mono-num">{num}</span>
      </div>
      <h3>{title}</h3>
      {text && <p className="card-text">{text}</p>}
      {long && (
        <button
          type="button"
          className="card-more"
          aria-expanded={open}
          onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
        >
          {open ? "Show less" : "Read more"}
        </button>
      )}
    </li>
  );
}
