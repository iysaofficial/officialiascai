import * as Lucide from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * Category icon from the dashboard (`event_categories.icon`, a Lucide icon name
 * such as "FlaskConical"). Server component: only the chosen SVG reaches the page.
 *
 * Looked up in `icons` (canonical names) and then in the named exports, which
 * also carry the older alias names the dashboard stores — e.g. "LineChart" and
 * "Music" are aliases in current lucide-react and are absent from `icons`.
 * Unknown or empty names fall back to a neutral icon.
 */
const byName = (name: string): LucideIcon | undefined =>
  (Lucide.icons as Record<string, LucideIcon>)[name] ??
  ((Lucide as unknown as Record<string, LucideIcon>)[name]);

export function CategoryIcon({ name }: { name?: string | null }) {
  const Icon = (name && byName(name)) || Lucide.Sparkles;
  return (
    <span className="card-icon" aria-hidden="true">
      <Icon size={22} strokeWidth={1.8} />
    </span>
  );
}
