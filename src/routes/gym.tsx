import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { inr, uid, useStore } from "@/lib/store";
import { Badge, DemoTag, Icon, Img, Modal, PageHero, Section } from "@/components/kit";
import { RegisterForm, Site, StatusPill, seo } from "@/components/site";
import { ProgramGrid } from "@/components/cards";
import type { Rec } from "@/data/mock";

export const Route = createFileRoute("/gym")({
  head: () =>
    seo(
      "Gym & Fitness",
      "Gym memberships, fitness programs, personal training packages, diet plans, group classes, and body measurement progress tracking."
    ),
  component: Gym,
});

function Gym() {
  const { db, upsert, toast } = useStore();
  const [plan, setPlan] = useState<Rec | null>(null);
  const [gym, setGym] = useState<Rec | null>(null);
  const [regGym, setRegGym] = useState(false);
  const [selectedPt, setSelectedPt] = useState<Rec | null>(null);
  const [selectedDiet, setSelectedDiet] = useState<Rec | null>(null);

  // Body Measurements State
  const [h, setH] = useState("175");
  const [w, setW] = useState("72");
  const [chest, setChest] = useState("98");
  const [waist, setWaist] = useState("82");
  const [bodyFat, setBodyFat] = useState("18");

  const bmi = +h > 0 && +w > 0 ? +w / ((+h / 100) ** 2) : 0;
  const bmiLabel =
    bmi < 18.5
      ? "Underweight"
      : bmi < 25
      ? "Normal"
      : bmi < 30
      ? "Overweight"
      : "Obese";

  const book = (c: Rec) => {
    if (c.booked >= c.capacity) return toast("Class is full", "err");
    upsert("classes", { ...c, booked: c.booked + 1 });
    toast(`Booked ${c.name} (demo)`);
  };

  const handleLogMeasurements = (e: React.FormEvent) => {
    e.preventDefault();
    upsert("progress", {
      id: uid("FP"),
      member: "You",
      date: new Date().toISOString().slice(0, 10),
      weight: +w,
      height: +h,
      bodyFat: +bodyFat,
      chest: +chest,
      waist: +waist,
    });
    toast("Measurements logged to progress history (demo)");
  };

  return (
    <Site>
      <PageHero
        title="Gym & Fitness"
        sub="Memberships, workout programs, diet guidance, personal training, and progress tracking."
        img="gym"
      />

      {/* Fitness Programs Section */}
      <Section
        title="Fitness Programs"
        eyebrow="Specialized Disciplines"
        sub="Tailored regimens for athletic endurance, strength building, and holistic mobility."
      >
        <ProgramGrid />
      </Section>

      {/* Membership Plans */}
      <Section
        tone="muted"
        title="Membership Plans"
        eyebrow="Flexible Options"
        action={<DemoTag>Demo prices</DemoTag>}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(db.plans ?? [])
            .filter((p: Rec) => p.kind === "Gym")
            .map((p: Rec, i: number) => (
              <div
                key={p.id}
                className={`card p-6 flex flex-col justify-between ${
                  i === 3 ? "ring-2 ring-primary" : ""
                }`}
              >
                <div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-bold uppercase tracking-wider text-primary">
                      {p.name}
                    </p>
                    {i === 3 && <Badge tone="ok">Best Value</Badge>}
                  </div>
                  <p className="mt-3 font-display text-4xl font-bold">{inr(p.price)}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{p.duration} unlimited access</p>
                  <ul className="mt-4 space-y-2 text-xs text-muted-foreground border-t pt-3">
                    <li className="flex items-center gap-1.5"><Icon name="check" className="h-3.5 w-3.5 text-success" /> All branch cardio & weights</li>
                    <li className="flex items-center gap-1.5"><Icon name="check" className="h-3.5 w-3.5 text-success" /> Locker & shower facilities</li>
                    <li className="flex items-center gap-1.5"><Icon name="check" className="h-3.5 w-3.5 text-success" /> Free BMI quarterly review</li>
                  </ul>
                </div>
                <button
                  type="button"
                  className="btn btn-primary mt-6 w-full"
                  onClick={() => setPlan(p)}
                >
                  Choose Plan
                </button>
              </div>
            ))}
        </div>
      </Section>

      {/* Diet Plans & Nutrition Guidance (Section B) */}
      <Section
        title="Diet Plans & Nutrition Guidance"
        eyebrow="Fuel Performance"
        sub="Science-backed meal frameworks formulated for strength, recovery, and body recomposition."
        action={<DemoTag>Content guidelines</DemoTag>}
      >
        <div className="grid gap-5 md:grid-cols-3">
          {(db.dietPlans ?? []).map((d: Rec) => (
            <div key={d.id} className="card card-lift p-6 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center">
                  <Badge tone="navy">{d.goal}</Badge>
                  <span className="font-mono text-xs font-bold text-primary">{d.calories}</span>
                </div>
                <h3 className="mt-3 text-xl font-bold text-foreground">{d.title}</h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{d.desc}</p>
                <div className="mt-4 rounded-lg bg-muted/60 p-3 text-xs">
                  <p className="font-semibold text-foreground">Athlete Guidelines:</p>
                  <p className="mt-1 text-muted-foreground">{d.tips}</p>
                </div>
              </div>
              <div className="mt-6 pt-3 border-t flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedDiet(d)}
                  className="btn btn-outline flex-1 !py-1.5 !text-xs"
                >
                  View Meal Plan
                </button>
                <button
                  type="button"
                  onClick={() => toast(`Downloaded ${d.title} (PDF Demo)`)}
                  className="btn btn-primary !py-1.5 !px-3 !text-xs"
                  title="Download Nutrition PDF"
                >
                  <Icon name="download" className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Personal Training Packages & Session Tracking (Section B) */}
      <Section
        tone="muted"
        title="Personal Training Packages"
        eyebrow="One-on-One Coaching"
        sub="Work individually with accredited trainers on form correction, compound loading, and combat conditioning."
      >
        <div className="grid gap-5 md:grid-cols-3">
          {(db.ptPackages ?? []).map((pt: Rec) => (
            <div key={pt.id} className="card p-6 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center">
                  <Badge tone="ok">{pt.sessions} Dedicated Sessions</Badge>
                  <span className="font-display text-2xl font-bold">{inr(pt.fee)}</span>
                </div>
                <h4 className="mt-3 text-lg font-bold text-foreground">{pt.name}</h4>
                <p className="text-xs font-semibold text-primary mt-1">Lead Coach: {pt.trainer}</p>
                <p className="mt-2 text-xs text-muted-foreground">{pt.desc}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPt(pt)}
                className="btn btn-primary mt-6 w-full !py-2 !text-xs"
              >
                Book Package
              </button>
            </div>
          ))}
        </div>
      </Section>

      {/* Gym Directory */}
      <Section
        title="Gym Directory & Branches"
        eyebrow="Locations"
        action={
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setRegGym(true)}
          >
            Register a Gym
          </button>
        }
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {(db.gyms ?? []).map((g: Rec) => (
            <article key={g.id} className="card card-lift overflow-hidden">
              <Img k="gym" alt={g.name} className="aspect-[16/9] w-full" />
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold">{g.name}</h3>
                  <StatusPill s={g.status} />
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {g.city}, {g.state} · {g.branches} branch(es)
                </p>
                <button
                  type="button"
                  className="btn btn-outline mt-4 w-full"
                  onClick={() => setGym(g)}
                >
                  View Gym
                </button>
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* Group Classes */}
      <Section tone="muted" title="Group Classes & Timetable" eyebrow="Daily Schedules">
        <div className="grid gap-4 md:grid-cols-3">
          {(db.classes ?? []).map((c: Rec) => (
            <div key={c.id} className="card p-5">
              <p className="font-bold">{c.name}</p>
              <p className="text-sm text-muted-foreground">
                {c.gym} · {c.time}
              </p>
              <div className="my-3 h-2 rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-primary"
                  style={{
                    width: `${Math.min(100, (c.booked / c.capacity) * 100)}%`,
                  }}
                />
              </div>
              <p className="text-xs">
                {c.booked}/{c.capacity} booked
              </p>
              <button
                type="button"
                disabled={c.booked >= c.capacity}
                className="btn btn-primary mt-3 w-full"
                onClick={() => book(c)}
              >
                {c.booked >= c.capacity ? "Class Full" : "Book Class"}
              </button>
            </div>
          ))}
        </div>
      </Section>

      {/* Trainers */}
      <Section title="Certified Trainers & Coaches" eyebrow="Expert Staff">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(db.trainers ?? []).map((t: Rec) => (
            <div key={t.id} className="card p-5">
              <span className="mb-3 grid h-14 w-14 place-items-center rounded-full bg-navy font-display text-xl font-bold text-primary">
                {t.name
                  .split(" ")
                  .map((x: string) => x[0])
                  .join("")}
              </span>
              <p className="font-bold">{t.name}</p>
              <p className="text-sm text-muted-foreground">{t.specialty}</p>
              <p className="text-xs text-muted-foreground">
                {t.city} · {t.experience}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Expanded Body Measurements & BMI Progress (Section B) */}
      <Section tone="muted" title="Body Measurements & BMI Progress" eyebrow="Health Analytics">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Measurement Logger Form */}
          <div className="card p-6">
            <h3 className="mb-4 text-xl font-bold uppercase">BMI & Body Composition Calculator</h3>
            <form onSubmit={handleLogMeasurements} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <label className="text-xs font-semibold text-muted-foreground">
                  Height (cm)
                  <input
                    type="number"
                    className="field mt-1"
                    value={h}
                    onChange={(e) => setH(e.target.value)}
                  />
                </label>
                <label className="text-xs font-semibold text-muted-foreground">
                  Weight (kg)
                  <input
                    type="number"
                    className="field mt-1"
                    value={w}
                    onChange={(e) => setW(e.target.value)}
                  />
                </label>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <label className="text-xs font-semibold text-muted-foreground">
                  Chest (cm)
                  <input
                    type="number"
                    className="field mt-1"
                    value={chest}
                    onChange={(e) => setChest(e.target.value)}
                  />
                </label>
                <label className="text-xs font-semibold text-muted-foreground">
                  Waist (cm)
                  <input
                    type="number"
                    className="field mt-1"
                    value={waist}
                    onChange={(e) => setWaist(e.target.value)}
                  />
                </label>
                <label className="text-xs font-semibold text-muted-foreground">
                  Body Fat (%)
                  <input
                    type="number"
                    className="field mt-1"
                    value={bodyFat}
                    onChange={(e) => setBodyFat(e.target.value)}
                  />
                </label>
              </div>

              <div className="flex items-baseline justify-between pt-2">
                <div>
                  <p className="font-display text-5xl font-black text-primary">
                    {bmi ? bmi.toFixed(1) : "—"}
                  </p>
                  {bmi > 0 && (
                    <Badge tone={bmiLabel === "Normal" ? "ok" : "warn"}>
                      {bmiLabel}
                    </Badge>
                  )}
                </div>
                <button type="submit" className="btn btn-outline !text-xs">
                  Log Measurements
                </button>
              </div>
            </form>
          </div>

          {/* Progress Trend Visualizer */}
          <div className="card p-6 flex flex-col justify-between">
            <div>
              <h3 className="mb-2 text-xl font-bold uppercase">Progress History (Rohit Sawant)</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Quarterly weight & body fat reduction trend.
              </p>
              <svg viewBox="0 0 300 120" className="w-full" role="img" aria-label="Weight trend chart">
                {(db.progress ?? []).map((p: Rec, i: number, a: Rec[]) => {
                  const x = 30 + i * (240 / Math.max(1, a.length - 1));
                  const y = 110 - (p.weight - 70) * 4;
                  return (
                    <g key={p.id}>
                      {i > 0 && (
                        <line
                          x1={30 + (i - 1) * (240 / (a.length - 1))}
                          y1={110 - (a[i - 1].weight - 70) * 4}
                          x2={x}
                          y2={y}
                          className="stroke-primary"
                          strokeWidth={3}
                        />
                      )}
                      <circle cx={x} cy={y} r={5} className="fill-navy" />
                      <text
                        x={x}
                        y={y - 10}
                        textAnchor="middle"
                        className="fill-foreground text-[10px] font-bold"
                      >
                        {p.weight}kg
                      </text>
                      <text
                        x={x}
                        y={118}
                        textAnchor="middle"
                        className="fill-muted-foreground text-[8px]"
                      >
                        {p.date.slice(5)}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 border-t pt-3 text-center text-xs">
              <div>
                <p className="text-muted-foreground">Chest</p>
                <p className="font-bold">{chest} cm</p>
              </div>
              <div>
                <p className="text-muted-foreground">Waist</p>
                <p className="font-bold">{waist} cm</p>
              </div>
              <div>
                <p className="text-muted-foreground">Body Fat</p>
                <p className="font-bold text-success">{bodyFat}%</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Modals */}
      <Modal open={!!plan} onClose={() => setPlan(null)} title={`${plan?.name ?? ""} Membership`}>
        {plan && (
          <RegisterForm
            title={`Gym membership — ${plan.name}`}
            kind="Gym membership"
            fee={plan.price}
            extra={[
              {
                name: "gym",
                label: "Gym Branch",
                type: "select",
                options: (db.gyms ?? []).map((g: Rec) => g.name),
                required: true,
              },
              {
                name: "pt",
                label: "Personal Training Add-On",
                type: "select",
                options: ["No", "Yes — 8 sessions", "Yes — 16 sessions"],
              },
            ]}
            onDone={() => setPlan(null)}
          />
        )}
      </Modal>

      <Modal open={!!gym} onClose={() => setGym(null)} title={gym?.name ?? ""}>
        {gym && (
          <div className="space-y-2">
            <DemoTag />
            <p><b>Owner:</b> {gym.owner}</p>
            <p><b>Location:</b> {gym.city}, {gym.state}</p>
            <p><b>Branches:</b> {gym.branches}</p>
            <p>
              <b>Classes:</b>{" "}
              {(db.classes ?? [])
                .filter((c: Rec) => c.gym === gym.name)
                .map((c: Rec) => c.name)
                .join(", ") || "Ask at front desk"}
            </p>
            <p className="text-xs text-muted-foreground">
              No biometric or access-control hardware is connected in this demo.
            </p>
          </div>
        )}
      </Modal>

      <Modal open={regGym} onClose={() => setRegGym(false)} title="Gym Registration">
        {regGym && (
          <RegisterForm
            title="New gym"
            kind="Gym registration"
            extra={[
              { name: "gym", label: "Gym name", required: true },
              { name: "city", label: "City", required: true },
              { name: "branches", label: "Number of branches", type: "number" },
            ]}
            onDone={() => setRegGym(false)}
          />
        )}
      </Modal>

      {/* PT Booking Modal */}
      <Modal open={!!selectedPt} onClose={() => setSelectedPt(null)} title={`Book ${selectedPt?.name ?? ""}`}>
        {selectedPt && (
          <RegisterForm
            title={selectedPt.name}
            kind="Personal Training Package"
            fee={selectedPt.fee}
            extra={[
              {
                name: "trainer",
                label: "Assigned Coach",
                type: "select",
                options: (db.trainers ?? []).map((t: Rec) => t.name),
                required: true,
              },
              {
                name: "prefTime",
                label: "Preferred Slot",
                type: "select",
                options: ["Morning (6 AM - 8 AM)", "Afternoon (12 PM - 2 PM)", "Evening (5 PM - 8 PM)"],
                required: true,
              },
            ]}
            onDone={() => setSelectedPt(null)}
          />
        )}
      </Modal>

      {/* Diet Plan Detail Modal */}
      <Modal open={!!selectedDiet} onClose={() => setSelectedDiet(null)} title={selectedDiet?.title ?? ""} wide>
        {selectedDiet && (
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <Badge tone="ok">{selectedDiet.goal}</Badge>
              <span className="font-mono font-bold text-primary">{selectedDiet.calories} · {selectedDiet.protein} Protein</span>
            </div>
            <p className="text-sm">{selectedDiet.desc}</p>
            <div className="rounded-xl bg-muted p-4 space-y-2 text-xs">
              <h5 className="font-bold text-foreground uppercase">Sample Daily Routine ({selectedDiet.meals} Meals):</h5>
              <p>• <b>Meal 1 (Breakfast):</b> Oats porridge, soaked almonds, boiled eggs / sattu shake.</p>
              <p>• <b>Meal 2 (Post-Workout):</b> High-protein smoothie, fruit and peanut butter toast.</p>
              <p>• <b>Meal 3 (Lunch):</b> Brown rice or roti, green salad, dal/lentils, grilled chicken or paneer.</p>
              <p>• <b>Meal 4 (Dinner):</b> Steamed vegetables, light soup, sprout chaat.</p>
            </div>
            <p className="text-xs text-muted-foreground">{selectedDiet.tips}</p>
            <button
              type="button"
              onClick={() => {
                toast("Sample Nutrition Framework PDF generated (demo)");
                setSelectedDiet(null);
              }}
              className="btn btn-primary w-full !text-xs"
            >
              Download Full Meal Schedule (PDF)
            </button>
          </div>
        )}
      </Modal>
    </Site>
  );
}
