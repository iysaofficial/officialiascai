import { icons, type LucideIcon } from "lucide-react";

/**
 * Category icon from the dashboard (`event_categories.icon`, a Lucide icon name
 * such as "FlaskConical"). Server component: only the chosen SVG reaches the page.
 * Unknown or empty names fall back to a neutral icon.
 */
export function CategoryIcon({ name }: { name?: string | null }) {
  const Icon: LucideIcon = (name && (icons as Record<string, LucideIcon>)[name]) || icons.Sparkles;
  return (
    <span className="card-icon" aria-hidden="true">
      <Icon size={22} strokeWidth={1.8} />
    </span>
  );
}
