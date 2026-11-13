import Link from "next/link";
import { ArrowRight, ArrowUpRight, CalendarDays, Check, Globe2, GraduationCap, Mail, MessageCircle, Medal, AtSign, PlayCircle } from "lucide-react";
import { CategoryIcon } from "@/components/CategoryIcon";
import { Header } from "@/components/Header";
import { Footer, CONTACT } from "@/components/Footer";
import { NeuralArt } from "@/components/NeuralArt";
import { SectionHead } from "@/components/SectionHead";
import {
  getSections, formatDate, formatRange, splitList, registrationState,
  WILAYAH, JENJANG, type Milestone, type Paket,
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

/** "Online + Certificate and Medal (South East Asia) IASCAI" → name without the series and the region repeat. */
function packageName(p: Paket): string {
  let n = p.nama.replace(/\s*IASCAI$/i, "").trim();
  if (WILAYAH[p.wilayah]) n = n.replace(/\s*\([^)]*\)\s*$/, "").trim();
  return n;
}

function Price({ p }: { p: Paket }) {
  const idr = p.asal === "indonesian";
  return (
    <p className="price">
      <span className="price-cur">{idr ? "IDR" : "USD"}</span>
      <span className="price-num">{p.harga.toLocaleString(idr ? "id-ID" : "en-US")}</span>
      <span className="price-unit">/ team</span>
    </p>
  );
}

export default async function Home() {
  const s = await getSections(["identitas", "jadwal_kegiatan", "timeline", "awards", "pendaftaran", "guidebook"]);
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
  const intl = packages.filter((p) => p.asal !== "indonesian");
  const indo = packages.filter((p) => p.asal === "indonesian");
  const docs = (s?.guidebook?.berkas ?? []).filter((b) => b.url);
  const hasGuidebook = Boolean(s?.guidebook?.url);
  const online = id?.lokasi?.daring?.replace(/\s+/g, " ").trim();
  const deadline = schedule.find((m) => /registration/i.test(m.milestone))?.tanggal || id?.pendaftaran_tutup || "";
  const leftDays = daysUntil(deadline);
  const team = packages[0] ? `${packages[0].min_anggota}–${packages[0].maks_anggota}` : null;

  let n = 0;
  const num = () => String(++n).padStart(2, "0");

  return (
    <>
      <Header year={id?.tahun} lembaga={id?.lembaga} />

      <main>
        {/* ── Hero ── */}
        <section className="hero">
          <div className="hero-grid" aria-hidden="true" />
          <div className="shell hero-inner">
            <div className="hero-copy">
              <p className="kicker">
                <span className="kicker-dot" />
                {id?.lembaga?.singkatan ?? "IYSA"} presents · {id?.tahun ?? ""} edition
              </p>
              <h1 className="hero-title">
                {id?.nama ? (
                  <>
                    International Applied Science Competition on{" "}
                    <span className="grad">Artificial Intelligence</span>
                  </>
                ) : FALLBACK_NAME}
              </h1>
              <p className="hero-lead">
                An international stage for students and young researchers to present applied science projects powered
                by artificial intelligence — judged online by experts from around the world.
              </p>

              <div className="hero-cta">
                <Link href="/registration" className="btn btn-primary">
                  {state === "open" ? "Register now" : "Registration info"} <ArrowRight size={18} />
                </Link>
                <button type="button" className="btn btn-glass" data-iysa-panduan="IASCAI">
                  {hasGuidebook ? "Guidebook" : "Terms & Conditions"}
                </button>
              </div>

              <p className="hero-status">
                <span className={`dot dot-${state}`} />
                {state === "open"
                  ? leftDays != null && leftDays >= 0
                    ? `Registration is open · closes in ${leftDays} day${leftDays === 1 ? "" : "s"}`
                    : "Registration is open"
                  : state === "closed"
                    ? "Registration for this edition has closed"
                    : `Registration opens soon${deadline ? ` · deadline ${formatDate(deadline)}` : ""}`}
              </p>
            </div>
            <NeuralArt />
          </div>

          <div className="shell">
            <dl className="facts">
              {id?.mulai && (
                <div className="fact">
                  <CalendarDays size={18} />
                  <dt>Event period</dt>
                  <dd>{formatRange(id.mulai, id.selesai)}</dd>
                </div>
              )}
              <div className="fact">
                <Globe2 size={18} />
                <dt>Format</dt>
                <dd>Online{online ? ` via ${online.replace(/ Meeting$/i, "")}` : ""}</dd>
              </div>
              {reg?.jenjang?.length ? (
                <div className="fact">
                  <GraduationCap size={18} />
                  <dt>Open to</dt>
                  <dd>{reg.jenjang.map((j) => JENJANG[j] ?? j).join(" · ")}</dd>
                </div>
              ) : null}
              {categories.length > 0 && (
                <div className="fact">
                  <span className="fact-big">{categories.length}</span>
                  <dt>Categories</dt>
                  <dd>Teams of {team ?? "1–6"}</dd>
                </div>
              )}
            </dl>
          </div>
        </section>

        {/* ── About ── */}
        <section id="about" className="section">
          <div className="shell">
            <SectionHead num={num()} label="About" title="Artificial intelligence, applied to real problems" />
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
                <h3 className="sub">Objectives</h3>
                <ol className="objectives">
                  {objectives.map((o, i) => (
                    <li key={i}>
                      <span className="mono-num">{String(i + 1).padStart(2, "0")}</span>
                      <p>{o}</p>
                    </li>
                  ))}
                </ol>
              </>
            )}
          </div>
        </section>

        {/* ── Categories ── */}
        {categories.length > 0 && (
          <section id="categories" className="section section-sunk">
            <div className="shell">
              <SectionHead num={num()} label="Categories" title={`${categories.length} fields to compete in`}
                lead="Pick the field that fits your project. Every category is judged by specialists in that area." />
              <ul className="cards">
                {categories.map((k, i) => (
                  <li key={k.id} className="card">
                    <div className="card-top">
                      <CategoryIcon name={k.ikon} />
                      <span className="mono-num">{String(i + 1).padStart(2, "0")}</span>
                    </div>
                    <h3>{k.nama}</h3>
                    {k.keterangan && <p>{k.keterangan.trim()}</p>}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* ── Timeline ── */}
        {schedule.length > 0 && (
          <section id="timeline" className="section">
            <div className="shell">
              <SectionHead num={num()} label="Timeline" title="Important dates"
                lead="All times follow Western Indonesia Time (WIB, UTC+7)." />
              <ol className="timeline">
                {schedule.map((m, i) => {
                  const past = m.tanggal && m.tanggal < today;
                  return (
                    <li key={i} className={`${past ? "past" : ""} ${i === nextIdx ? "next" : ""}`}>
                      <time dateTime={m.tanggal}>
                        <span className="t-day">{formatDate(m.tanggal, { month: undefined, year: undefined })}</span>
                        <span className="t-mon">{formatDate(m.tanggal, { day: undefined, month: "short" })}</span>
                      </time>
                      <div className="t-body">
                        <strong>{m.milestone.trim()}</strong>
                        {m.lokasi && <span>{m.lokasi}</span>}
                      </div>
                      {i === nextIdx && <span className="badge">Next</span>}
                    </li>
                  );
                })}
              </ol>
            </div>
          </section>
        )}

        {/* ── Fees ── */}
        {packages.length > 0 && (
          <section id="fees" className="section section-sunk">
            <div className="shell">
              <SectionHead num={num()} label="Fees" title="Registration packages"
                lead={`Fees are per team${team ? ` of ${team} members` : ""}. Choose the package for where your team is based.`} />

              {[{ title: "International participants", list: intl }, { title: "Indonesian participants", list: indo }]
                .filter((g) => g.list.length)
                .map((g) => (
                  <div key={g.title} className="fee-group">
                    <h3 className="sub">{g.title}</h3>
                    <ul className="fees">
                      {g.list.map((p) => (
                        <li key={p.id} className="fee">
                          <div className="fee-head">
                            <p className="fee-name">{packageName(p)}</p>
                            {WILAYAH[p.wilayah] && <p className="fee-region">{WILAYAH[p.wilayah]}</p>}
                          </div>
                          <Price p={p} />
                          <ul className="fee-benefits">
                            {p.manfaat.map((b, i) => (
                              <li key={i}><Check size={16} />{b.replace(/\.$/, "")}</li>
                            ))}
                          </ul>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* ── Awards ── */}
        {s?.awards?.length ? (
          <section id="awards" className="section">
            <div className="shell">
              <SectionHead num={num()} label="Awards" title="Recognition for every finalist"
                lead="Medals are awarded by final judging score." />
              <ul className="awards">
                {s.awards.map((a) => {
                  const lo = Number(a.nilai_min), hi = Number(a.nilai_maks);
                  return (
                    <li key={a.nama} className={`award award-${a.nama.toLowerCase()}`}>
                      <span className="medal"><Medal size={26} /></span>
                      <h3>{a.nama}</h3>
                      <p className="award-score"><span className="mono">{lo}–{hi}</span> points</p>
                      <div className="range" aria-hidden="true">
                        <span style={{ left: `${lo}%`, width: `${Math.max(2, hi - lo)}%` }} />
                      </div>
                      <p className="award-benefit">
                        {a.manfaat.split("|").map((x) => x.trim()).filter(Boolean).join(" + ")}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
        ) : null}

        {/* ── CTA ── */}
        <section className="section section-tight">
          <div className="shell">
            <div className="cta">
              <div>
                <h2>Ready to put your AI project on an international stage?</h2>
                <p>
                  {deadline && state !== "closed"
                    ? `Register before ${formatDate(deadline)}. Read the ${hasGuidebook ? "guidebook" : "terms & conditions"} first.`
                    : "Read the terms & conditions, then register your team."}
                </p>
              </div>
              <div className="cta-btns">
                <Link href="/registration" className="btn btn-light">Register <ArrowRight size={18} /></Link>
                {hasGuidebook && (
                  <button type="button" className="btn btn-glass" data-iysa-panduan="IASCAI">Guidebook</button>
                )}
                {docs.map((d) => (
                  <a key={d.jenis} href={d.url!} target="_blank" rel="noreferrer" className="btn btn-glass"
                     data-iysa-panduan="IASCAI" data-iysa-panduan-jenis={d.jenis}>
                    {d.judul_en ?? d.judul}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Contact ── */}
        <section id="contact" className="section">
          <div className="shell">
            <SectionHead num={num()} label="Contact" title="Questions? Talk to us" />
            <ul className="contact">
              <li>
                <a href={`https://wa.me/${(id?.kontak?.whatsapp || CONTACT.whatsapp.number).replace(/\D/g, "")}`} target="_blank" rel="noreferrer">
                  <MessageCircle size={20} />
                  <span><small>WhatsApp</small>{id?.kontak?.whatsapp || CONTACT.whatsapp.display}</span>
                  <ArrowUpRight size={16} className="go" />
                </a>
              </li>
              <li>
                <a href={`mailto:${id?.kontak?.surel || CONTACT.email}`}>
                  <Mail size={20} />
                  <span><small>Email</small>{id?.kontak?.surel || CONTACT.email}</span>
                  <ArrowUpRight size={16} className="go" />
                </a>
              </li>
              <li>
                <a href={CONTACT.instagram} target="_blank" rel="noreferrer">
                  <AtSign size={20} />
                  <span><small>Instagram</small>@iysa_official</span>
                  <ArrowUpRight size={16} className="go" />
                </a>
              </li>
              <li>
                <a href={CONTACT.youtube} target="_blank" rel="noreferrer">
                  <PlayCircle size={20} />
                  <span><small>YouTube</small>@IYSAOfficial</span>
                  <ArrowUpRight size={16} className="go" />
                </a>
              </li>
            </ul>
          </div>
        </section>
      </main>

      <Footer organizer={id?.lembaga?.nama} lembaga={id?.lembaga} />
    </>
  );
}
