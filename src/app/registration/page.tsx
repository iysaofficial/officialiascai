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
      <Header year={id?.tahun} lembaga={id?.lembaga} />
      <main>
        <section className="page-head">
          <div className="shell">
            <p className="eyebrow eyebrow-light">Registration</p>
            <h1>
              {state === "open" ? `Registration for ${title} is open`
                : state === "closed" ? `Registration for ${title} has closed`
                : `Registration for ${title}`}
            </h1>
            {deadline && state !== "closed" && (
              <p className="hero-lead">Registration deadline: <strong>{formatDate(deadline)}</strong></p>
            )}
          </div>
        </section>

        <section className="section">
          <div className="shell narrow">
            {state === "open" ? (
              <RegistrationForm series="iascai" />
            ) : (
              <div className="notice">
                <p>
                  {state === "closed"
                    ? "Registration for this edition is closed. Follow @iysa_official on Instagram for the next edition."
                    : state === "soon"
                      ? `Registration has not opened yet${id?.pendaftaran_buka ? ` — it opens on ${formatDate(id.pendaftaran_buka)}` : ""}. Please check back soon.`
                      : "Registration information is not available right now. Please try again shortly."}
                </p>
                <div className="notice-btns">
                  <button type="button" className="btn btn-ghost" data-iysa-panduan="IASCAI" data-iysa-panduan-jenis="tnc">
                    Terms &amp; Conditions
                  </button>
                  <Link href="/#fees" className="btn btn-primary">See fees &amp; packages</Link>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer organizer={id?.lembaga?.nama} />
    </>
  );
}
