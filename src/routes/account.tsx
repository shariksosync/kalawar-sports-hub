import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { clean, inr, isEmail, isPhone, uid, useStore } from "@/lib/store";
import { Badge, DemoTag, Empty, Icon, Modal, PageHero, QrMock, Section, statusTone } from "@/components/kit";
import { Site, StatusPill, Wordmark, seo } from "@/components/site";
import { BUSINESS, type Rec } from "@/data/mock";

export const Route = createFileRoute("/account")({
  head: () =>
    seo(
      "Member Account",
      "KALAWAR Sports member portal — digital ID card, memberships, attendance, tournament registrations and fitness progress."
    ),
  component: AccountPage,
});

function AccountPage() {
  const { user, setUser, db, toast } = useStore();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [activeSection, setActiveSection] = useState<"profile" | "idcard" | "subs" | "progress" | "orders">("idcard");
  const [receiptItem, setReceiptItem] = useState<Rec | null>(null);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPhone, setLoginPhone] = useState("");

  // Registration state
  const [regData, setRegData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Athlete",
    sport: "Karate",
    academy: "Shiroli Karate Dojo",
  });

  // BMI & Body Measurements state in account
  const [height, setHeight] = useState("175");
  const [weight, setWeight] = useState("72");
  const [chest, setChest] = useState("98");
  const [waist, setWaist] = useState("82");
  const [bodyFat, setBodyFat] = useState("18");

  const bmiVal = +height > 0 && +weight > 0 ? +weight / ((+height / 100) ** 2) : 0;
  const bmiStatus = bmiVal < 18.5 ? "Underweight" : bmiVal < 25 ? "Normal" : bmiVal < 30 ? "Overweight" : "Obese";

  // Login as demo user
  const handleQuickLogin = (demoName: string, demoEmail: string, demoPhone: string) => {
    setUser({ name: demoName, email: demoEmail, phone: demoPhone });
    toast(`Logged in as ${demoName}`);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !isEmail(loginEmail)) return toast("Please enter a valid email", "err");
    setUser({
      name: loginEmail.split("@")[0].replace(/[._]/g, " ").toUpperCase(),
      email: clean(loginEmail),
      phone: loginPhone ? clean(loginPhone) : "+91 98220 12345",
    });
    toast("Welcome back to KALAWAR Sports!");
  };

  const handleRegSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regData.name.trim()) return toast("Please enter your name", "err");
    if (!isEmail(regData.email)) return toast("Please enter a valid email", "err");
    if (!isPhone(regData.phone)) return toast("Please enter a valid 10-digit Indian phone number (+91)", "err");

    const newMemberId = `KS-M-${Math.floor(1000 + Math.random() * 9000)}`;
    setUser({
      name: clean(regData.name),
      email: clean(regData.email),
      phone: clean(regData.phone),
    });

    toast(`Registration complete! Membership ID: ${newMemberId}`);
  };

  // Find linked member record from mock db
  const memberRecord =
    (db.members ?? []).find(
      (m: Rec) => m.name.toLowerCase() === (user?.name || "").toLowerCase()
    ) || (db.members && db.members[0]) || {
      id: "KS-M-1001",
      name: user?.name || "Aarav Kasabe",
      sport: "Karate",
      belt: "Green",
      academy: "Shiroli Karate Dojo",
      state: "Maharashtra",
      type: "Athlete",
      status: "Active",
      expiry: "2027-04-15",
    };

  const memberAttendance = (db.attendance ?? []).filter(
    (a: Rec) => a.member.toLowerCase() === memberRecord.name.toLowerCase()
  );
  const memberOrders = (db.orders ?? []).filter(
    (o: Rec) => o.customer.toLowerCase() === memberRecord.name.toLowerCase() || o.customer === "Aarav Kasabe"
  );
  const memberRegistrations = (db.registrations ?? []).filter(
    (r: Rec) => r.name?.toLowerCase() === (user?.name || "").toLowerCase()
  );

  return (
    <Site>
      <PageHero
        title={user ? `Welcome, ${user.name}` : "Member Portal"}
        sub={
          user
            ? `Membership ID: ${memberRecord.id} · ${memberRecord.sport || "Multi-Sport"}`
            : "Sign in or register as an athlete, student, coach, or gym member."
        }
        img="hero"
      />

      <Section
        title={user ? "Member Dashboard" : "Sign In or Register"}
        eyebrow="KALAWAR Ecosystem"
        action={<DemoTag>Front-end member session</DemoTag>}
      >
        {!user ? (
          /* Logged-Out / Authentication View */
          <div className="mx-auto max-w-md">
            <div className="card p-6 shadow-lg sm:p-8">
              <div className="mb-6 flex border-b">
                <button
                  type="button"
                  onClick={() => setTab("login")}
                  className={`flex-1 pb-3 text-center font-display text-lg font-bold uppercase ${
                    tab === "login"
                      ? "border-b-2 border-primary text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setTab("register")}
                  className={`flex-1 pb-3 text-center font-display text-lg font-bold uppercase ${
                    tab === "register"
                      ? "border-b-2 border-primary text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Join KALAWAR
                </button>
              </div>

              {tab === "login" ? (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="e.g. aarav@example.com"
                      className="field mt-1"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      value={loginPhone}
                      onChange={(e) => setLoginPhone(e.target.value)}
                      placeholder="+91 98220 00000"
                      className="field mt-1"
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-full">
                    Enter Portal
                  </button>

                  <div className="pt-4 text-center">
                    <p className="text-xs text-muted-foreground">Or sign in with a demo account:</p>
                    <div className="mt-2 flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleQuickLogin("Aarav Kasabe", "aarav@kalawarsports.demo", "+91 98220 11111")
                        }
                        className="btn btn-outline !py-1.5 !text-xs"
                      >
                        Sign in as Aarav Kasabe (Karate Athlete)
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleQuickLogin("Rohit Sawant", "rohit@kalawarsports.demo", "+91 98220 22222")
                        }
                        className="btn btn-outline !py-1.5 !text-xs"
                      >
                        Sign in as Rohit Sawant (Gym Member)
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleRegSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-muted-foreground">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={regData.name}
                      onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                      placeholder="e.g. Aarav Kasabe"
                      className="field mt-1"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-muted-foreground">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={regData.email}
                      onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                      placeholder="name@example.com"
                      className="field mt-1"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-muted-foreground">
                      Phone (+91)
                    </label>
                    <input
                      type="tel"
                      value={regData.phone}
                      onChange={(e) => setRegData({ ...regData, phone: e.target.value })}
                      placeholder="+91 98220 00000"
                      className="field mt-1"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold uppercase text-muted-foreground">
                        Member Role
                      </label>
                      <select
                        value={regData.role}
                        onChange={(e) => setRegData({ ...regData, role: e.target.value })}
                        className="field mt-1"
                      >
                        <option>Athlete</option>
                        <option>Student</option>
                        <option>Coach</option>
                        <option>Gym Member</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-muted-foreground">
                        Primary Sport
                      </label>
                      <select
                        value={regData.sport}
                        onChange={(e) => setRegData({ ...regData, sport: e.target.value })}
                        className="field mt-1"
                      >
                        <option>Karate</option>
                        <option>Taekwondo</option>
                        <option>Boxing</option>
                        <option>Wrestling</option>
                        <option>Cricket</option>
                        <option>Football</option>
                        <option>Fitness</option>
                      </select>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary w-full mt-2">
                    Complete Registration
                  </button>
                </form>
              )}
            </div>
          </div>
        ) : (
          /* Logged-In Member Dashboard View */
          <div className="space-y-8">
            {/* Navigation Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "idcard", label: "Digital ID Card", icon: "shield" },
                  { id: "profile", label: "Member Profile", icon: "user" },
                  { id: "subs", label: "Subscriptions & Plans", icon: "bag" },
                  { id: "progress", label: "Fitness & BMI", icon: "chart" },
                  { id: "orders", label: "Orders & Events", icon: "trophy" },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setActiveSection(s.id as any)}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                      activeSection === s.id
                        ? "bg-primary text-primary-foreground shadow"
                        : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                    }`}
                  >
                    <Icon name={s.icon} className="h-4 w-4" />
                    {s.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  setUser(null);
                  toast("Logged out of member portal");
                }}
                className="btn btn-outline !py-1.5 !px-3 !text-xs text-destructive hover:bg-destructive/10"
              >
                <Icon name="logout" className="h-4 w-4" />
                Logout
              </button>
            </div>

            {/* Tab 1: Digital ID Card */}
            {activeSection === "idcard" && (
              <div className="grid items-start gap-8 lg:grid-cols-[420px_1fr]">
                {/* ID Card Graphic */}
                <div className="card relative overflow-hidden rounded-2xl border-2 border-primary/40 bg-navy p-6 text-navy-foreground shadow-2xl">
                  <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-primary/10 blur-xl pointer-events-none" />

                  <div className="flex items-center justify-between border-b border-navy-2 pb-4">
                    <Wordmark light />
                    <Badge tone="ok">Official Demo ID</Badge>
                  </div>

                  <div className="mt-6 flex gap-4">
                    <div className="grid h-24 w-20 shrink-0 place-items-center rounded-xl border border-navy-2 bg-navy-2 text-primary font-display text-3xl font-black">
                      {memberRecord.name.split(" ").map((n: string) => n[0]).join("")}
                    </div>

                    <div className="space-y-1">
                      <p className="font-display text-2xl font-black uppercase text-navy-foreground">
                        {memberRecord.name}
                      </p>
                      <p className="text-xs font-bold text-primary uppercase">
                        {memberRecord.sport} · {memberRecord.type || "Athlete"}
                      </p>
                      <p className="text-xs text-navy-foreground/70">
                        {memberRecord.academy || "KALAWAR National Federation"}
                      </p>
                      <p className="font-mono text-xs font-bold tracking-wider text-navy-foreground/90">
                        ID: {memberRecord.id}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-2 rounded-xl bg-navy-2/60 p-3 text-xs">
                    <div>
                      <p className="text-navy-foreground/50">Current Belt / Rank</p>
                      <p className="font-bold text-primary">{memberRecord.belt || "Active Grade"}</p>
                    </div>
                    <div>
                      <p className="text-navy-foreground/50">Valid Thru</p>
                      <p className="font-bold">{memberRecord.expiry || "2027-12-31"}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between pt-2">
                    <p className="text-[10px] text-navy-foreground/50">
                      National Headquarters · Maharashtra, India
                    </p>
                    <QrMock text={memberRecord.id} />
                  </div>
                </div>

                {/* ID Actions & Details */}
                <div className="space-y-4">
                  <div className="card p-6">
                    <h3 className="text-xl font-bold uppercase">Membership Verification</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      This digital identity credential is synchronized across national championships,
                      academy attendance readers, and federation grading records.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => toast("Digital ID card downloaded as PDF (simulated)")}
                        className="btn btn-primary"
                      >
                        <Icon name="download" className="h-4 w-4" />
                        Download ID Card (PDF)
                      </button>
                      <button
                        type="button"
                        onClick={() => toast("NFC / Apple Wallet pass placeholder (simulated)")}
                        className="btn btn-outline"
                      >
                        Add to Mobile Wallet
                      </button>
                    </div>
                  </div>

                  <div className="card p-6">
                    <h4 className="font-bold uppercase">Recent Attendance Check-Ins</h4>
                    {memberAttendance.length > 0 ? (
                      <div className="mt-3 space-y-2">
                        {memberAttendance.map((a: Rec) => (
                          <div key={a.id} className="flex justify-between rounded-lg bg-muted p-3 text-sm">
                            <span>{a.place} · {a.date}</span>
                            <StatusPill s={a.status} />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-2 text-sm text-muted-foreground">
                        Recent check-in: Shiroli Karate Dojo (Mon, Wed, Fri 6:00 AM batch).
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Member Profile */}
            {activeSection === "profile" && (
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="card p-6 space-y-4">
                  <h3 className="text-xl font-bold uppercase">Personal Information</h3>
                  <dl className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <dt className="text-muted-foreground">Full Name</dt>
                      <dd className="font-bold mt-1">{memberRecord.name}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Membership Number</dt>
                      <dd className="font-bold mt-1 font-mono">{memberRecord.id}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Email</dt>
                      <dd className="font-bold mt-1">{user.email}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Phone</dt>
                      <dd className="font-bold mt-1">{user.phone}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Affiliated Academy</dt>
                      <dd className="font-bold mt-1">{memberRecord.academy || "Shiroli Karate Dojo"}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">State Unit</dt>
                      <dd className="font-bold mt-1">{memberRecord.state || "Maharashtra"}</dd>
                    </div>
                  </dl>
                </div>

                <div className="card p-6 space-y-4">
                  <h3 className="text-xl font-bold uppercase">Martial Arts & Belt History</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <p className="font-bold">Current Belt: {memberRecord.belt || "Green"}</p>
                        <p className="text-xs text-muted-foreground">Grading Examiner: Dr. Prakash Mane</p>
                      </div>
                      <Badge tone="ok">Pass</Badge>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-3 opacity-75">
                      <div>
                        <p className="font-bold">Previous Belt: Yellow</p>
                        <p className="text-xs text-muted-foreground">Certified May 2026</p>
                      </div>
                      <Badge tone="muted">Completed</Badge>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Subscriptions & Plans */}
            {activeSection === "subs" && (
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="card p-6 border-2 border-primary/30 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold uppercase tracking-wider text-primary">Academy Plan</span>
                        <Badge tone="ok">Active</Badge>
                      </div>
                      <h4 className="mt-2 text-2xl font-bold">Shiroli Karate Dojo</h4>
                      <p className="mt-1 text-sm text-muted-foreground">Quarterly Advanced Training Batch</p>
                      <p className="mt-4 font-display text-3xl font-bold">₹3,200 <span className="text-xs font-normal text-muted-foreground">/ quarter</span></p>
                      <p className="mt-2 text-xs text-muted-foreground">Renews on 30 Nov 2026</p>
                    </div>
                    <div className="mt-4 pt-3 border-t flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setReceiptItem({
                            id: "SUB-REC-2601",
                            customer: memberRecord.name,
                            items: "Shiroli Karate Dojo — Quarterly Membership",
                            total: 3200,
                            date: "2026-09-01",
                            payment: "UPI Auto-Debit (demo)",
                          })
                        }
                        className="btn btn-outline flex-1 !py-1.5 !text-xs"
                      >
                        Receipt
                      </button>
                      <button
                        type="button"
                        onClick={() => toast("Renewal fee demo processed")}
                        className="btn btn-primary flex-1 !py-1.5 !text-xs"
                      >
                        Renew
                      </button>
                    </div>
                  </div>

                  <div className="card p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Gym Access</span>
                        <Badge tone="warn">Expiring Soon</Badge>
                      </div>
                      <h4 className="mt-2 text-2xl font-bold">Iron Pulse Fitness</h4>
                      <p className="mt-1 text-sm text-muted-foreground">Monthly All-Access Pass</p>
                      <p className="mt-4 font-display text-3xl font-bold">₹1,200 <span className="text-xs font-normal text-muted-foreground">/ month</span></p>
                      <p className="mt-2 text-xs text-destructive font-semibold">Expires in 6 days (31 Oct)</p>
                    </div>
                    <div className="mt-4 pt-3 border-t flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setReceiptItem({
                            id: "SUB-REC-2602",
                            customer: memberRecord.name,
                            items: "Iron Pulse Fitness — Monthly All-Access Pass",
                            total: 1200,
                            date: "2026-10-01",
                            payment: "Debit Card (demo)",
                          })
                        }
                        className="btn btn-outline flex-1 !py-1.5 !text-xs"
                      >
                        Receipt
                      </button>
                      <button
                        type="button"
                        onClick={() => toast("Gym membership extended by 1 month")}
                        className="btn btn-outline flex-1 !py-1.5 !text-xs"
                      >
                        Extend
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Fitness & BMI + Body Measurements */}
            {activeSection === "progress" && (
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="card p-6">
                  <h3 className="text-xl font-bold uppercase">BMI & Body Measurements</h3>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold uppercase text-muted-foreground">Height (cm)</label>
                      <input
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        className="field mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase text-muted-foreground">Weight (kg)</label>
                      <input
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="field mt-1"
                      />
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-bold uppercase text-muted-foreground">Chest (cm)</label>
                      <input
                        type="number"
                        value={chest}
                        onChange={(e) => setChest(e.target.value)}
                        className="field mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase text-muted-foreground">Waist (cm)</label>
                      <input
                        type="number"
                        value={waist}
                        onChange={(e) => setWaist(e.target.value)}
                        className="field mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase text-muted-foreground">Body Fat (%)</label>
                      <input
                        type="number"
                        value={bodyFat}
                        onChange={(e) => setBodyFat(e.target.value)}
                        className="field mt-1"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex items-baseline justify-between pt-2">
                    <div>
                      <p className="font-display text-5xl font-black text-primary">
                        {bmiVal ? bmiVal.toFixed(1) : "—"}
                      </p>
                      {bmiVal > 0 && <Badge tone={bmiStatus === "Normal" ? "ok" : "warn"}>{bmiStatus}</Badge>}
                    </div>
                    <button
                      type="button"
                      onClick={() => toast("Measurements updated in profile (demo)")}
                      className="btn btn-outline !text-xs"
                    >
                      Save Measurements
                    </button>
                  </div>
                </div>

                <div className="card p-6">
                  <h3 className="text-xl font-bold uppercase">Weight Trend</h3>
                  <div className="mt-4">
                    <svg viewBox="0 0 300 120" className="w-full" role="img" aria-label="Weight chart">
                      {[
                        { date: "Aug", w: 85 },
                        { date: "Sep", w: 83 },
                        { date: "Oct", w: 81 },
                      ].map((pt, i, arr) => {
                        const x = 40 + i * 110;
                        const y = 100 - (pt.w - 75) * 5;
                        return (
                          <g key={pt.date}>
                            {i > 0 && (
                              <line
                                x1={40 + (i - 1) * 110}
                                y1={100 - (arr[i - 1].w - 75) * 5}
                                x2={x}
                                y2={y}
                                stroke="var(--color-primary)"
                                strokeWidth="3"
                              />
                            )}
                            <circle cx={x} cy={y} r="5" fill="var(--color-navy)" />
                            <text x={x} y={y - 10} textAnchor="middle" className="text-[10px] fill-foreground font-bold">
                              {pt.w} kg
                            </text>
                            <text x={x} y={115} textAnchor="middle" className="text-[10px] fill-muted-foreground">
                              {pt.date}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 5: Orders & Events */}
            {activeSection === "orders" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold uppercase mb-3">Store Orders</h3>
                  {memberOrders.length > 0 ? (
                    <div className="space-y-3">
                      {memberOrders.map((o: Rec) => (
                        <div key={o.id} className="card flex flex-wrap justify-between items-center gap-3 p-4">
                          <div>
                            <p className="font-mono font-bold text-sm">{o.id}</p>
                            <p className="text-xs text-muted-foreground">{o.items} · {o.date}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className="font-bold">{inr(o.total)}</p>
                              <StatusPill s={o.status} />
                            </div>
                            <button
                              type="button"
                              onClick={() => setReceiptItem(o)}
                              className="btn btn-outline !py-1 !px-2.5 !text-xs"
                            >
                              Receipt
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Empty text="No store orders placed yet." />
                  )}
                </div>

                {memberRegistrations.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold uppercase mb-3">My Applications & Registrations</h3>
                    <div className="space-y-3">
                      {memberRegistrations.map((r: Rec) => (
                        <div key={r.id} className="card flex justify-between items-center p-4">
                          <div>
                            <p className="font-bold">{r.kind}: {r.title}</p>
                            <p className="text-xs text-muted-foreground font-mono">Ref: {r.id} · {r.date}</p>
                          </div>
                          <StatusPill s={r.status} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </Section>

      {/* Digital Payment Receipt Modal */}
      <Modal open={!!receiptItem} onClose={() => setReceiptItem(null)} title={`Tax Invoice & Receipt — ${receiptItem?.id ?? ""}`} wide>
        {receiptItem && (
          <div className="space-y-6">
            <div className="card p-6 border bg-background text-foreground space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b pb-4">
                <div>
                  <Wordmark />
                  <p className="text-xs text-muted-foreground mt-1">{BUSINESS.hq}</p>
                  <p className="text-[11px] text-muted-foreground">{BUSINESS.address}</p>
                  <p className="text-[11px] text-muted-foreground">GSTIN (Demo): 27AABCK1234F1Z8</p>
                </div>
                <div className="text-right">
                  <span className="inline-block rounded bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary uppercase">
                    Paid (Demo Receipt)
                  </span>
                  <p className="font-mono text-xs font-bold mt-2">Invoice: INV-{receiptItem.id}</p>
                  <p className="text-xs text-muted-foreground">Date: {receiptItem.date}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs border-b pb-4">
                <div>
                  <p className="text-muted-foreground font-semibold">Billed To:</p>
                  <p className="font-bold text-foreground text-sm mt-0.5">{receiptItem.customer || user?.name}</p>
                  <p className="text-muted-foreground mt-0.5">{user?.phone || "+91 98220 00000"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground font-semibold">Payment Details:</p>
                  <p className="font-bold text-foreground mt-0.5">{receiptItem.payment || "UPI Auto-Debit (demo)"}</p>
                  <p className="font-mono text-muted-foreground text-[11px]">Txn Ref: TXN-KLW-{Date.now().toString().slice(-6)}</p>
                </div>
              </div>

              <div className="text-xs space-y-2">
                <div className="flex justify-between font-bold border-b pb-1 text-muted-foreground">
                  <span>Description</span>
                  <span>Amount</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>{receiptItem.items}</span>
                  <span className="font-mono">{inr(Math.round(receiptItem.total / 1.18))}</span>
                </div>
                <div className="flex justify-between py-1 text-muted-foreground">
                  <span>Integrated GST (18%)</span>
                  <span className="font-mono">{inr(receiptItem.total - Math.round(receiptItem.total / 1.18))}</span>
                </div>
                <div className="flex justify-between border-t pt-2 text-sm font-black">
                  <span>Total Paid (INR)</span>
                  <span className="font-mono text-primary text-base">{inr(receiptItem.total)}</span>
                </div>
              </div>

              <div className="rounded-lg bg-muted/50 p-3 text-[11px] text-muted-foreground text-center">
                This is a computer-generated demonstration receipt for KALAWAR Sports prototype transactions.
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => toast("Receipt PDF dispatched to download queue (demo)")}
                className="btn btn-outline !text-xs"
              >
                <Icon name="download" className="h-4 w-4" />
                Download PDF
              </button>
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="btn btn-primary !text-xs"
              >
                Print Receipt
              </button>
            </div>
          </div>
        )}
      </Modal>
    </Site>
  );
}
