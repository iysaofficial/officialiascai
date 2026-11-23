import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { CategoryIcon } from "@/components/CategoryIcon";
import { CategoryCard } from "@/components/CategoryCard";
import { Header } from "@/components/Header";
import { Footer, CONTACT } from "@/components/Footer";
import { SectionHead } from "@/components/SectionHead";
import {
  getSections, formatDate, formatRange, splitList, registrationState,
  JENJANG, type Milestone,
} from "@/lib/api";

export const revalidate = 300;

/** Fallback copy, used only while the dashboard is unreachable. */
const FALLBACK_NAME = "International Applied Science Competition on Artificial Intelligence";

/** Days from today (Jakarta) to an ISO date; negative when past. */
function daysUntil(iso?: string | null): number | null {
  if (!iso) return null;
  const today = new Date(new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" }));
  const d = new Date(iso.slice(0, 10));
  return Math.round((d.getTime() - today.getTime()) / 86_400_000);
}

export default async function Home() {
  const s = await getSections(["identitas", "jadwal_kegiatan", "timeline", "pendaftaran", "guidebook"]);
  const id = s?.identitas;
  const reg = s?.pendaftaran;
  const state = registrationState(id);
  const objectives = splitList(id?.tujuan);
  const about = (id?.latar ?? "").split(/\n+/).map((p) => p.trim()).filter(Boolean);
  const schedule: Milestone[] = (s?.jadwal_kegiatan?.length ? s.jadwal_kegiatan : s?.timeline) ?? [];
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" });
  const nextIdx = schedule.findIndex((m) => m.tanggal >= today);
  const categories = (reg?.kategori ?? []).map((k) => ({ ...k, nama: k.nama.trim() }));
  const packages = reg?.paket ?? [];
  const docs = (s?.guidebook?.berkas ?? []).filter((b) => b.url);
  const hasGuidebook = Boolean(s?.guidebook?.url);
  const online = id?.lokasi?.daring?.replace(/\s+/g, " ").replace(/ Meeting$/i, "").trim();
  const deadline = schedule.find((m) => /registration/i.test(m.milestone))?.tanggal || id?.pendaftaran_tutup || "";
  const leftDays = daysUntil(deadline);
  const team = packages[0] ? `${packages[0].min_anggota}–${packages[0].maks_anggota}` : null;
  const org = id?.lembaga?.nama ?? "Indonesian Young Scientist Association";

  const statusText =
    state === "open" ? "Registration open"
      : state === "closed" ? "Registration closed"
      : "Registration not yet open";

  return (
    <>
      <Header year={id?.tahun} lembaga={id?.lembaga} />

      <main>
        {/* ── Hero: title + spec sheet ── */}
        <section className="hero">
          <div className="shell">
            <div className="hero-top">
              <p className="label">{org}</p>
              <p className="label">{id?.tahun ? `${id.tahun} edition · online` : "Online competition"}</p>
            </div>

            <div className="hero-main">
              <div>
                <h1 className="hero-title">
                  International Applied Science Competition on <em>Artificial Intelligence</em>
                </h1>
                <p className="hero-lead">
                  Students and young researchers present applied science projects built with artificial
                  intelligence, and are judged online by an international panel.
                </p>
                <div className="hero-cta">
                  <Link href="/registration" className="btn btn-primary">
                    {state === "open" ? "Register your team" : "Registration details"} <ArrowRight size={18} />
                  </Link>
                  <button type="button" className="btn btn-line" data-iysa-panduan="IASCAI">
                    {hasGuidebook ? "Read the guidebook" : "Terms & conditions"}
                  </button>
                </div>
              </div>

              <dl className="spec">
                {id?.mulai && (
                  <div className="spec-row"><dt>Competition</dt><dd>{formatRange(id.mulai, id.selesai)}</dd></div>
                )}
                {deadline && (
                  <div className="spec-row"><dt>Register by</dt><dd>{formatDate(deadline)}</dd></div>
                )}
                <div className="spec-row"><dt>Format</dt><dd>Online{online ? `, via ${online}` : ""}</dd></div>
                {reg?.jenjang?.length ? (
                  <div className="spec-row"><dt>Open to</dt><dd>{reg.jenjang.map((j) => JENJANG[j] ?? j).join(", ")}</dd></div>
                ) : null}
                {team && <div className="spec-row"><dt>Team size</dt><dd>{team} members</dd></div>}
                {categories.length > 0 && (
                  <div className="spec-row"><dt>Categories</dt><dd>{categories.length} fields</dd></div>
                )}
                <div className="spec-status">
                  <p className={`status ${state}`}>{statusText}</p>
                  {state !== "closed" && leftDays != null && leftDays >= 0 && (
                    <p className="countdown"><b>{leftDays}</b><span>day{leftDays === 1 ? "" : "s"} until the registration deadline</span></p>
                  )}
                </div>
              </dl>
            </div>
          </div>
        </section>

        {/* ── About ── */}
        <section id="about" className="section">
          <div className="shell sec">
            <SectionHead label="About" title="The competition" />
            <div>
              <div className="about">
                {about.length ? (
                  <>
                    <p className="about-lead">{about[0]}</p>
                    {about.slice(1).map((p, i) => <p key={i}>{p}</p>)}
                  </>
                ) : (
                  <p className="about-lead">
                    IASCAI is an international platform for students and young researchers to present applied science
                    projects that integrate artificial intelligence with multidisciplinary approaches.
                  </p>
                )}
              </div>
              {objectives.length > 0 && (
                <>
                  <p className="label sub">Objectives</p>
                  <ol className="objectives">
                    {objectives.map((o, i) => <li key={i}><p>{o}</p></li>)}
                  </ol>
                </>
              )}
            </div>
          </div>
        </section>

        {/* ── Categories ── */}
        {categories.length > 0 && (
          <section id="categories" className="section section-alt">
            <div className="shell sec">
              <SectionHead label="Categories" title={`${categories.length} fields`}
                lead="Every project is entered in one field and judged by specialists in it." />
              <ul className="cats">
                {categories.map((k, i) => (
                  <CategoryCard key={k.id} icon={<CategoryIcon name={k.ikon} />} num={String(i + 1).padStart(2, "0")}
                    title={k.nama} text={(k.keterangan ?? "").trim()} />
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* ── Timeline ── */}
        {schedule.length > 0 && (
          <section id="timeline" className="section">
            <div className="shell sec">
              <SectionHead label="Timeline" title="Schedule" lead="Times are Western Indonesia Time (WIB, UTC+7)." />
              <ol className="sched">
                {schedule.map((m, i) => {
                  const past = Boolean(m.tanggal && m.tanggal < today);
                  return (
                    <li key={i} className={`${past ? "past" : ""} ${i === nextIdx ? "next" : ""}`}>
                      <time dateTime={m.tanggal}>{formatDate(m.tanggal)}</time>
                      <div>
                        <strong>{m.milestone.trim()}</strong>
                        {m.lokasi && <span className="loc">{m.lokasi}</span>}
                      </div>
                      {i === nextIdx ? <span className="tag">Next</span> : past ? <span className="tag" style={{ color: "var(--ink-muted)" }}>Done</span> : <span />}
                    </li>
                  );
                })}
              </ol>
            </div>
          </section>
        )}

        {/* ── Deadline band ── */}
        <section className="band">
          <div className="shell band-row">
            <div>
              <p className="label">{statusText}</p>
              <h2>
                {state === "closed" ? "See you next edition"
                  : deadline ? <>Register by {formatDate(deadline)}</> : "Register your team"}
              </h2>
              <p className="note">
                {hasGuidebook
                  ? "Read the guidebook and the terms & conditions before you register."
                  : "Read the terms & conditions before you register."}
              </p>
            </div>
            <div className="btns">
              <Link href="/registration" className="btn btn-primary">Registration <ArrowRight size={18} /></Link>
              {hasGuidebook && <button type="button" className="btn btn-line" data-iysa-panduan="IASCAI">Guidebook</button>}
              {docs.filter((d) => d.jenis !== "guidebook").map((d) => (
                <a key={d.jenis} href={d.url!} target="_blank" rel="noreferrer" className="btn btn-line"
                   data-iysa-panduan="IASCAI" data-iysa-panduan-jenis={d.jenis}>
                  {d.judul_en ?? d.judul}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── Contact ── */}
        <section id="contact" className="section">
          <div className="shell sec">
            <SectionHead label="Contact" title="Questions" lead="The committee answers on WhatsApp and email." />
            <ul className="contact">
              {[
                { k: "WhatsApp", v: id?.kontak?.whatsapp || CONTACT.whatsapp.display,
                  href: `https://wa.me/${(id?.kontak?.whatsapp || CONTACT.whatsapp.number).replace(/\D/g, "")}` },
                { k: "Email", v: id?.kontak?.surel || CONTACT.email, href: `mailto:${id?.kontak?.surel || CONTACT.email}` },
                { k: "Instagram", v: "@iysa_official", href: CONTACT.instagram },
                { k: "YouTube", v: "@IYSAOfficial", href: CONTACT.youtube },
              ].map((c) => (
                <li key={c.k}>
                  <a href={c.href} target={c.href.startsWith("mailto") ? undefined : "_blank"} rel="noreferrer">
                    <span className="label">{c.k}</span>
                    <span>{c.v}</span>
                    <ArrowUpRight size={16} className="go" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <Footer organizer={id?.lembaga?.nama} lembaga={id?.lembaga} />
    </>
  );
}
