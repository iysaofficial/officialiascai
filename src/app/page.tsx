import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer, CONTACT } from "@/components/Footer";
import {
  getSections, formatDate, formatRange, formatPrice, splitList, registrationState,
  WILAYAH, JENJANG, type Milestone,
} from "@/lib/api";

export const revalidate = 300;

/** Fallback copy, used only while the dashboard is unreachable. */
const FALLBACK_NAME = "International Applied Science Competition on Artificial Intelligence";

export default async function Home() {
  const s = await getSections(["identitas", "jadwal_kegiatan", "timeline", "awards", "pendaftaran", "guidebook"]);
  const id = s?.identitas;
  const reg = s?.pendaftaran;
  const state = registrationState(id);
  const objectives = splitList(id?.tujuan);
  const about = (id?.latar ?? "").split(/\n+/).map((p) => p.trim()).filter(Boolean);
  const schedule: Milestone[] = (s?.jadwal_kegiatan?.length ? s.jadwal_kegiatan : s?.timeline) ?? [];
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" });
  const categories = (reg?.kategori ?? []).map((k) => ({ ...k, nama: k.nama.trim() }));
  const packages = reg?.paket ?? [];
  const intl = packages.filter((p) => p.asal !== "indonesian");
  const indo = packages.filter((p) => p.asal === "indonesian");
  const docs = (s?.guidebook?.berkas ?? []).filter((b) => b.url);
  const hasGuidebook = Boolean(s?.guidebook?.url);
  const online = id?.lokasi?.daring?.replace(/\s+/g, " ").trim();

  return (
    <>
      <Header year={id?.tahun} />

      <main>
        {/* ── Hero ── */}
        <section className="hero">
          <div className="hero-grid" aria-hidden="true" />
          <div className="shell hero-inner">
            <p className="eyebrow eyebrow-light">
              {id?.lembaga?.singkatan ?? "IYSA"} · {id?.lingkup === "international" ? "International" : "Competition"} · {id?.tahun ?? ""}
            </p>
            <h1 className="hero-title">{id?.nama ?? FALLBACK_NAME}</h1>
            <p className="hero-lead">
              An international stage for students and young researchers to present applied science projects powered by
              artificial intelligence — judged online by experts from around the world.
            </p>

            <dl className="hero-facts">
              {id?.mulai && (
                <div><dt>Event period</dt><dd>{formatRange(id.mulai, id.selesai)}</dd></div>
              )}
              <div><dt>Format</dt><dd>Online{online ? ` · ${online}` : ""}</dd></div>
              {reg?.jenjang?.length ? (
                <div><dt>Open to</dt><dd>{reg.jenjang.map((j) => JENJANG[j] ?? j).join(", ")}</dd></div>
              ) : null}
            </dl>

            <div className="hero-cta">
              <Link href="/registration" className="btn btn-primary">
                {state === "open" ? "Register now" : "Registration info"}
              </Link>
              <button type="button" className="btn btn-outline-light" data-iysa-panduan="IASCAI">
                {hasGuidebook ? "Guidebook" : "Terms & Conditions"}
              </button>
            </div>
            <p className="hero-status">
              <span className={`dot dot-${state}`} />
              {state === "open"
                ? "Registration is open"
                : state === "closed"
                  ? "Registration for this edition has closed"
                  : "Registration opens soon"}
            </p>
          </div>
        </section>

        {/* ── About ── */}
        <section id="about" className="section">
          <div className="shell two-col">
            <div>
              <p className="eyebrow">About</p>
              <h2>Artificial intelligence, applied to real problems</h2>
            </div>
            <div className="prose">
              {about.length ? about.map((p, i) => <p key={i}>{p}</p>) : (
                <p>IASCAI is an international platform for students and young researchers to present applied science projects that integrate artificial intelligence with multidisciplinary approaches.</p>
              )}
            </div>
          </div>

          {objectives.length > 0 && (
            <div className="shell">
              <h3 className="sub">Objectives</h3>
              <ol className="objectives">
                {objectives.map((o, i) => (
                  <li key={i}><span className="num">{String(i + 1).padStart(2, "0")}</span><p>{o}</p></li>
                ))}
              </ol>
            </div>
          )}
        </section>

        {/* ── Categories ── */}
        {categories.length > 0 && (
          <section id="categories" className="section section-sunk">
            <div className="shell">
              <p className="eyebrow">Competition categories</p>
              <h2>{categories.length} categories</h2>
              <ul className="cards">
                {categories.map((k, i) => (
                  <li key={k.id} className="card">
                    <span className="card-num">{String(i + 1).padStart(2, "0")}</span>
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
              <p className="eyebrow">Timeline</p>
              <h2>Important dates</h2>
              <ol className="timeline">
                {schedule.map((m, i) => {
                  const past = m.tanggal && m.tanggal < today;
                  return (
                    <li key={i} className={past ? "past" : ""}>
                      <time dateTime={m.tanggal}>{formatDate(m.tanggal)}</time>
                      <div>
                        <strong>{m.milestone.trim()}</strong>
                        {m.lokasi && <span>{m.lokasi}</span>}
                      </div>
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
              <p className="eyebrow">Registration fees</p>
              <h2>Choose your package</h2>
              <p className="muted">Fees are per team · {packages[0].min_anggota}–{packages[0].maks_anggota} members per team.</p>

              {[{ title: "International participants", list: intl }, { title: "Indonesian participants", list: indo }]
                .filter((g) => g.list.length)
                .map((g) => (
                  <div key={g.title} className="fee-group">
                    <h3 className="sub">{g.title}</h3>
                    <ul className="fees">
                      {g.list.map((p) => (
                        <li key={p.id} className="fee">
                          <p className="fee-name">{p.nama.replace(/\s*IASCAI$/i, "")}</p>
                          {WILAYAH[p.wilayah] && <p className="fee-region">{WILAYAH[p.wilayah]}</p>}
                          <p className="fee-price">{formatPrice(p)}</p>
                          <ul className="fee-benefits">
                            {p.manfaat.map((b, i) => <li key={i}>{b.replace(/\.$/, "")}</li>)}
                          </ul>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              <div className="center">
                <Link href="/registration" className="btn btn-primary">Go to registration</Link>
              </div>
            </div>
          </section>
        )}

        {/* ── Awards ── */}
        {s?.awards?.length ? (
          <section id="awards" className="section">
            <div className="shell">
              <p className="eyebrow">Awards</p>
              <h2>Recognition</h2>
              <ul className="awards">
                {s.awards.map((a) => (
                  <li key={a.nama} className={`award award-${a.nama.toLowerCase()}`}>
                    <span className="medal" aria-hidden="true" />
                    <h3>{a.nama} Medal</h3>
                    <p className="award-score">Score {Number(a.nilai_min)}–{Number(a.nilai_maks)}</p>
                    <p>{a.manfaat.split("|").map((x) => x.trim()).filter(Boolean).join(" · ")}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}

        {/* ── Documents ── */}
        {(docs.length > 0 || hasGuidebook) && (
          <section className="section section-sunk">
            <div className="shell docs">
              <div>
                <p className="eyebrow">Documents</p>
                <h2>Read before you register</h2>
              </div>
              <div className="docs-btns">
                {hasGuidebook && (
                  <button type="button" className="btn btn-primary" data-iysa-panduan="IASCAI">Guidebook</button>
                )}
                {docs.map((d) => (
                  <a key={d.jenis} href={d.url!} target="_blank" rel="noreferrer" className="btn btn-ghost"
                     data-iysa-panduan="IASCAI" data-iysa-panduan-jenis={d.jenis}>
                    {d.judul_en ?? d.judul}
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Contact ── */}
        <section id="contact" className="section">
          <div className="shell">
            <p className="eyebrow">Contact</p>
            <h2>Questions? Talk to us</h2>
            <ul className="contact">
              <li>
                <span>WhatsApp</span>
                <a href={`https://wa.me/${(id?.kontak?.whatsapp || CONTACT.whatsapp.number).replace(/\D/g, "")}`} target="_blank" rel="noreferrer">
                  {id?.kontak?.whatsapp || CONTACT.whatsapp.display}
                </a>
              </li>
              <li>
                <span>Email</span>
                <a href={`mailto:${id?.kontak?.surel || CONTACT.email}`}>{id?.kontak?.surel || CONTACT.email}</a>
              </li>
              <li><span>Instagram</span><a href={CONTACT.instagram} target="_blank" rel="noreferrer">@iysa_official</a></li>
              <li><span>YouTube</span><a href={CONTACT.youtube} target="_blank" rel="noreferrer">@IYSAOfficial</a></li>
            </ul>
          </div>
        </section>
      </main>

      <Footer organizer={id?.lembaga?.nama} />
    </>
  );
}
