import { useMemo, useState } from "react";
import type { Rec } from "@/data/mock";
import { SPORTS } from "@/data/mock";
import { inr, useStore } from "@/lib/store";
import { Badge, DemoTag, Empty, Icon, Img, Modal, statusTone } from "./kit";
import { RegisterForm } from "./site";

export function AcademyBrowser({ limit }: { limit?: number }) {
  const { db } = useStore();
  const [sport, setSport] = useState(""); const [loc, setLoc] = useState(""); const [type, setType] = useState("");
  const [shown, setShown] = useState(limit ?? 6);
  const [view, setView] = useState<Rec | null>(null); const [enq, setEnq] = useState<Rec | null>(null);
  const list = db.academies.filter((a) => (!sport || a.sport === sport) && (!loc || a.state === loc || a.city === loc) && (!type || a.type === type));
  const states = [...new Set(db.academies.map((a) => a.state))]; const types = [...new Set(db.academies.map((a) => a.type))];
  return (
    <div>
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <select aria-label="Filter by sport" className="field" value={sport} onChange={(e) => setSport(e.target.value)}><option value="">All sports</option>{SPORTS.map((s) => <option key={s}>{s}</option>)}</select>
        <select aria-label="Filter by location" className="field" value={loc} onChange={(e) => setLoc(e.target.value)}><option value="">All locations</option>{states.map((s) => <option key={s}>{s}</option>)}</select>
        <select aria-label="Filter by academy type" className="field" value={type} onChange={(e) => setType(e.target.value)}><option value="">All types</option>{types.map((s) => <option key={s}>{s}</option>)}</select>
      </div>
      {list.length === 0 ? <Empty text="No academies match these filters." /> : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.slice(0, shown).map((a) => (
            <article key={a.id} className="card card-lift overflow-hidden">
              <Img k={a.img} alt={a.name} className="aspect-[16/9] w-full" />
              <div className="p-5">
                <div className="flex items-center justify-between gap-2"><Badge tone="navy">{a.sport}</Badge><Badge tone={statusTone(a.status)}>Admission: {a.status}</Badge></div>
                <h3 className="mt-3 text-xl font-bold">{a.name}</h3>
                <p className="flex items-center gap-1 text-sm text-muted-foreground"><Icon name="pin" className="h-4 w-4" />{a.city}, {a.state}</p>
                <p className="mt-2 text-sm"><b>Programs:</b> {a.programs}</p>
                <p className="text-sm"><b>Coach:</b> {a.coach}</p>
                <div className="mt-4 flex gap-2"><button className="btn btn-outline flex-1" onClick={() => setView(a)}>View details</button><button className="btn btn-primary flex-1" onClick={() => setEnq(a)}>Enquire now</button></div>
              </div>
            </article>
          ))}
        </div>
      )}
      {list.length > shown && <div className="mt-6 text-center"><button className="btn btn-outline" onClick={() => setShown((s) => s + 6)}>Load more</button></div>}
      <Modal open={!!view} onClose={() => setView(null)} title={view?.name ?? ""} wide>
        {view && <div className="space-y-3"><Img k={view.img} alt={view.name} className="aspect-[16/7] w-full rounded-xl" /><DemoTag /><p><b>Sport:</b> {view.sport} · <b>Type:</b> {view.type}</p><p><b>Location:</b> {view.city}, {view.state}</p><p><b>Head coach:</b> {view.coach}</p><p><b>Programs:</b> {view.programs}</p><p><b>Batches:</b> Mon–Sat, 6–7:30 AM & 5–6:30 PM (sample)</p><p><b>Branches:</b> {db.branches.filter((b) => b.academy === view.name).map((b) => b.name).join(", ") || "Main centre only"}</p><div className="flex gap-2"><button className="btn btn-primary" onClick={() => { setEnq(view); setView(null); }}>Book a trial class</button></div></div>}
      </Modal>
      <Modal open={!!enq} onClose={() => setEnq(null)} title={`Enquire — ${enq?.name ?? ""}`}>
        {enq && <RegisterForm title={enq.name} kind="Admission enquiry" extra={[{ name: "type", label: "Enquiry type", type: "select", options: ["Admission", "Trial class", "Fees"], required: true }, { name: "msg", label: "Message", type: "textarea" }]} onDone={() => setEnq(null)} />}
      </Modal>
    </div>
  );
}

export function ChampionshipList({ limit }: { limit?: number }) {
  const { db } = useStore();
  const [sel, setSel] = useState<Rec | null>(null); const [reg, setReg] = useState(false);
  const [status, setStatus] = useState("");
  const list = db.championships.filter((c) => !status || c.status === status).slice(0, limit ?? 99);
  return (
    <div>
      {!limit && <div className="mb-5 flex flex-wrap gap-2">{["", "Open", "Upcoming", "Live Demo", "Completed"].map((s) => <button key={s} onClick={() => setStatus(s)} aria-pressed={status === s} className={`rounded-full border px-4 py-1.5 text-sm font-semibold ${status === s ? "border-primary bg-primary text-primary-foreground" : ""}`}>{s || "All"}</button>)}</div>}
      {list.length === 0 ? <Empty /> : <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {list.map((c) => (
          <article key={c.id} className="card card-lift flex flex-col overflow-hidden">
            <div className="relative"><Img k={c.img} alt={c.title} className="aspect-[16/9] w-full" /><div className="absolute left-3 top-3"><Badge tone={statusTone(c.status)}>{c.status}</Badge></div></div>
            <div className="flex flex-1 flex-col p-5">
              <p className="text-xs font-bold uppercase text-primary">{c.sport}</p>
              <h3 className="mt-1 text-xl font-bold">{c.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{c.venue}</p>
              <dl className="mt-3 grid grid-cols-2 gap-1 text-sm"><dt className="text-muted-foreground">Date</dt><dd>{c.date}</dd><dt className="text-muted-foreground">Deadline</dt><dd>{c.deadline}</dd><dt className="text-muted-foreground">Categories</dt><dd>{c.categories}</dd></dl>
              <div className="mt-auto flex gap-2 pt-4"><button className="btn btn-outline flex-1" onClick={() => { setSel(c); setReg(false); }}>View details</button><button disabled={c.status === "Completed"} className="btn btn-primary flex-1" onClick={() => { setSel(c); setReg(true); }}>Register now</button></div>
            </div>
          </article>
        ))}
      </div>}
      <Modal open={!!sel} onClose={() => setSel(null)} title={sel?.title ?? ""} wide>
        {sel && (reg ? (
          <RegisterForm title={sel.title} kind="Championship registration" fee={sel.fee} extra={[{ name: "category", label: "Category", type: "select", options: String(sel.categories).split(",").map((s) => s.trim()), required: true }, { name: "academy", label: "Academy / Club" }]} onDone={() => setSel(null)} />
        ) : (
          <div className="space-y-3">
            <DemoTag>Sample event</DemoTag>
            <p><b>Sport:</b> {sel.sport} · <b>Venue:</b> {sel.venue}</p><p><b>Date:</b> {sel.date} · <b>Registration deadline:</b> {sel.deadline}</p><p><b>Categories:</b> {sel.categories}</p><p><b>Entry fee (demo):</b> {inr(sel.fee)}</p>
            <h4 className="pt-2 text-lg font-bold uppercase">Fixtures & results</h4>
            {db.fixtures.filter((f) => f.championship === sel.title).map((f) => <div key={f.id} className="flex justify-between rounded-md bg-muted p-3 text-sm"><span>{f.match}: {f.players}</span><span className="font-semibold">{f.result}</span></div>)}
            {!db.fixtures.some((f) => f.championship === sel.title) && <p className="text-sm text-muted-foreground">Draws will be published after registration closes.</p>}
            {sel.status !== "Completed" && <button className="btn btn-primary" onClick={() => setReg(true)}>Register now</button>}
          </div>
        ))}
      </Modal>
    </div>
  );
}

export function CourseCard({ c, onOpen }: { c: Rec; onOpen: () => void }) {
  return (
    <article className="card card-lift flex flex-col overflow-hidden">
      <Img k={c.img} alt={c.title} className="aspect-[16/9] w-full" />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex justify-between gap-2"><Badge tone="navy">{c.category}</Badge><Badge tone={c.fee ? "warn" : "ok"}>{c.fee ? "Premium" : "Free"}</Badge></div>
        <h3 className="mt-3 text-xl font-bold">{c.title}</h3>
        <p className="text-sm text-muted-foreground">by {c.instructor}</p>
        <p className="mt-2 text-sm">{c.duration} · {c.level}</p>
        <div className="mt-auto flex items-center justify-between pt-4"><span className="text-lg font-bold">{c.fee ? inr(c.fee) : "Free"}</span><button onClick={onOpen} className="btn btn-primary">{c.status === "Enrolling" ? "View & enroll" : c.status}</button></div>
      </div>
    </article>
  );
}

export function ProgramGrid() {
  const { db, upsert, toast } = useStore();
  const [sel, setSel] = useState<Rec | null>(null);
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {db.programs.map((p) => (
          <button key={p.id} onClick={() => setSel(p)} className="card card-lift group p-5 text-left">
            <span className="mb-3 grid h-10 w-10 place-items-center rounded-lg bg-accent text-accent-foreground"><Icon name="dumbbell" /></span>
            <h3 className="text-lg font-bold">{p.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-accent-foreground">Details <Icon name="arrow" className="h-4 w-4" /></span>
          </button>
        ))}
      </div>
      <Modal open={!!sel} onClose={() => setSel(null)} title={sel?.name ?? ""}>
        {sel && <div className="space-y-3">
          <Img k="gym" alt={sel.name} className="aspect-[16/8] w-full rounded-xl" />
          <p>{sel.desc}</p><p><b>Schedule:</b> {sel.schedule}</p><p><b>Trainer:</b> {sel.trainer}</p>
          <p><b>Capacity:</b> {sel.booked}/{sel.capacity} booked</p>
          <div className="h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-primary" style={{ width: `${(sel.booked / sel.capacity) * 100}%` }} /></div>
          <p className="text-sm text-muted-foreground">Nutrition guidance: balanced protein intake, hydration and sleep are covered in program sessions (general content, not medical advice).</p>
          <button disabled={sel.booked >= sel.capacity} className="btn btn-primary w-full" onClick={() => { const u = { ...sel, booked: sel.booked + 1 }; upsert("programs", u); setSel(u); toast(`Session booked: ${sel.name} (demo)`); }}>{sel.booked >= sel.capacity ? "Fully booked" : "Book a session"}</button>
        </div>}
      </Modal>
    </>
  );
}

export function VideoGrid({ limit, filter }: { limit?: number; filter?: string }) {
  const { db } = useStore();
  const [sel, setSel] = useState<Rec | null>(null);
  const list = useMemo(() => db.videos.filter((v) => !filter || v.category === filter).slice(0, limit ?? 99), [db.videos, filter, limit]);
  return (
    <>
      {list.length === 0 ? <Empty /> : <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {list.map((v) => (
          <button key={v.id} onClick={() => setSel(v)} className="group relative overflow-hidden rounded-xl text-left" aria-label={`Play ${v.title}`}>
            <Img k={v.img} alt="" className={`w-full transition-transform duration-500 group-hover:scale-105 ${v.type === "reel" ? "aspect-[9/14]" : "aspect-[9/14]"}`} />
            <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/30 to-transparent" />
            <span className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg"><Icon name="play" filled /></span>
            <div className="absolute bottom-0 p-3 text-navy-foreground"><p className="text-[11px] font-bold uppercase text-primary">{v.category}</p><p className="text-sm font-semibold leading-tight">{v.title}</p><p className="text-xs opacity-70">{v.views.toLocaleString("en-IN")} views</p></div>
          </button>
        ))}
      </div>}
      <VideoModal v={sel} onClose={() => setSel(null)} />
    </>
  );
}

export function VideoModal({ v, onClose }: { v: Rec | null; onClose: () => void }) {
  const [playing, setPlaying] = useState(false);
  if (!v) return null;
  return (
    <Modal open onClose={() => { setPlaying(false); onClose(); }} title={v.title} wide>
      <div className="relative overflow-hidden rounded-xl bg-navy">
        <Img k={v.img} alt={v.title} className={`aspect-video w-full ${playing ? "opacity-40" : ""}`} />
        <button onClick={() => setPlaying((p) => !p)} className="absolute inset-0 grid place-items-center text-navy-foreground" aria-label={playing ? "Pause demo" : "Play demo"}>
          {playing ? <span className="rounded-lg bg-navy/80 px-4 py-2 text-sm">Demo player — video streaming not configured</span> : <span className="grid h-16 w-16 place-items-center rounded-full bg-primary text-primary-foreground"><Icon name="play" filled className="h-7 w-7" /></span>}
        </button>
        {playing && <div className="absolute bottom-0 left-0 h-1 w-full bg-navy-2"><div className="h-1 w-1/3 animate-pulse bg-primary" /></div>}
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{v.creator} · {v.category} · {v.views.toLocaleString("en-IN")} views</p>
    </Modal>
  );
}

export function NewsGrid({ limit }: { limit?: number }) {
  const { db } = useStore();
  const [cat, setCat] = useState(""); const [sel, setSel] = useState<Rec | null>(null); const [shown, setShown] = useState(limit ?? 6);
  const cats = [...new Set(db.news.map((n) => n.category))];
  const list = db.news.filter((n) => !cat || n.category === cat);
  return (
    <>
      {!limit && <div className="mb-5 flex flex-wrap gap-2">{["", ...cats].map((s) => <button key={s} onClick={() => setCat(s)} aria-pressed={cat === s} className={`rounded-full border px-3 py-1 text-sm font-semibold ${cat === s ? "border-primary bg-primary text-primary-foreground" : ""}`}>{s || "All"}</button>)}</div>}
      {list.length === 0 ? <Empty /> : <div className="grid gap-5 md:grid-cols-3">
        {list.slice(0, shown).map((n) => (
          <article key={n.id} className="card card-lift overflow-hidden">
            <Img k={n.img} alt={n.title} className="aspect-[16/9] w-full" />
            <div className="p-5"><p className="text-xs font-bold uppercase text-primary">{n.category} · {n.date}</p><h3 className="mt-2 text-xl font-bold leading-tight">{n.title}</h3><p className="mt-2 text-sm text-muted-foreground">{n.summary}</p><button onClick={() => setSel(n)} className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-accent-foreground">Read more <Icon name="arrow" className="h-4 w-4" /></button></div>
          </article>
        ))}
      </div>}
      {!limit && list.length > shown && <div className="mt-6 text-center"><button className="btn btn-outline" onClick={() => setShown((s) => s + 6)}>Load more</button></div>}
      <Modal open={!!sel} onClose={() => setSel(null)} title={sel?.title ?? ""} wide>
        {sel && <article className="space-y-3"><Img k={sel.img} alt={sel.title} className="aspect-[16/7] w-full rounded-xl" /><p className="text-sm text-muted-foreground">{sel.category} · {sel.date}</p><DemoTag>Sample article</DemoTag><p>{sel.summary}</p><p>{sel.body}</p><ShareBar text={sel.title} /></article>}
      </Modal>
    </>
  );
}

export function ShareBar({ text }: { text: string }) {
  const { toast } = useStore();
  const url = typeof window !== "undefined" ? window.location.href : "";
  const share = async () => {
    if (navigator.share) { try { await navigator.share({ title: text, url }); } catch {} }
    else copy();
  };
  const copy = async () => { try { await navigator.clipboard.writeText(url); toast("Link copied"); } catch { toast("Copy not supported in this browser", "err"); } };
  return (
    <div className="flex flex-wrap gap-2">
      <button className="btn btn-outline !py-1.5" onClick={share}><Icon name="share" className="h-4 w-4" />Share</button>
      <button className="btn btn-outline !py-1.5" onClick={copy}>Copy link</button>
      <a className="btn btn-outline !py-1.5" target="_blank" rel="noreferrer" href={`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`}>WhatsApp</a>
    </div>
  );
}
