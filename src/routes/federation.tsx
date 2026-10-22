import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { DemoTag, Modal, PageHero, QrMock, Section } from "@/components/kit";
import { RegisterForm, Site, StatusPill, seo } from "@/components/site";
import type { Rec } from "@/data/mock";

export const Route = createFileRoute("/federation")({
  head: () => seo("Federation", "Federation hierarchy, academy affiliations, memberships, belt grading, KALAWAR Anukkama 12 Forms, examinations and certification."),
  component: Federation,
});

function Federation() {
  const { db } = useStore();
  const [exam, setExam] = useState<Rec | null>(null);
  const [aff, setAff] = useState(false);
  const [card, setCard] = useState<Rec | null>(null);
  const kpi = [["Total members", db.members.length], ["Pending affiliations", db.affiliations.filter((a) => a.status === "Pending").length], ["Upcoming exams", db.exams.length], ["Active memberships", db.members.filter((m) => m.status === "Active").length], ["Upcoming championships", db.championships.filter((c) => c.status !== "Completed").length]];
  return (
    <Site>
      <PageHero title="Federation" sub="National → State → District → Academy. All figures below are generated from sample data." img="martial" />
      <Section title="Federation dashboard" action={<DemoTag />}>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">{kpi.map(([l, v]) => <div key={l} className="card p-5"><p className="text-sm text-muted-foreground">{l}</p><p className="font-display text-4xl font-bold">{v}</p></div>)}</div>
      </Section>
      <Section tone="muted" title="Hierarchy">
        <div className="grid gap-3 md:grid-cols-3">{["National", "State", "District"].map((lv) => <div key={lv} className="card p-5"><p className="mb-2 text-xs font-bold uppercase text-primary">{lv}</p>{db.hierarchy.filter((h) => h.level === lv).map((h) => <p key={h.id} className="py-1 font-semibold">{h.name}</p>)}</div>)}</div>
      </Section>
      <Section title="Academy affiliations" action={<button className="btn btn-primary" onClick={() => setAff(true)}>Apply / renew affiliation</button>}>
        <div className="grid gap-3 md:grid-cols-2">{db.affiliations.map((a) => <div key={a.id} className="card flex items-center justify-between p-4"><div><p className="font-semibold">{a.academy}</p><p className="text-xs text-muted-foreground">Applied {a.applied} · Expiry {a.expiry}</p></div><StatusPill s={a.status} /></div>)}</div>
      </Section>
      <Section tone="muted" title="Members & digital ID cards">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{db.members.map((m) => <button key={m.id} onClick={() => setCard(m)} className="card card-lift p-4 text-left"><p className="font-bold">{m.name}</p><p className="text-xs text-muted-foreground">{m.id} · {m.sport}</p><div className="mt-2 flex justify-between"><span className="text-sm">Belt: {m.belt}</span><StatusPill s={m.status} /></div></button>)}</div>
      </Section>
      <Section title="KALAWAR Anukkama 12 Forms" sub="Syllabus of forms mapped to belt levels (sample syllabus).">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">{db.forms.map((f) => <div key={f.id} className="card p-4"><p className="font-display text-2xl font-bold text-primary">{f.id.replace("AN", "")}</p><p className="text-sm font-semibold">{f.name}</p><p className="text-xs text-muted-foreground">{f.belt} · {f.moves} moves</p></div>)}</div>
      </Section>
      <Section tone="muted" title="Examinations" sub="Belt exams, Black Belt, Dan grading and referee certification.">
        <div className="grid gap-4 md:grid-cols-2">{db.exams.map((e) => <div key={e.id} className="card flex flex-wrap items-center justify-between gap-3 p-5"><div><p className="text-xs font-bold uppercase text-primary">{e.type}</p><p className="font-bold">{e.title}</p><p className="text-sm text-muted-foreground">{e.date} · {e.venue}</p></div><button className="btn btn-primary" onClick={() => setExam(e)}>Register</button></div>)}</div>
        <h3 className="mb-3 mt-10 text-2xl font-bold uppercase">Results</h3>
        <div className="space-y-2">{db.results.map((r) => <div key={r.id} className="card flex justify-between p-4 text-sm"><span><b>{r.member}</b> — {r.exam}</span><span>{r.score}% · <StatusPill s={r.result} /></span></div>)}</div>
        <h3 className="mb-3 mt-10 text-2xl font-bold uppercase">Belt history</h3>
        <div className="space-y-2">{db.belts.map((b) => <div key={b.id} className="card p-4 text-sm"><b>{b.member}</b>: {b.from} → {b.to} on {b.date} (examiner {b.examiner})</div>)}</div>
        <div className="mt-8"><Link to="/verify" className="btn btn-navy">Verify a certificate</Link></div>
      </Section>
      <Section title="Coaches, referees & officials">
        <div className="grid gap-3 md:grid-cols-3">{[...db.referees.map((r) => ({ ...r, role: `Referee · ${r.level}` })), ...db.officials].map((r) => <div key={r.id} className="card p-4"><p className="font-bold">{r.name}</p><p className="text-sm text-muted-foreground">{r.role} · {r.sport}</p><StatusPill s={r.status} /></div>)}</div>
      </Section>
      <Modal open={!!exam} onClose={() => setExam(null)} title={exam?.title ?? ""}>{exam && <RegisterForm title={exam.title} kind="Examination enrollment" fee={exam.fee} extra={[{ name: "memberId", label: "Membership number", placeholder: "KS-M-1001", required: true }, { name: "belt", label: "Current belt", type: "select", options: ["White", "Yellow", "Green", "Blue", "Red", "Brown", "Black"] }]} onDone={() => setExam(null)} />}</Modal>
      <Modal open={aff} onClose={() => setAff(false)} title="Affiliation application">{aff && <RegisterForm title="Affiliation" kind="Affiliation application" extra={[{ name: "academy", label: "Academy name", required: true }, { name: "action", label: "Request", type: "select", options: ["New affiliation", "Renewal"], required: true }]} onDone={() => setAff(false)} />}</Modal>
      <Modal open={!!card} onClose={() => setCard(null)} title="Digital ID card">{card && (
        <div className="overflow-hidden rounded-2xl bg-navy text-navy-foreground">
          <div className="flex items-center justify-between bg-primary px-5 py-3 text-primary-foreground"><span className="font-display text-lg font-extrabold">KALAWAR SPORTS</span><span className="text-xs font-bold">DEMO ID</span></div>
          <div className="flex gap-4 p-5"><div className="flex-1 space-y-1 text-sm"><p className="text-xl font-bold">{card.name}</p><p>{card.id}</p><p>{card.sport} · {card.belt} belt</p><p>{card.academy}</p><p>Valid till {card.expiry}</p></div><QrMock text={card.id} /></div>
          <p className="px-5 pb-4 text-[11px] opacity-60">Demonstration card — not an official credential. Verification code is illustrative.</p>
        </div>
      )}</Modal>
    </Site>
  );
}
