import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { Badge, Img, Modal, PageHero, Section } from "@/components/kit";
import { RegisterForm, Site, seo } from "@/components/site";
import { AcademyBrowser } from "@/components/cards";
import { SPORTS } from "@/data/mock";

export const Route = createFileRoute("/academies")({
  head: () => seo("Sports Academies", "Find multi-sport academies for karate, cricket, football, kabaddi, swimming and more — admissions, batches and trial classes."),
  component: Academies,
});

function Academies() {
  const { db } = useStore();
  const [sport, setSport] = useState<string | null>(null);
  const [reg, setReg] = useState(false);
  return (
    <Site>
      <PageHero title="Sports Academies" sub="Admissions, batches, coaches and trial classes across multiple sports." />
      <Section title="Sports categories">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {db.sports.map((s) => <button key={s.id} onClick={() => setSport(s.name)} className="card card-lift overflow-hidden text-left"><Img k={s.img} alt="" className="aspect-square w-full" /><p className="p-2 text-sm font-bold">{s.name}</p></button>)}
        </div>
      </Section>
      <Section tone="muted" title="Academy directory" action={<button className="btn btn-primary" onClick={() => setReg(true)}>Register an academy</button>}><AcademyBrowser /></Section>
      <Modal open={!!sport} onClose={() => setSport(null)} title={sport ?? ""} wide>
        {sport && <div className="space-y-3"><p className="text-muted-foreground">Academies offering {sport} on KALAWAR (sample).</p>{db.academies.filter((a) => a.sport === sport).map((a) => <div key={a.id} className="flex items-center justify-between rounded-lg border p-3"><span><b>{a.name}</b> — {a.city}</span><Badge>{a.status}</Badge></div>)}{!db.academies.some((a) => a.sport === sport) && <p className="text-sm">No academies listed yet for this sport.</p>}</div>}
      </Modal>
      <Modal open={reg} onClose={() => setReg(false)} title="Academy registration">
        <RegisterForm title="New academy" kind="Academy registration" extra={[{ name: "academy", label: "Academy name", required: true }, { name: "sport", label: "Primary sport", type: "select", options: SPORTS, required: true }, { name: "city", label: "City", required: true }]} onDone={() => setReg(false)} />
      </Modal>
    </Site>
  );
}
