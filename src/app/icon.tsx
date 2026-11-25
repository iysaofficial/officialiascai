import { ImageResponse } from "next/og";
import { getSections } from "@/lib/api";

/**
 * Browser-tab icon = the edition logo uploaded in the dashboard (Event → Edit →
 * logo), drawn on a white square so the dark teal wordmark stays visible on dark
 * tabs. The wordmark is wide (≈5.3 : 1), so it spans the full width of the square.
 * Falls back to the static mark (public/icon.svg) when the dashboard has no logo.
 */
export const size = { width: 64, height: 64 };
export const contentType = "image/png";
export const revalidate = 300;

export default async function Icon() {
  const s = await getSections(["identitas"]);
  const logo = s?.identitas?.logo;
  if (!logo) {
    const svg = encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="#070b1f"/><text x="32" y="41" font-family="monospace" font-size="24" font-weight="700" fill="#fff" text-anchor="middle">AI</text></svg>',
    );
    // eslint-disable-next-line @next/next/no-img-element
    return new ImageResponse(<img src={`data:image/svg+xml,${svg}`} width={64} height={64} alt="" />, size);
  }
  return new ImageResponse(
    (
      <div style={{ width: 64, height: 64, background: "#ffffff", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo} width={64} height={12} alt="" />
      </div>
    ),
    size,
  );
}
