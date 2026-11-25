import type { Metadata, Viewport } from "next";
import { Newsreader, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

/* Type system: Newsreader (serif) for titles and figures, IBM Plex Sans for
   reading text, IBM Plex Mono for labels, dates and fees. */
const display = Newsreader({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-display" });
const body = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-body" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: { default: "IASCAI — International Applied Science Competition on Artificial Intelligence", template: "%s · IASCAI" },
  description:
    "IASCAI is an international online competition by the Indonesian Young Scientist Association for students and young researchers presenting applied science projects built with artificial intelligence.",
  openGraph: { type: "website", siteName: "IASCAI" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#070b18" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        {children}
        {/* IYSA dashboard embeds. Plain <script> on purpose: the loaders read their
            own attributes through document.currentScript. */}
        <script src="https://api-dashboard.iysa.or.id/embed/kurasi.js" data-iysa-kurasi="iascai" defer />
        <script src="https://api-dashboard.iysa.or.id/embed/panduan.js" defer />
        <script src="https://api-dashboard.iysa.or.id/embed/status.js" data-iysa-seri="IASCAI" defer />
      </body>
    </html>
  );
}
