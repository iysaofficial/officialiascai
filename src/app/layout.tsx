import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const font = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font" });

export const metadata: Metadata = {
  title: { default: "IASCAI — International Applied Science Competition on Artificial Intelligence", template: "%s · IASCAI" },
  description:
    "IASCAI is an international online competition by the Indonesian Young Scientist Association for students and young researchers presenting applied science projects built with artificial intelligence.",
  icons: { icon: "/icon.svg" },
  openGraph: { type: "website", siteName: "IASCAI" },
};

export const viewport: Viewport = { themeColor: "#0b1230" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={font.variable}>
      <body>
        {children}
        {/* IYSA dashboard embeds. Plain <script> on purpose: the loaders read their
            own attributes through document.currentScript. */}
        <script src="https://api-dashboard.iysa.or.id/embed/kurasi.js" data-iysa-kurasi="iascai" defer />
        <script src="https://api-dashboard.iysa.or.id/embed/panduan.js" defer />
      </body>
    </html>
  );
}
