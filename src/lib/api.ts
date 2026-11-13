/**
 * IASCAI ← dashboard IYSA (public API).
 *
 * Everything on this site — edition, dates, categories, packages, timeline,
 * awards, guidebook — comes from the dashboard. The edition shown is decided by
 * the pin set in the dashboard (IT → APIs), so moving to the next edition needs
 * no code change here.
 *
 * Every read swallows failures and returns null: a dashboard outage must not
 * take the site down, it only hides the parts that depend on it.
 */

export const API = process.env.NEXT_PUBLIC_IYSA_API ?? "https://api-dashboard.iysa.or.id/api/public/v1";
export const SERIES = process.env.NEXT_PUBLIC_IYSA_SERIES ?? "IASCAI";

/** Seconds. Pages rebuild in the background at most this often. */
export const REVALIDATE = 300;

export type Milestone = { milestone: string; tanggal: string; jalur: string; lokasi: string };
export type Award = { nama: string; keterangan: string; nilai_min: string; nilai_maks: string; manfaat: string };
export type Paket = {
  id: string; nama: string; harga: number; moda: string; asal: "indonesian" | "international" | string;
  wilayah: string; mode_harga: string; manfaat: string[]; min_anggota: number; maks_anggota: number;
};
export type Kategori = { id: string; nama: string; keterangan: string; tipe: string; ikon?: string | null };
export type Pendaftaran = {
  dibuka: boolean; buka_at: string | null; tutup_at: string | null; moda: string;
  jenjang: string[]; paket: Paket[]; kategori: Kategori[];
};
export type Berkas = { jenis: string; judul: string; judul_en?: string; url: string | null; nama: string };
export type Guidebook = { url: string | null; terbit: string; berkas: Berkas[] };
export type Identitas = {
  id: string; nama: string; akronim: string; tahun: string;
  lembaga: { singkatan: string; nama: string; logo: string | null; situs: string } | null;
  logo: string | null; banner: string | null;
  mulai: string; selesai: string;
  pendaftaran_buka: string; pendaftaran_tutup: string; pendaftaran_dibuka: boolean;
  lingkup: string; jenis: string;
  kontak: { surel: string; whatsapp: string };
  lokasi: { luring: string; daring: string };
  latar: string; visi: string; misi: string; tujuan: string;
};

export type Sections = {
  identitas?: Identitas;
  jadwal_kegiatan?: Milestone[];
  timeline?: Milestone[];
  awards?: Award[];
  pendaftaran?: Pendaftaran;
  guidebook?: Guidebook;
};

export async function getSections(keys: (keyof Sections)[]): Promise<Sections | null> {
  try {
    const res = await fetch(`${API}/${encodeURIComponent(SERIES)}?sections=${keys.join(",")}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: REVALIDATE },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { status?: string; data?: { sections?: Array<{ key: string; isi: unknown }> } };
    const list = json?.data?.sections;
    if (!Array.isArray(list)) return null;
    const out: Record<string, unknown> = {};
    for (const s of list) out[s.key] = s.isi;
    return out as Sections;
  } catch {
    return null;
  }
}

/* ── helpers ─────────────────────────────────────────────────────────── */

/** "2027-02-22" → "22 February 2027". */
export function formatDate(iso: string | null | undefined, opts: Intl.DateTimeFormatOptions = {}): string {
  if (!iso) return "";
  const d = new Date(`${iso.slice(0, 10)}T00:00:00+07:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jakarta", ...opts });
}

/** Two dates as one range: "22 January – 25 February 2027". */
export function formatRange(a: string, b: string): string {
  if (!a) return formatDate(b);
  if (!b || a === b) return formatDate(a);
  const sameYear = a.slice(0, 4) === b.slice(0, 4);
  const first = formatDate(a, sameYear ? { year: undefined } : {});
  return `${first} – ${formatDate(b)}`;
}

export function formatPrice(p: Paket): string {
  if (p.asal === "indonesian") return `IDR ${p.harga.toLocaleString("id-ID")}`;
  return `USD ${p.harga.toLocaleString("en-US")}`;
}

export const WILAYAH: Record<string, string> = {
  semua: "",
  asia_tenggara: "South East Asia",
  luar_asia_tenggara: "Outside South East Asia",
};

export const JENJANG: Record<string, string> = {
  elementary: "Elementary school",
  secondary: "Junior & senior high school",
  university: "University",
};

/** Objectives are stored as one string separated by "|". */
export const splitList = (s: string | null | undefined) =>
  (s ?? "").split("|").map((x) => x.trim()).filter(Boolean);

/** `open` | `soon` | `closed` | `unknown` — the dashboard toggle decides, dates only explain. */
export function registrationState(id: Identitas | null | undefined, now = new Date()) {
  if (!id) return "unknown" as const;
  if (id.pendaftaran_dibuka) return "open" as const;
  const today = now.toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" });
  if (id.pendaftaran_buka && today < id.pendaftaran_buka) return "soon" as const;
  if (id.pendaftaran_tutup && today > id.pendaftaran_tutup) return "closed" as const;
  return "soon" as const;
}
