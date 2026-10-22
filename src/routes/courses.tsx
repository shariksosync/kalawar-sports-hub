import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { inr, uid, useStore } from "@/lib/store";
import { DemoTag, Empty, Icon, Modal, PageHero, Section } from "@/components/kit";
import { RegisterForm, Site, seo } from "@/components/site";
import { CourseCard } from "@/components/cards";
import type { Rec } from "@/data/mock";

export const Route = createFileRoute("/courses")({
  head: () => seo("Courses & Certification", "Martial arts, fitness, coach and referee courses with lessons, assessments and demo certificates."),
  component: Courses,
});

const QUIZ = [
  { q: "What should come first in every training session?", a: ["Warm-up", "Sparring", "Cool-down"], c: 0 },
  { q: "Proper hydration helps…", a: ["Performance & recovery", "Nothing", "Only in summer"], c: 0 },
  { q: "A referee's first priority is…", a: ["Athlete safety", "Speed", "Crowd"], c: 0 },
];

function Courses() {
  const { db, upsert, toast, user } = useStore();
  const [q, setQ] = useState(""); const [cat, setCat] = useState(""); const [sel, setSel] = useState<Rec | null>(null);
  const [enroll, setEnroll] = useState(false); const [lesson, setLesson] = useState(0); const [quiz, setQuiz] = useState<number[]>([]); const [cert, setCert] = useState<Rec | null>(null);
  const cats = [...new Set(db.courses.map((c) => c.category))];
  const list = db.courses.filter((c) => (!cat || c.category === cat) && c.title.toLowerCase().includes(q.toLowerCase()));
  const prog = sel ? (db.learning ?? []).find((l) => l.course === sel.id) : null;
  const done: number[] = prog?.done ?? [];
  const mods = sel ? String(sel.modules).split("|") : [];
  const markDone = (i: number) => { const d = [...new Set([...done, i])]; upsert("learning", { id: prog?.id ?? uid("LRN"), course: sel!.id, title: sel!.title, done: d }); };
  const submitQuiz = () => {
    const score = quiz.filter((x, i) => x === QUIZ[i].c).length;
    if (quiz.length < QUIZ.length) return toast("Answer all questions", "err");
    if (score < 2) return toast(`Score ${score}/3 — try again`, "err");
    const num = `KS-CERT-DEMO-${Date.now().toString().slice(-6)}`;
    const c = { id: num, name: user?.name ?? "Demo Learner", title: sel!.title, issued: new Date().toISOString().slice(0, 10), status: "Valid (demo)" };
    upsert("certificates", c); setCert(c); toast("Demo certificate generated");
  };
  return (
    <Site>
      <PageHero title="Courses & Certification" sub="Learn, assess and earn demonstration certificates." img="martial" />
      <Section title="Course catalogue">
        <div className="mb-6 grid gap-3 sm:grid-cols-[1fr_220px]"><input aria-label="Search courses" placeholder="Search courses…" className="field" value={q} onChange={(e) => setQ(e.target.value)} /><select aria-label="Category" className="field" value={cat} onChange={(e) => setCat(e.target.value)}><option value="">All categories</option>{cats.map((c) => <option key={c}>{c}</option>)}</select></div>
        {list.length ? <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">{list.map((c) => <CourseCard key={c.id} c={c} onOpen={() => { setSel(c); setLesson(0); setQuiz([]); setCert(null); setEnroll(false); }} />)}</div> : <Empty text="No courses match." />}
      </Section>
      <Section tone="muted" title="My learning (demo)">
        {(db.learning ?? []).length ? <div className="grid gap-3 md:grid-cols-3">{db.learning.map((l) => <div key={l.id} className="card p-4"><p className="font-semibold">{l.title}</p><div className="mt-2 h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-success" style={{ width: `${(l.done.length / 4) * 100}%` }} /></div><p className="mt-1 text-xs">{l.done.length}/4 modules</p></div>)}</div> : <Empty text="Open a course and complete a lesson to track progress." />}
        <div className="mt-6"><Link to="/verify" className="btn btn-navy">Verify a certificate</Link></div>
      </Section>
      <Modal open={!!sel} onClose={() => setSel(null)} title={sel?.title ?? ""} wide>
        {sel && (enroll ? <RegisterForm title={sel.title} kind="Course enrollment" fee={sel.fee || undefined} onDone={() => setEnroll(false)} /> : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">{sel.instructor} · {sel.duration} · {sel.level} · {sel.fee ? inr(sel.fee) : "Free"}</p>
            <div className="relative grid aspect-video place-items-center rounded-xl bg-navy text-navy-foreground"><div className="text-center"><Icon name="play" filled className="mx-auto h-10 w-10 text-primary" /><p className="mt-2 font-semibold">Lesson {lesson + 1}: {mods[lesson]}</p><p className="text-xs opacity-60">Mock lesson player — video hosting not configured</p></div></div>
            <div className="flex items-center gap-2"><div className="h-2 flex-1 rounded-full bg-muted"><div className="h-2 rounded-full bg-primary" style={{ width: `${(done.length / mods.length) * 100}%` }} /></div><span className="text-sm font-semibold">{done.length}/{mods.length}</span></div>
            <ol className="grid gap-2 sm:grid-cols-2">{mods.map((m, i) => <li key={m}><button onClick={() => setLesson(i)} className={`flex w-full items-center justify-between rounded-lg border p-3 text-left text-sm ${lesson === i ? "border-primary" : ""}`}>{i + 1}. {m}{done.includes(i) && <Icon name="check" className="h-4 w-4 text-success" />}</button></li>)}</ol>
            <div className="flex flex-wrap gap-2"><button className="btn btn-primary" onClick={() => { markDone(lesson); if (lesson < mods.length - 1) setLesson(lesson + 1); }}>Mark lesson complete</button><button className="btn btn-outline" onClick={() => setEnroll(true)} disabled={sel.status !== "Enrolling"}>Enroll</button><button className="btn btn-outline" onClick={() => toast("Study material download — placeholder in demo")}>Study material (PDF)</button></div>
            {done.length === mods.length && !cert && (
              <div className="rounded-xl border p-4"><h4 className="mb-2 text-lg font-bold uppercase">Final assessment</h4>{QUIZ.map((x, i) => <fieldset key={i} className="mb-3"><legend className="text-sm font-semibold">{i + 1}. {x.q}</legend><div className="mt-1 flex flex-wrap gap-3">{x.a.map((a, j) => <label key={a} className="flex items-center gap-1 text-sm"><input type="radio" name={`q${i}`} checked={quiz[i] === j} onChange={() => { const n = [...quiz]; n[i] = j; setQuiz(n); }} />{a}</label>)}</div></fieldset>)}<button className="btn btn-primary" onClick={submitQuiz}>Submit assessment</button></div>
            )}
            {cert && <div className="rounded-xl border-4 border-double border-primary p-6 text-center"><DemoTag>Demonstration certificate — not an official credential</DemoTag><p className="mt-3 font-display text-2xl font-bold">Certificate of Completion</p><p className="mt-2">{cert.name}</p><p className="font-semibold">{cert.title}</p><p className="mt-2 text-sm text-muted-foreground">No. {cert.id} · {cert.issued}</p></div>}
          </div>
        ))}
      </Modal>
    </Site>
  );
}
