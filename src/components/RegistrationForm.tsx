"use client";

import Script from "next/script";

/**
 * The registration form is served by the IYSA dashboard (daftar.js): one form,
 * maintained in one place, writing teams, members, supervisors and invoices
 * directly into the dashboard. This site only provides the container.
 */
export function RegistrationForm({ series }: { series: string }) {
  return (
    <>
      <div data-iysa-daftar={series} data-iysa-bahasa="en" className="form-wrap" />
      <Script
        src="https://api-dashboard.iysa.or.id/embed/daftar.js"
        strategy="afterInteractive"
        onReady={() => (window as unknown as { IysaDaftar?: { pasang?: () => void } }).IysaDaftar?.pasang?.()}
      />
    </>
  );
}
