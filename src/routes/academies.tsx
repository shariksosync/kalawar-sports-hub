import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { Badge, DemoTag, Icon, Img, Modal, PageHero, Section } from "@/components/kit";
import { RegisterForm, Site, seo } from "@/components/site";
import { AcademyBrowser } from "@/components/cards";
import { SPORTS, type Rec } from "@/data/mock";

export const Route = createFileRoute("/academies")({
  head: () =>
    seo(
      "Sports Academies",
      "Find multi-sport academies for karate, cricket, football, kabaddi, swimming and more — admissions, batches, rankings and trial classes."
    ),
  component: Academies,
});

function Academies() {
  const { db } = useStore();
  const [sport, setSport] = useState<string | null>(null);
  const [reg, setReg] = useState(false);

  return (
    <Site>
      <PageHero
        title="Multi-Sports Academies"
        sub="Admissions, batches, coaches, rankings, and skill progression across combat, team, and aquatic sports."
      />

      {/* Sports Categories */}
      <Section
        title="Sports Categories"
        eyebrow="Disciplines"
        sub="KALAWAR Sports supports multi-sport training centers across India."
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {(db.sports ?? []).map((s: Rec) => (
            <button
              key={s.id}
              onClick={() => setSport(s.name)}
              className="card card-lift overflow-hidden text-left"
            >
              <Img k={s.img} alt="" className="aspect-square w-full" />
              <p className="p-2 text-xs font-bold text-foreground truncate">{s.name}</p>
            </button>
          ))}
        </div>
      </Section>

      {/* Academy Directory */}
      <Section
        tone="muted"
        title="Academy Directory & Admissions"
        eyebrow="Affiliated Centers"
        action={
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setReg(true)}
          >
            Register an Academy
          </button>
        }
      >
        <AcademyBrowser />
      </Section>

      {/* Academy Rankings & Achievements Leaderboard (Section C) */}
      <Section
        title="National Academy Rankings & Achievements"
        eyebrow="Performance Index"
        sub="Rankings determined by student tournament participation, championship points, and belt graduations."
        action={<DemoTag>Sample performance audit</DemoTag>}
      >
        <div className="card p-6 shadow-sm overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-xs">
            <thead>
              <tr className="border-b bg-muted/50 text-muted-foreground">
                <th className="p-3 font-bold uppercase">Rank</th>
                <th className="p-3 font-bold uppercase">Academy Name</th>
                <th className="p-3 font-bold uppercase">Primary Sport</th>
                <th className="p-3 font-bold uppercase">Location</th>
                <th className="p-3 font-bold uppercase">Athletes</th>
                <th className="p-3 font-bold uppercase text-center">Medals (🥇 🥈 🥉)</th>
                <th className="p-3 font-bold uppercase text-right">Federation Points</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {(db.academyRankings ?? []).map((ar: Rec, index: number) => (
                <tr key={ar.id} className="hover:bg-muted/30">
                  <td className="p-3 font-display text-lg font-black text-primary">
                    #{index + 1}
                  </td>
                  <td className="p-3 font-bold text-foreground text-sm">{ar.academy}</td>
                  <td className="p-3">
                    <Badge tone="navy">{ar.sport}</Badge>
                  </td>
                  <td className="p-3 text-muted-foreground">{ar.city}</td>
                  <td className="p-3 font-mono font-semibold">{ar.students} enrolled</td>
                  <td className="p-3 text-center font-mono">
                    <span className="text-primary font-bold">{ar.gold}</span> ·{" "}
                    <span>{ar.silver}</span> ·{" "}
                    <span className="text-muted-foreground">{ar.bronze}</span>
                  </td>
                  <td className="p-3 text-right font-display text-base font-bold text-foreground">
                    {ar.points.toLocaleString("en-IN")} pts
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Sports-Specific Skill & Performance Records (Section C) */}
      <Section
        tone="muted"
        title="Student Skill & Performance Assessments"
        eyebrow="Evaluation Standards"
        sub="Standardized technique scores verified by certified examiners and head coaches."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {(db.skillRecords ?? []).map((sk: Rec) => (
            <div key={sk.id} className="card p-5">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-foreground">{sk.member}</h4>
                  <p className="text-xs text-primary font-semibold mt-0.5">{sk.skill}</p>
                </div>
                <Badge tone="ok">
                  {sk.score}/{sk.maxScore}
                </Badge>
              </div>
              <div className="my-3 h-2 rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-primary"
                  style={{ width: `${(sk.score / sk.maxScore) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-muted-foreground">
                Evaluator: {sk.examiner} · {sk.date}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Modals */}
      <Modal open={!!sport} onClose={() => setSport(null)} title={sport ?? ""} wide>
        {sport && (
          <div className="space-y-3">
            <p className="text-muted-foreground">Academies offering {sport} on KALAWAR (sample).</p>
            {(db.academies ?? [])
              .filter((a: Rec) => a.sport === sport)
              .map((a: Rec) => (
                <div key={a.id} className="flex items-center justify-between rounded-lg border p-3">
                  <span>
                    <b>{a.name}</b> — {a.city}
                  </span>
                  <Badge>{a.status}</Badge>
                </div>
              ))}
            {!(db.academies ?? []).some((a: Rec) => a.sport === sport) && (
              <p className="text-sm">No academies listed yet for this sport.</p>
            )}
          </div>
        )}
      </Modal>

      <Modal open={reg} onClose={() => setReg(false)} title="Academy Registration">
        {reg && (
          <RegisterForm
            title="New academy"
            kind="Academy registration"
            extra={[
              { name: "academy", label: "Academy name", required: true },
              { name: "sport", label: "Primary sport", type: "select", options: (db.sports?.map((s: Rec) => s.name) ?? SPORTS), required: true },
              { name: "city", label: "City", required: true },
            ]}
            onDone={() => setReg(false)}
          />
        )}
      </Modal>
    </Site>
  );
}
