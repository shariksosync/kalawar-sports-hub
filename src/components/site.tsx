import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { BUSINESS, type Rec } from "@/data/mock";
import { clean, finalPrice, inr, uid, useStore } from "@/lib/store";
import { Badge, DemoTag, Fields, Icon, Img, Modal, PERSON_FIELDS, statusTone, validate, type FieldDef } from "./kit";

export const NAV = [
  { to: "/", label: "Home" }, { to: "/about", label: "About Us" }, { to: "/federation", label: "Federation" },
  { to: "/academies", label: "Sports Academies" }, { to: "/gym", label: "Gym & Fitness" }, { to: "/championships", label: "Championships" },
  { to: "/courses", label: "Courses & Certification" }, { to: "/media", label: "Sports Media" }, { to: "/news", label: "News & Events" },
  { to: "/shop", label: "Shop" }, { to: "/contact", label: "Contact Us" },
] as const;

export function Wordmark({ light }: { light?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2" aria-label="KALAWAR Sports home">
      <span className="grid h-9 w-9 place-items-center rounded-md bg-primary font-display text-xl font-black text-primary-foreground">K</span>
      <span className={`font-display text-xl font-extrabold leading-none tracking-wide ${light ? "text-navy-foreground" : "text-foreground"}`}>
        KALAWAR<span className="text-primary"> SPORTS</span>
      </span>
    </Link>
  );
}

function Header() {
  const { cart, db } = useStore();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const nav = useNavigate();
  const unread = (db.notifications ?? []).filter((n) => !n.read).length;
  useEffect(() => { const f = () => setScrolled(window.scrollY > 10); f(); window.addEventListener("scroll", f); return () => window.removeEventListener("scroll", f); }, []);
  const go = (e: React.FormEvent) => { e.preventDefault(); setOpen(false); nav({ to: "/search", search: { q } }); };
  const count = cart.reduce((a, c) => a + c.qty, 0);
  return (
    <header className={`sticky top-0 z-50 bg-navy text-navy-foreground transition-shadow ${scrolled ? "shadow-lg" : ""}`}>
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
        <Wordmark light />
        <form onSubmit={go} className="ml-auto hidden max-w-xs flex-1 md:block" role="search">
          <label htmlFor="gsearch" className="sr-only">Search KALAWAR</label>
          <div className="flex items-center rounded-md bg-navy-2 px-3">
            <Icon name="search" className="h-4 w-4 text-navy-foreground/60" />
            <input id="gsearch" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search academies, courses, gear…" className="w-full bg-transparent px-2 py-2 text-sm text-navy-foreground placeholder:text-navy-foreground/50 focus:outline-none" />
          </div>
        </form>
        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <Link to="/notifications" aria-label={`Notifications, ${unread} unread`} className="relative rounded-md p-2 hover:bg-navy-2"><Icon name="bell" />{unread > 0 && <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary" />}</Link>
          <Link to="/wishlist" aria-label="Wishlist" className="hidden rounded-md p-2 hover:bg-navy-2 sm:block"><Icon name="heart" /></Link>
          <Link to="/cart" aria-label={`Cart, ${count} items`} className="relative rounded-md p-2 hover:bg-navy-2"><Icon name="cart" />{count > 0 && <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">{count}</span>}</Link>
          <Link to="/account" aria-label="Account" className="rounded-md p-2 hover:bg-navy-2"><Icon name="user" /></Link>
          <Link to="/account" className="btn btn-primary ml-1 hidden sm:inline-flex">Join KALAWAR</Link>
          <button onClick={() => setOpen(true)} className="rounded-md p-2 hover:bg-navy-2 xl:hidden" aria-label="Open menu" aria-expanded={open}><Icon name="menu" /></button>
        </div>
      </div>
      <nav className="hidden border-t border-navy-2 xl:block" aria-label="Primary">
        <ul className="mx-auto flex max-w-7xl gap-1 px-4 sm:px-6">
          {NAV.map((n) => (
            <li key={n.to}><Link to={n.to} activeOptions={{ exact: n.to === "/" }} className="block border-b-2 border-transparent px-2.5 py-2.5 text-[13px] font-semibold text-navy-foreground/80 hover:text-navy-foreground" activeProps={{ className: "!border-primary !text-primary" }}>{n.label}</Link></li>
          ))}
        </ul>
      </nav>
      {open && (
        <div className="fixed inset-0 z-[60] xl:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="absolute inset-0 bg-navy/70" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 flex h-full w-80 max-w-[85vw] flex-col overflow-y-auto bg-navy p-5">
            <div className="mb-4 flex items-center justify-between"><Wordmark light /><button onClick={() => setOpen(false)} aria-label="Close menu" className="rounded p-1 hover:bg-navy-2"><Icon name="x" /></button></div>
            <form onSubmit={go} className="mb-4"><input aria-label="Search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="field !bg-navy-2 !text-navy-foreground" /></form>
            {NAV.map((n) => <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="rounded-md px-3 py-2.5 font-semibold hover:bg-navy-2" activeProps={{ className: "text-primary" }} activeOptions={{ exact: n.to === "/" }}>{n.label}</Link>)}
            <Link to="/account" onClick={() => setOpen(false)} className="btn btn-primary mt-4">Join KALAWAR</Link>
          </div>
        </div>
      )}
    </header>
  );
}

function Footer() {
  const col = (title: string, links: { to: string; label: string; params?: any }[]) => (
    <div><h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-primary">{title}</h4>
      <ul className="space-y-2 text-sm text-navy-foreground/75">{links.map((l) => <li key={l.label}><Link to={l.to as any} params={l.params} className="hover:text-navy-foreground">{l.label}</Link></li>)}</ul></div>
  );
  const pol = (slug: string, label: string) => ({ to: "/policy/$slug", params: { slug }, label });
  return (
    <footer className="bg-navy text-navy-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-6">
        <div className="lg:col-span-2">
          <Wordmark light />
          <p className="mt-4 text-sm text-navy-foreground/70">Technology-driven platform for sports, fitness, martial arts and academy management.</p>
          <address className="mt-4 space-y-2 text-sm not-italic text-navy-foreground/75">
            <p className="flex gap-2"><Icon name="pin" className="h-4 w-4 shrink-0 text-primary" />{BUSINESS.address}</p>
            {BUSINESS.phones.map((p) => <a key={p} href={`tel:${p.replace(/\s/g, "")}`} className="flex gap-2 hover:text-navy-foreground"><Icon name="phone" className="h-4 w-4 text-primary" />{p}</a>)}
            <a href={`mailto:${BUSINESS.email}`} className="flex gap-2 hover:text-navy-foreground"><Icon name="mail" className="h-4 w-4 text-primary" />{BUSINESS.email}</a>
          </address>
        </div>
        {col("Explore", [{ to: "/about", label: "About Us" }, { to: "/federation", label: "Federation" }, { to: "/academies", label: "Academies" }, { to: "/verify", label: "Verify Certificate" }, { to: "/search", label: "Search" }])}
        {col("Train", [{ to: "/gym", label: "Gym & Fitness" }, { to: "/courses", label: "Courses" }, { to: "/championships", label: "Championships" }, { to: "/media", label: "Reels & Videos" }, { to: "/news", label: "News & Events" }])}
        {col("Shop", [{ to: "/shop", label: "All Products" }, { to: "/cart", label: "Cart" }, { to: "/wishlist", label: "Wishlist" }, { to: "/orders", label: "Order History" }, { to: "/account", label: "My Account" }])}
        {col("Policies", [pol("privacy", "Privacy Policy"), pol("terms", "Terms & Conditions"), pol("refund", "Refund & Cancellation"), pol("shipping", "Shipping Policy"), { to: "/contact", label: "Contact Us" }])}
      </div>
      <div className="border-t border-navy-2">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-5 text-xs text-navy-foreground/60 sm:px-6">
          <p>© {new Date().getFullYear()} KALAWAR Sports. All rights reserved. Prototype with demonstration data.</p>
          <Link to="/admin-login" className="btn btn-ghost-light !py-1.5 !text-xs"><Icon name="shield" className="h-4 w-4" />Admin Login</Link>
        </div>
      </div>
    </footer>
  );
}

export function Site({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-[100] focus:rounded focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground">Skip to content</a>
      <Header />
      <main id="main" className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

/** Generic validated registration form; stores into a mock collection. */
export function RegisterForm({ title, kind, extra = [], defaults = {}, onDone, fee }: { title: string; kind: string; extra?: FieldDef[]; defaults?: Rec; onDone?: () => void; fee?: number }) {
  const { upsert, toast, user } = useStore();
  const defs = [...PERSON_FIELDS, ...extra];
  const [v, setV] = useState<Rec>({ name: user?.name ?? "", email: user?.email ?? "", phone: user?.phone ?? "", ...defaults });
  const [e, setE] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const errs = validate(defs, v); setE(errs);
    if (Object.keys(errs).length) return toast("Please fix the highlighted fields", "err");
    setBusy(true);
    setTimeout(() => {
      const ref = uid("REG");
      const clean_ = Object.fromEntries(Object.entries(v).map(([k, x]) => [k, clean(String(x))]));
      upsert("registrations", { id: ref, kind, title, ...clean_, status: "Pending", date: new Date().toISOString().slice(0, 10) });
      if (fee) upsert("transactions", { id: uid("TXN"), user: clean_.name, purpose: `${kind}: ${title}`, amount: fee, date: new Date().toISOString().slice(0, 10), status: "Success (demo)" });
      upsert("notifications", { id: uid("NT"), title: `${kind} submitted`, body: `${title} — reference ${ref}`, type: kind, date: new Date().toISOString().slice(0, 10), read: false });
      setBusy(false); setDone(ref); toast(`${kind} submitted`);
    }, 600);
  };
  if (done) return (
    <div className="rounded-xl bg-success/10 p-6 text-center">
      <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-success text-success-foreground"><Icon name="check" /></div>
      <p className="text-lg font-bold">Submitted successfully</p>
      <p className="mt-1 text-sm text-muted-foreground">Reference <strong>{done}</strong>. {fee ? `Demo payment of ${inr(fee)} recorded — no money was charged.` : "This is a demo confirmation."}</p>
      {onDone && <button className="btn btn-outline mt-4" onClick={onDone}>Close</button>}
    </div>
  );
  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <Fields defs={defs} values={v} errors={e} onChange={(n, x) => setV((o) => ({ ...o, [n]: x }))} />
      {fee ? <p className="rounded-md bg-accent p-3 text-sm text-accent-foreground">Fee {inr(fee)} — <strong>Demo Payment — No Money Will Be Charged</strong></p> : null}
      <button disabled={busy} className="btn btn-primary w-full">{busy ? "Submitting…" : `Submit ${kind.toLowerCase()}`}</button>
      <p className="text-xs text-muted-foreground">Demo form: data stays in your browser and is not sent anywhere.</p>
    </form>
  );
}

export function ProductCard({ p, onView }: { p: Rec; onView: () => void }) {
  const { addToCart, wishlist, toggleWish } = useStore();
  const out = p.stock <= 0;
  const w = wishlist.includes(p.id);
  return (
    <article className="card card-lift flex flex-col overflow-hidden">
      <div className="relative">
        <Img k={p.img} alt={p.name} className="aspect-[4/3] w-full" />
        {p.discount > 0 && <span className="absolute left-3 top-3 rounded bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">-{p.discount}%</span>}
        <button onClick={() => toggleWish(p.id)} aria-pressed={w} aria-label={w ? "Remove from wishlist" : "Add to wishlist"} className={`absolute right-3 top-3 rounded-full bg-background p-2 shadow ${w ? "text-primary" : "text-muted-foreground"}`}><Icon name="heart" filled={w} className="h-4 w-4" /></button>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-semibold uppercase text-muted-foreground">{p.category}</p>
        <h3 className="mt-1 font-sans text-base font-bold">{p.name}</h3>
        <div className="mt-2 flex items-baseline gap-2"><span className="text-lg font-bold">{inr(finalPrice(p))}</span>{p.discount > 0 && <span className="text-sm text-muted-foreground line-through">{inr(p.price)}</span>}</div>
        <div className="mt-1"><Badge tone={out ? "err" : p.stock < 10 ? "warn" : "ok"}>{out ? "Out of stock" : p.stock < 10 ? `Only ${p.stock} left` : "In stock"}</Badge></div>
        <div className="mt-auto flex gap-2 pt-4">
          <button disabled={out} onClick={() => addToCart(p.id)} className="btn btn-primary flex-1 !px-3">Add to cart</button>
          <button onClick={onView} className="btn btn-outline !px-3">View</button>
        </div>
      </div>
    </article>
  );
}

export function ProductModal({ p, onClose }: { p: Rec | null; onClose: () => void }) {
  const { db, addToCart } = useStore();
  const [size, setSize] = useState(""); const [color, setColor] = useState(""); const [qty, setQty] = useState(1);
  const [view, setView] = useState<Rec | null>(null);
  useEffect(() => { setSize(""); setColor(""); setQty(1); }, [p?.id]);
  if (!p) return null;
  const related = db.products.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 3);
  const sizes = p.sizes ? String(p.sizes).split(",") : []; const colors = p.colors ? String(p.colors).split(",") : [];
  return (
    <Modal open onClose={onClose} title={p.name} wide>
      <div className="grid gap-6 md:grid-cols-2">
        <Img k={p.img} alt={p.name} className="aspect-square w-full rounded-xl" />
        <div>
          <DemoTag>Demo price & stock</DemoTag>
          <p className="mt-3 text-3xl font-bold">{inr(finalPrice(p))} {p.discount > 0 && <span className="text-base text-muted-foreground line-through">{inr(p.price)}</span>}</p>
          <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
          <dl className="mt-3 grid grid-cols-2 gap-1 text-sm"><dt className="text-muted-foreground">Product ID</dt><dd>{p.id}</dd><dt className="text-muted-foreground">SKU</dt><dd>{p.sku}</dd><dt className="text-muted-foreground">Category</dt><dd>{p.category}</dd><dt className="text-muted-foreground">Stock</dt><dd>{p.stock}</dd></dl>
          {sizes.length > 0 && <div className="mt-3"><p className="mb-1 text-sm font-semibold">Size</p><div className="flex flex-wrap gap-2">{sizes.map((s) => <button key={s} onClick={() => setSize(s)} aria-pressed={size === s} className={`rounded-md border px-3 py-1 text-sm ${size === s ? "border-primary bg-accent" : ""}`}>{s}</button>)}</div></div>}
          {colors.length > 0 && <div className="mt-3"><p className="mb-1 text-sm font-semibold">Colour</p><div className="flex flex-wrap gap-2">{colors.map((s) => <button key={s} onClick={() => setColor(s)} aria-pressed={color === s} className={`rounded-md border px-3 py-1 text-sm ${color === s ? "border-primary bg-accent" : ""}`}>{s}</button>)}</div></div>}
          <div className="mt-4 flex items-center gap-2">
            <label htmlFor="pq" className="text-sm font-semibold">Qty</label>
            <input id="pq" type="number" min={1} max={p.stock} value={qty} onChange={(e) => setQty(Math.max(1, +e.target.value))} className="field !w-20" />
            <button disabled={p.stock <= 0 || (sizes.length > 0 && !size)} onClick={() => { addToCart(p.id, qty, { size, color }); onClose(); }} className="btn btn-primary flex-1">{sizes.length && !size ? "Select a size" : "Add to cart"}</button>
          </div>
        </div>
      </div>
      {related.length > 0 && <div className="mt-6"><h4 className="mb-2 text-lg font-bold uppercase">Related products</h4><div className="grid grid-cols-3 gap-3">{related.map((r) => <button key={r.id} onClick={() => setView(r)} className="rounded-lg border p-2 text-left text-sm hover:border-primary"><Img k={r.img} alt={r.name} className="mb-1 aspect-square w-full rounded" />{r.name}<br /><b>{inr(finalPrice(r))}</b></button>)}</div></div>}
      {view && <ProductModal p={view} onClose={() => setView(null)} />}
    </Modal>
  );
}

export function StatusPill({ s }: { s: string }) { return <Badge tone={statusTone(s)}>{s}</Badge>; }

export function seo(title: string, description: string) {
  return {
    meta: [
      { title: `${title} | KALAWAR Sports` }, { name: "description", content: description },
      { property: "og:title", content: `${title} | KALAWAR Sports` }, { property: "og:description", content: description },
      { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
    ],
  };
}
