import { useEffect, useRef, useState, type ReactNode } from "react";
import hero from "@/assets/hero.jpg";
import martial from "@/assets/martial.jpg";
import gym from "@/assets/gym.jpg";
import gear from "@/assets/gear.jpg";
import { isEmail, isPhone } from "@/lib/store";

export const IMAGES: Record<string, string> = { hero, martial, gym, gear };

const P: Record<string, string> = {
  search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm10 17-5-5",
  menu: "M4 6h16M4 12h16M4 18h16",
  x: "M6 6l12 12M18 6 6 18",
  cart: "M3 4h2l2.4 11h11L21 7H6.2M9 20a1 1 0 1 0 0-.01M18 20a1 1 0 1 0 0-.01",
  heart: "M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z",
  bell: "M6 16V11a6 6 0 1 1 12 0v5l2 2H4zM10 21h4",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-8 9a8 8 0 0 1 16 0",
  play: "M8 5v14l11-7z",
  check: "M5 12l5 5L20 7",
  arrow: "M5 12h14m-6-6 6 6-6 6",
  trophy: "M8 4h8v5a4 4 0 0 1-8 0zM5 5h3v3a3 3 0 0 1-3-3zm14 0h-3v3a3 3 0 0 0 3-3zM12 13v4m-4 3h8",
  shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z",
  dumbbell: "M3 10v4M6 7v10M18 7v10M21 10v4M6 12h12",
  book: "M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 5v16",
  users: "M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-6 9a6 6 0 0 1 12 0M17 11a3 3 0 1 0 0-6M21 20a6 6 0 0 0-4-5.6",
  bag: "M5 8h14l-1 12H6zM9 8V6a3 3 0 0 1 6 0v2",
  share: "M4 12v7h16v-7M12 3v12M7 8l5-5 5 5",
  bookmark: "M6 3h12v18l-6-4-6 4z",
  chat: "M4 5h16v11H8l-4 4z",
  flag: "M5 21V4h11l-2 4 2 4H5",
  phone: "M5 3h4l2 5-3 2a11 11 0 0 0 6 6l2-3 5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2z",
  mail: "M3 6h18v12H3zm0 0 9 7 9-7",
  pin: "M12 21s-7-6.3-7-12a7 7 0 0 1 14 0c0 5.7-7 12-7 12zm0-9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  grid: "M4 4h7v7H4zm9 0h7v7h-7zM4 13h7v7H4zm9 0h7v7h-7z",
  chart: "M4 20V10m6 10V4m6 16v-7m4 7H2",
  logout: "M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10",
  eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  medal: "M8 3l4 6 4-6M12 21a6 6 0 1 0 0-12 6 6 0 0 0 0 12z",
  globe: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18",
  plus: "M12 5v14M5 12h14",
  edit: "M4 20h4L19 9l-4-4L4 16zM14 6l4 4",
  trash: "M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13",
  download: "M12 4v12m-5-5 5 5 5-5M4 20h16",
  phoneapp: "M7 2h10v20H7zM11 18h2",
};

export function Icon({ name, className = "h-5 w-5", filled }: { name: keyof typeof P | string; className?: string; filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={P[name] ?? P.grid} />
    </svg>
  );
}

export function Img({ k, alt, className = "", eager }: { k: string; alt: string; className?: string; eager?: boolean }) {
  const [err, setErr] = useState(false);
  if (err || !IMAGES[k]) return <div role="img" aria-label={alt} className={`bg-navy-2 ${className}`} />;
  return <img src={IMAGES[k]} alt={alt} loading={eager ? "eager" : "lazy"} onError={() => setErr(true)} className={`object-cover ${className}`} width={1024} height={768} />;
}

export function Badge({ children, tone = "muted" }: { children: ReactNode; tone?: "muted" | "ok" | "warn" | "err" | "navy" }) {
  const t = { muted: "bg-muted text-muted-foreground", ok: "bg-success/12 text-success", warn: "bg-accent text-accent-foreground", err: "bg-destructive/10 text-destructive", navy: "bg-navy text-navy-foreground" }[tone];
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${t}`}>{children}</span>;
}
export function statusTone(s: string): "ok" | "warn" | "err" | "muted" | "navy" {
  const v = String(s).toLowerCase();
  if (/(open|active|approved|valid|pass|success|delivered|published|present|certified|enrolling|completed|in stock)/.test(v)) return "ok";
  if (/(expired|rejected|closed|absent|cancel|fail|out of stock|blocked)/.test(v)) return "err";
  if (/(live)/.test(v)) return "navy";
  if (/(pending|waitlist|upcoming|processing|shipped|due|expiring|new|draft|soon|open)/.test(v)) return "warn";
  return "muted";
}

export const DemoTag = ({ children = "Sample data" }: { children?: ReactNode }) => (
  <span className="inline-flex items-center gap-1 rounded-full border border-dashed border-primary/50 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-accent-foreground">{children}</span>
);

export function Section({ eyebrow, title, sub, children, tone = "light", id, action }: { eyebrow?: string; title: string; sub?: string; children: ReactNode; tone?: "light" | "muted" | "navy"; id?: string; action?: ReactNode }) {
  const bg = tone === "navy" ? "bg-navy text-navy-foreground" : tone === "muted" ? "bg-muted" : "bg-background";
  return (
    <section id={id} className={`${bg} py-16 md:py-20`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            {eyebrow && <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>}
            <h2 className="text-3xl font-bold uppercase md:text-4xl">{title}</h2>
            {sub && <p className={`mt-3 ${tone === "navy" ? "text-navy-foreground/70" : "text-muted-foreground"}`}>{sub}</p>}
          </div>
          {action}
        </div>
        {children}
      </div>
    </section>
  );
}

export function PageHero({ title, sub, img = "hero" }: { title: string; sub?: string; img?: string }) {
  return (
    <div className="relative overflow-hidden bg-navy text-navy-foreground">
      <Img k={img} alt="" eager className="absolute inset-0 h-full w-full" />
      <div className="hero-overlay absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20">
        <h1 className="text-4xl font-extrabold uppercase md:text-6xl">{title}</h1>
        {sub && <p className="mt-3 max-w-2xl text-navy-foreground/80">{sub}</p>}
      </div>
    </div>
  );
}

export function Modal({ open, onClose, title, children, wide }: { open: boolean; onClose: () => void; title: string; children: ReactNode; wide?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", k);
    ref.current?.focus();
    return () => document.removeEventListener("keydown", k);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center bg-navy/70 p-0 sm:items-center sm:p-4" onClick={onClose}>
      <div ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()} className={`max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-card p-5 shadow-2xl outline-none sm:rounded-2xl sm:p-6 ${wide ? "max-w-3xl" : "max-w-lg"}`}>
        <div className="mb-4 flex items-start justify-between gap-4">
          <h3 className="text-2xl font-bold uppercase">{title}</h3>
          <button onClick={onClose} aria-label="Close dialog" className="rounded-md p-1 text-muted-foreground hover:bg-muted"><Icon name="x" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Empty({ text = "No records found." }: { text?: string }) {
  return <div className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">{text}</div>;
}

export type FieldDef = { name: string; label: string; type?: "text" | "email" | "tel" | "number" | "date" | "select" | "textarea"; options?: string[]; required?: boolean; placeholder?: string };

export function validate(defs: FieldDef[], v: Record<string, any>) {
  const e: Record<string, string> = {};
  for (const d of defs) {
    const val = String(v[d.name] ?? "").trim();
    if (d.required && !val) e[d.name] = `${d.label} is required`;
    else if (val && d.type === "email" && !isEmail(val)) e[d.name] = "Enter a valid email address";
    else if (val && d.type === "tel" && !isPhone(val)) e[d.name] = "Enter a valid Indian mobile, e.g. +91 98765 43210";
  }
  return e;
}

export function Fields({ defs, values, errors, onChange }: { defs: FieldDef[]; values: Record<string, any>; errors: Record<string, string>; onChange: (n: string, v: string) => void }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {defs.map((d) => {
        const id = `f-${d.name}`;
        const common = { id, value: values[d.name] ?? "", "aria-invalid": !!errors[d.name], className: "field", onChange: (e: any) => onChange(d.name, e.target.value) };
        return (
          <div key={d.name} className={d.type === "textarea" ? "sm:col-span-2" : ""}>
            <label htmlFor={id} className="mb-1 block text-sm font-semibold">{d.label}{d.required && <span className="text-destructive"> *</span>}</label>
            {d.type === "select" ? (
              <select {...common}><option value="">Select…</option>{d.options?.map((o) => <option key={o}>{o}</option>)}</select>
            ) : d.type === "textarea" ? (
              <textarea rows={3} {...common} placeholder={d.placeholder} />
            ) : (
              <input type={d.type ?? "text"} {...common} placeholder={d.placeholder} />
            )}
            {errors[d.name] && <p className="mt-1 text-xs text-destructive">{errors[d.name]}</p>}
          </div>
        );
      })}
    </div>
  );
}

export const PERSON_FIELDS: FieldDef[] = [
  { name: "name", label: "Full name", required: true, placeholder: "e.g. Aarav Patil" },
  { name: "email", label: "Email", type: "email", required: true, placeholder: "you@example.com" },
  { name: "phone", label: "Mobile", type: "tel", required: true, placeholder: "+91 98765 43210" },
];

// QR-style deterministic pattern (demo only, not a scannable QR)
export function QrMock({ text, size = 96 }: { text: string; size?: number }) {
  let h = 0; for (const c of text) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const cells: ReactNode[] = [];
  for (let y = 0; y < 11; y++) for (let x = 0; x < 11; x++) {
    h = (h * 1103515245 + 12345) >>> 0;
    const corner = (x < 3 && y < 3) || (x > 7 && y < 3) || (x < 3 && y > 7);
    if (corner || (h >> 16) % 2) cells.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" />);
  }
  return <svg viewBox="-1 -1 13 13" width={size} height={size} className="rounded bg-background fill-foreground" role="img" aria-label="Demo verification code">{cells}</svg>;
}
