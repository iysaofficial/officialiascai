import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { RegistrationForm } from "@/components/RegistrationForm";
import { getSections, registrationState, formatDate } from "@/lib/api";

export const revalidate = 300;
export const metadata: Metadata = { title: "Registration" };

export default async function Registration() {
  const s = await getSections(["identitas", "jadwal_kegiatan"]);
  const id = s?.identitas;
  const state = registrationState(id);
  const deadline = s?.jadwal_kegiatan?.find((m) => /registration/i.test(m.milestone))?.tanggal || id?.pendaftaran_tutup;
  const title = id ? `${id.akronim} ${id.tahun}` : "IASCAI";

  return (
    <>
      <Header year={id?.tahun} lembaga={id?.lembaga} logo={id?.logo} />
      <main>
        <section className="page-head">
          <div className="shell">
            <p className="label">Registration</p>
            {/* Status decided live in the browser (embed/status.js), not at build time,
                so flipping the dashboard toggle shows here immediately. */}
            <h1>
              <span data-iysa-tampil="dibuka">Registration for {title} is open</span>
              <span data-iysa-tampil="ditutup">Registration for {title}</span>
            </h1>
            {deadline && state !== "closed" && (
              <p className="hero-lead">Registration deadline: <strong>{formatDate(deadline)}</strong></p>
            )}
          </div>
        </section>

        <section className="section">
          <div className="shell narrow">
            {/* Same pattern as the other invention sites (OSPC, WECC): the dashboard form
                (daftar.js) is always mounted and itself shows "registration is not open"
                while the toggle is off, so the page never depends on a cached build. */}
            <RegistrationForm series="iascai" />
            <div className="notice-btns">
              <button type="button" className="btn btn-line" data-iysa-panduan="IASCAI" data-iysa-tampil="guidebook">
                Guidebook
              </button>
              <button type="button" className="btn btn-line" data-iysa-panduan="IASCAI" data-iysa-panduan-jenis="tnc">
                Terms &amp; Conditions
              </button>
              <Link href="/#categories" className="btn btn-line">See the categories</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer organizer={id?.lembaga?.nama} lembaga={id?.lembaga} />
    </>
  );
}
