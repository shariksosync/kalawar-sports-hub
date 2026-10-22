import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { inr, useStore } from "@/lib/store";
import { Badge, DemoTag, Img, Modal, PageHero, Section } from "@/components/kit";
import { RegisterForm, Site, StatusPill, seo } from "@/components/site";
import { ProgramGrid } from "@/components/cards";
import type { Rec } from "@/data/mock";

export const Route = createFileRoute("/gym")({
  head: () => seo("Gym & Fitness", "Gym memberships, fitness programs, group classes, trainers, BMI calculator and progress tracking."),
  component: Gym,
});

function Gym() {
  const { db, upsert, toast } = useStore();
  const [plan, setPlan] = useState<Rec | null>(null);
  const [gym, setGym] = useState<Rec | null>(null);
  const [regGym, setRegGym] = useState(false);
  const [h, setH] = useState("175"); const [w, setW] = useState("72");
  const bmi = +h > 0 && +w > 0 ? +w / ((+h / 100) ** 2) : 0;
  const bmiLabel = bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : bmi < 30 ? "Overweight" : "Obese";
  const book = (c: Rec) => { if (c.booked >= c.capacity) return toast("Class is full", "err"); upsert("classes", { ...c, booked: c.booked + 1 }); toast(`Booked ${c.name} (demo)`); };
  return (
    <Site>
      <PageHero title="Gym & Fitness" sub="Memberships, programs, classes and progress — all in one place." img="gym" />
      <Section title="Fitness programs"><ProgramGrid /></Section>
      <Section tone="muted" title="Membership plans" action={<DemoTag>Demo prices</DemoTag>}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{db.plans.filter((p) => p.kind === "Gym").map((p, i) => <div key={p.id} className={`card p-6 ${i === 3 ? "ring-2 ring-primary" : ""}`}><p className="text-sm font-bold uppercase text-primary">{p.name}</p><p className="mt-2 font-display text-4xl font-bold">{inr(p.price)}</p><p className="text-sm text-muted-foreground">{p.duration}</p><button className="btn btn-primary mt-5 w-full" onClick={() => setPlan(p)}>Choose plan</button></div>)}</div>
      </Section>
      <Section title="Gym directory" action={<button className="btn btn-primary" onClick={() => setRegGym(true)}>Register a gym</button>}>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{db.gyms.map((g) => <article key={g.id} className="card card-lift overflow-hidden"><Img k="gym" alt={g.name} className="aspect-[16/9] w-full" /><div className="p-5"><div className="flex justify-between"><h3 className="text-xl font-bold">{g.name}</h3><StatusPill s={g.status} /></div><p className="text-sm text-muted-foreground">{g.city}, {g.state} · {g.branches} branch(es)</p><button className="btn btn-outline mt-4 w-full" onClick={() => setGym(g)}>View gym</button></div></article>)}</div>
      </Section>
      <Section tone="muted" title="Group classes">
        <div className="grid gap-4 md:grid-cols-3">{db.classes.map((c) => <div key={c.id} className="card p-5"><p className="font-bold">{c.name}</p><p className="text-sm text-muted-foreground">{c.gym} · {c.time}</p><div className="my-3 h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-primary" style={{ width: `${Math.min(100, (c.booked / c.capacity) * 100)}%` }} /></div><p className="text-xs">{c.booked}/{c.capacity} booked</p><button disabled={c.booked >= c.capacity} className="btn btn-primary mt-3 w-full" onClick={() => book(c)}>{c.booked >= c.capacity ? "Full" : "Book class"}</button></div>)}</div>
      </Section>
      <Section title="Trainers">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{db.trainers.map((t) => <div key={t.id} className="card p-5"><span className="mb-3 grid h-14 w-14 place-items-center rounded-full bg-navy font-display text-xl font-bold text-primary">{t.name.split(" ").map((x: string) => x[0]).join("")}</span><p className="font-bold">{t.name}</p><p className="text-sm text-muted-foreground">{t.specialty}</p><p className="text-xs">{t.city} · {t.experience}</p></div>)}</div>
      </Section>
      <Section tone="muted" title="BMI & progress">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="card p-6">
            <h3 className="mb-4 text-xl font-bold uppercase">BMI calculator</h3>
            <div className="grid grid-cols-2 gap-3"><label className="text-sm font-semibold">Height (cm)<input type="number" className="field mt-1" value={h} onChange={(e) => setH(e.target.value)} /></label><label className="text-sm font-semibold">Weight (kg)<input type="number" className="field mt-1" value={w} onChange={(e) => setW(e.target.value)} /></label></div>
            <p className="mt-4 font-display text-5xl font-bold">{bmi ? bmi.toFixed(1) : "—"}</p>{bmi > 0 && <Badge tone={bmiLabel === "Normal" ? "ok" : "warn"}>{bmiLabel}</Badge>}
            <p className="mt-2 text-xs text-muted-foreground">General guidance only, not medical advice.</p>
          </div>
          <div className="card p-6">
            <h3 className="mb-4 text-xl font-bold uppercase">Weight trend (sample member)</h3>
            <svg viewBox="0 0 300 120" className="w-full" role="img" aria-label="Weight trend chart">
              {db.progress.map((p, i, a) => { const x = 30 + i * (240 / Math.max(1, a.length - 1)); const y = 110 - (p.weight - 70) * 4; return <g key={p.id}>{i > 0 && <line x1={30 + (i - 1) * (240 / (a.length - 1))} y1={110 - (a[i - 1].weight - 70) * 4} x2={x} y2={y} className="stroke-primary" strokeWidth={3} />}<circle cx={x} cy={y} r={5} className="fill-navy" /><text x={x} y={y - 10} textAnchor="middle" className="fill-foreground text-[10px]">{p.weight}kg</text></g>; })}
            </svg>
          </div>
        </div>
      </Section>
      <Modal open={!!plan} onClose={() => setPlan(null)} title={`${plan?.name ?? ""} membership`}>{plan && <RegisterForm title={`Gym membership — ${plan.name}`} kind="Gym membership" fee={plan.price} extra={[{ name: "gym", label: "Gym", type: "select", options: db.gyms.map((g) => g.name), required: true }, { name: "pt", label: "Personal training", type: "select", options: ["No", "Yes — 8 sessions", "Yes — 16 sessions"] }]} onDone={() => setPlan(null)} />}</Modal>
      <Modal open={!!gym} onClose={() => setGym(null)} title={gym?.name ?? ""}>{gym && <div className="space-y-2"><DemoTag /><p><b>Owner:</b> {gym.owner}</p><p><b>Location:</b> {gym.city}, {gym.state}</p><p><b>Branches:</b> {gym.branches}</p><p><b>Classes:</b> {db.classes.filter((c) => c.gym === gym.name).map((c) => c.name).join(", ") || "Ask at front desk"}</p><p className="text-xs text-muted-foreground">No biometric or access-control hardware is connected in this demo.</p></div>}</Modal>
      <Modal open={regGym} onClose={() => setRegGym(false)} title="Gym registration">{regGym && <RegisterForm title="New gym" kind="Gym registration" extra={[{ name: "gym", label: "Gym name", required: true }, { name: "city", label: "City", required: true }, { name: "branches", label: "Number of branches", type: "number" }]} onDone={() => setRegGym(false)} />}</Modal>
    </Site>
  );
}
