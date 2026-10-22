import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  clean,
  downloadCSV,
  finalPrice,
  inr,
  uid,
  useStore,
} from "@/lib/store";
import {
  Badge,
  DemoTag,
  Empty,
  Icon,
  Modal,
  statusTone,
} from "@/components/kit";
import { StatusPill, Wordmark, seo } from "@/components/site";
import {
  PRODUCT_CATEGORIES,
  ROLES,
  ROLE_SCOPE,
  SPORTS,
  type Rec,
} from "@/data/mock";

export const Route = createFileRoute("/admin")({
  head: () =>
    seo(
      "Admin Dashboard",
      "KALAWAR Sports administrative portal for national federations, sports academies, gyms and multi-sport governance."
    ),
  component: AdminDashboard,
});

// Category groupings for sidebar
type AdminModuleId =
  | "analytics"
  | "federation"
  | "academies"
  | "gyms"
  | "championships"
  | "courses"
  | "media"
  | "store"
  | "finance"
  | "notifications"
  | "settings";

const MODULES: { id: AdminModuleId; label: string; icon: string }[] = [
  { id: "analytics", label: "Dashboard & KPIs", icon: "chart" },
  { id: "federation", label: "Federation & Belts", icon: "shield" },
  { id: "academies", label: "Academies & Batches", icon: "users" },
  { id: "gyms", label: "Gym & Fitness Hub", icon: "dumbbell" },
  { id: "championships", label: "Championships & Draws", icon: "trophy" },
  { id: "courses", label: "Courses & E-Learning", icon: "book" },
  { id: "media", label: "Media & Moderation", icon: "play" },
  { id: "store", label: "E-commerce Store", icon: "bag" },
  { id: "finance", label: "Finance & Subscriptions", icon: "check" },
  { id: "notifications", label: "Broadcast Templates", icon: "bell" },
  { id: "settings", label: "Settings & Mobile App", icon: "flag" },
];

// Role to permitted modules mapping
const ROLE_PERMISSIONS: Record<string, AdminModuleId[]> = {
  "Super Admin": [
    "analytics",
    "federation",
    "academies",
    "gyms",
    "championships",
    "courses",
    "media",
    "store",
    "finance",
    "notifications",
    "settings",
  ],
  "India-Level Administrator": [
    "analytics",
    "federation",
    "academies",
    "championships",
    "courses",
    "media",
    "notifications",
  ],
  "State Administrator": [
    "analytics",
    "federation",
    "academies",
    "championships",
    "notifications",
  ],
  "District Administrator": [
    "analytics",
    "federation",
    "academies",
    "championships",
  ],
  "Federation Administrator": [
    "analytics",
    "federation",
    "championships",
    "courses",
  ],
  "Academy Administrator": ["analytics", "academies"],
  "Gym Owner": ["analytics", "gyms", "finance"],
  "Branch Manager": ["analytics", "academies", "gyms"],
  Trainer: ["gyms", "courses"],
  "Finance Administrator": ["analytics", "finance", "store"],
  "Content Administrator": ["media", "courses", "settings"],
  "Store Administrator": ["analytics", "store", "finance"],
  "Student/Member": ["analytics", "courses"],
};

function AdminDashboard() {
  const { session, logout, setRole, db, upsert, remove, toast } = useStore();
  const nav = useNavigate();

  const currentRole = session?.role || "Super Admin";
  const [activeTab, setActiveTab] = useState<AdminModuleId>("analytics");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminSearch, setAdminSearch] = useState("");

  // CRUD state modals
  const [createKind, setCreateKind] = useState<string | null>(null);
  const [editItem, setEditItem] = useState<{ col: string; item: Rec } | null>(
    null
  );
  const [confirmDelete, setConfirmDelete] = useState<{
    col: string;
    id: string;
    name: string;
  } | null>(null);

  // Quick form inputs
  const [formData, setFormData] = useState<Rec>({});

  // Tab 11 Settings States: Banners & Sports
  const [newBannerTitle, setNewBannerTitle] = useState("");
  const [newBannerSection, setNewBannerSection] = useState("Home Strip");
  const [newSportName, setNewSportName] = useState("");
  const [newSportImg, setNewSportImg] = useState("martial");

  // Filter allowed tabs based on active demo role
  const allowedModules = useMemo(() => {
    return (
      ROLE_PERMISSIONS[currentRole] ||
      ROLE_PERMISSIONS["Super Admin"] || [
        "analytics",
      ]
    );
  }, [currentRole]);

  // Adjust active tab if activeTab is not permitted for new role
  const safeTab: AdminModuleId = allowedModules.includes(activeTab)
    ? activeTab
    : allowedModules[0] || "analytics";

  // Data Scope Filter Simulation (State admin sees only state, Academy admin sees only academy)
  const scope = ROLE_SCOPE[currentRole];
  const applyScope = (list: Rec[] = []) => {
    if (!scope) return list;
    return list.filter(
      (item) =>
        String(item[scope.field] || "").toLowerCase() ===
        scope.value.toLowerCase()
    );
  };

  // KPIs
  const totalMembers = (db.members ?? []).length;
  const activeAcademies = (db.academies ?? []).length;
  const registeredGyms = (db.gyms ?? []).length;
  const upcomingChamps = (db.championships ?? []).filter(
    (c: Rec) => c.status !== "Completed"
  ).length;
  const activeCourses = (db.courses ?? []).length;
  const pendingAffiliations = (db.affiliations ?? []).filter(
    (a: Rec) => a.status === "Pending"
  ).length;
  const shopOrders = (db.orders ?? []).length;
  const pendingEnquiries = (db.enquiries ?? []).length;

  const handleRoleChange = (newRole: string) => {
    setRole(newRole);
    toast(`Switched view to ${newRole}`);
  };

  const handleLogout = () => {
    logout();
    toast("Logged out of administrative portal");
    nav({ to: "/" });
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (editItem) {
      upsert(editItem.col, { ...editItem.item, ...formData });
      toast(`Updated ${editItem.col} record`);
      setEditItem(null);
    } else if (createKind) {
      upsert(createKind, formData);
      toast(`Created new ${createKind} record`);
      setCreateKind(null);
    }
    setFormData({});
  };

  const handleDelete = () => {
    if (confirmDelete) {
      remove(confirmDelete.col, confirmDelete.id);
      toast(`Deleted record ${confirmDelete.id}`);
      setConfirmDelete(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-muted/30 text-foreground">
      {/* Sidebar for Desktop */}
      <aside className="hidden w-64 flex-col border-r bg-navy text-navy-foreground lg:flex">
        <div className="border-b border-navy-2 p-5">
          <Wordmark light />
          <p className="mt-2 text-[11px] font-bold uppercase tracking-wider text-primary">
            Admin Console
          </p>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {MODULES.filter((m) => allowedModules.includes(m.id)).map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setActiveTab(m.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                safeTab === m.id
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-navy-foreground/75 hover:bg-navy-2 hover:text-navy-foreground"
              }`}
            >
              <Icon name={m.icon} className="h-4 w-4 shrink-0" />
              <span className="truncate">{m.label}</span>
            </button>
          ))}
        </nav>

        {/* Role Scoping Indicator in Sidebar */}
        <div className="border-t border-navy-2 p-4 text-xs">
          <p className="text-[10px] uppercase font-bold text-navy-foreground/50">Active Scope</p>
          <p className="font-semibold text-primary">
            {scope ? `${scope.field}: ${scope.value}` : "National (All Data)"}
          </p>
          <p className="mt-1 text-[10px] text-navy-foreground/60">
            Permissions active for {currentRole}
          </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-x-hidden">
        {/* Top Bar Header */}
        <header className="sticky top-0 z-40 flex items-center justify-between border-b bg-background/95 px-4 py-3 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 hover:bg-muted lg:hidden"
              aria-label="Open sidebar"
            >
              <Icon name="menu" className="h-5 w-5" />
            </button>

            {/* Quick Admin Search */}
            <div className="relative hidden sm:block">
              <Icon
                name="search"
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                value={adminSearch}
                onChange={(e) => setAdminSearch(e.target.value)}
                placeholder="Search admin records…"
                className="field !h-9 !w-64 !pl-9 !text-xs"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Role Switcher */}
            <div className="flex items-center gap-1.5">
              <span className="hidden text-xs font-bold uppercase tracking-wider text-muted-foreground sm:inline">
                Role:
              </span>
              <select
                value={currentRole}
                onChange={(e) => handleRoleChange(e.target.value)}
                className="field !h-9 !py-1 !px-2.5 !text-xs font-bold"
                aria-label="Select demo role"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* Notifications Indicator */}
            <Link
              to="/notifications"
              className="relative rounded-lg p-2 hover:bg-muted"
              title="Notifications"
            >
              <Icon name="bell" className="h-5 w-5" />
              {(db.notifications ?? []).some((n: Rec) => !n.read) && (
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary" />
              )}
            </Link>

            {/* Public Site Link */}
            <Link
              to="/"
              className="btn btn-outline !h-9 !px-3 !text-xs hidden md:inline-flex"
            >
              Visit Public Site
            </Link>

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              className="btn btn-outline !h-9 !px-3 !text-xs text-destructive hover:bg-destructive/10"
              title="Logout"
            >
              <Icon name="logout" className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div
              className="fixed inset-0 bg-navy/60 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="relative flex w-72 flex-col bg-navy p-5 text-navy-foreground shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-navy-2">
                <Wordmark light />
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="rounded p-1 hover:bg-navy-2"
                >
                  <Icon name="x" className="h-5 w-5" />
                </button>
              </div>

              <nav className="mt-4 flex-1 space-y-1 overflow-y-auto">
                {MODULES.filter((m) => allowedModules.includes(m.id)).map(
                  (m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        setActiveTab(m.id);
                        setSidebarOpen(false);
                      }}
                      className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold uppercase ${
                        safeTab === m.id
                          ? "bg-primary text-primary-foreground shadow"
                          : "text-navy-foreground/75 hover:bg-navy-2"
                      }`}
                    >
                      <Icon name={m.icon} className="h-4 w-4" />
                      {m.label}
                    </button>
                  )
                )}
              </nav>

              <div className="border-t border-navy-2 pt-4">
                <Link to="/" className="btn btn-outline w-full !text-xs">
                  Back to Public Website
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8">
          {/* Top Banner Notice */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-4 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary text-primary-foreground">
                <Icon name="shield" className="h-4 w-4" />
              </span>
              <div>
                <p className="font-bold uppercase tracking-wider text-foreground">
                  Role: <span className="text-primary">{currentRole}</span> · Scope:{" "}
                  <span className="font-semibold">
                    {scope ? `${scope.field}: ${scope.value}` : "National Head"}
                  </span>
                </p>
                <p className="text-muted-foreground">
                  CRUD changes immediately synchronize with the public site and persist to localStorage.
                </p>
              </div>
            </div>
            <DemoTag>Interactive Prototype State</DemoTag>
          </div>

          {/* TAB 1: ANALYTICS & DASHBOARD */}
          {safeTab === "analytics" && (
            <div className="space-y-8 animate-fade-in">
              {/* 8 KPI Cards */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-4">
                {[
                  { label: "Total Members", val: totalMembers, icon: "users" },
                  { label: "Active Academies", val: activeAcademies, icon: "shield" },
                  { label: "Registered Gyms", val: registeredGyms, icon: "dumbbell" },
                  { label: "Upcoming Events", val: upcomingChamps, icon: "trophy" },
                  { label: "Active Courses", val: activeCourses, icon: "book" },
                  { label: "Pending Affiliations", val: pendingAffiliations, icon: "flag" },
                  { label: "Shop Orders", val: shopOrders, icon: "bag" },
                  { label: "Open Enquiries", val: pendingEnquiries, icon: "chat" },
                ].map((k) => (
                  <div key={k.label} className="card p-5 shadow-sm">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="text-xs font-bold uppercase tracking-wider">
                        {k.label}
                      </span>
                      <Icon name={k.icon} className="h-4 w-4 text-primary" />
                    </div>
                    <p className="mt-2 font-display text-3xl font-black text-foreground">
                      {k.val}
                    </p>
                    <p className="mt-1 text-[11px] text-success font-semibold">
                      Sample metric (demo)
                    </p>
                  </div>
                ))}
              </div>

              {/* Inline SVG Charts */}
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Registration Trend Chart */}
                <div className="card p-6 shadow-sm">
                  <div className="flex items-center justify-between border-b pb-3">
                    <h3 className="font-display text-lg font-bold uppercase">
                      Member Registrations (2026 Trend)
                    </h3>
                    <Badge tone="ok">+18% MoM</Badge>
                  </div>
                  <div className="mt-4">
                    <svg viewBox="0 0 400 150" className="w-full" role="img" aria-label="Member Growth Chart">
                      <line x1="40" y1="120" x2="380" y2="120" stroke="currentColor" strokeOpacity="0.1" />
                      <line x1="40" y1="80" x2="380" y2="80" stroke="currentColor" strokeOpacity="0.1" />
                      <line x1="40" y1="40" x2="380" y2="40" stroke="currentColor" strokeOpacity="0.1" />

                      {/* Line series */}
                      <path
                        d="M 60 110 L 120 95 L 180 80 L 240 60 L 300 45 L 360 30"
                        fill="none"
                        stroke="var(--color-primary)"
                        strokeWidth="3.5"
                      />
                      {[
                        { m: "May", x: 60, y: 110, val: "420" },
                        { m: "Jun", x: 120, y: 95, val: "580" },
                        { m: "Jul", x: 180, y: 80, val: "750" },
                        { m: "Aug", x: 240, y: 60, val: "910" },
                        { m: "Sep", x: 300, y: 45, val: "1,120" },
                        { m: "Oct", x: 360, y: 30, val: "1,450" },
                      ].map((pt) => (
                        <g key={pt.m}>
                          <circle cx={pt.x} cy={pt.y} r="5" fill="var(--color-navy)" stroke="var(--color-primary)" strokeWidth="2" />
                          <text x={pt.x} y={pt.y - 10} textAnchor="middle" className="text-[10px] font-bold fill-foreground">
                            {pt.val}
                          </text>
                          <text x={pt.x} y="138" textAnchor="middle" className="text-[10px] fill-muted-foreground">
                            {pt.m}
                          </text>
                        </g>
                      ))}
                    </svg>
                  </div>
                </div>

                {/* Revenue & Transactions Chart */}
                <div className="card p-6 shadow-sm">
                  <div className="flex items-center justify-between border-b pb-3">
                    <h3 className="font-display text-lg font-bold uppercase">
                      Simulated Revenue Breakdown (₹ INR)
                    </h3>
                    <Badge tone="navy">Mock Financials</Badge>
                  </div>
                  <div className="mt-4">
                    <svg viewBox="0 0 400 150" className="w-full" role="img" aria-label="Revenue Bars">
                      {[
                        { cat: "Academy Fees", val: 82000, h: 85, x: 50 },
                        { cat: "Gym Pass", val: 64000, h: 65, x: 140 },
                        { cat: "Championships", val: 95000, h: 100, x: 230 },
                        { cat: "Shop Store", val: 51000, h: 50, x: 320 },
                      ].map((b) => (
                        <g key={b.cat}>
                          <rect
                            x={b.x}
                            y={120 - b.h}
                            width="40"
                            height={b.h}
                            rx="4"
                            className="fill-primary hover:opacity-80 transition-opacity cursor-pointer"
                          />
                          <text x={b.x + 20} y={115 - b.h} textAnchor="middle" className="text-[9px] font-bold fill-foreground">
                            ₹{(b.val / 1000).toFixed(0)}k
                          </text>
                          <text x={b.x + 20} y="136" textAnchor="middle" className="text-[9px] fill-muted-foreground truncate">
                            {b.cat}
                          </text>
                        </g>
                      ))}
                    </svg>
                  </div>
                </div>
              </div>

              {/* Recent Audit Activity Log */}
              <div className="card p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
                  <div>
                    <h3 className="font-display text-xl font-bold uppercase">
                      System Activity & Audit Trail
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Real-time log of administrative updates
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => downloadCSV("kalawar-activity-logs", db.logs ?? [])}
                    className="btn btn-outline !py-1.5 !px-3 !text-xs"
                  >
                    <Icon name="download" className="h-4 w-4" />
                    Export CSV
                  </button>
                </div>

                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b bg-muted/50 text-muted-foreground">
                        <th className="p-3 font-bold uppercase">ID</th>
                        <th className="p-3 font-bold uppercase">Actor</th>
                        <th className="p-3 font-bold uppercase">Action</th>
                        <th className="p-3 font-bold uppercase">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {(db.logs ?? []).slice(0, 8).map((l: Rec) => (
                        <tr key={l.id} className="hover:bg-muted/30">
                          <td className="p-3 font-mono font-semibold">{l.id}</td>
                          <td className="p-3 font-bold text-foreground">{l.actor}</td>
                          <td className="p-3">{l.action}</td>
                          <td className="p-3 text-muted-foreground">{l.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FEDERATION & BELTS */}
          {safeTab === "federation" && (
            <div className="space-y-8 animate-fade-in">
              {/* Header Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
                <div>
                  <h2 className="font-display text-2xl font-black uppercase">
                    Federation & Belt Governance
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    National hierarchy, academy affiliations, examinations and digital certificates
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => downloadCSV("kalawar-members", db.members ?? [])}
                    className="btn btn-outline !py-1.5 !px-3 !text-xs"
                  >
                    <Icon name="download" className="h-4 w-4" />
                    Export Members CSV
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCreateKind("members");
                      setFormData({
                        name: "",
                        sport: "Karate",
                        belt: "Yellow",
                        academy: "Shiroli Karate Dojo",
                        state: "Maharashtra",
                        status: "Active",
                      });
                    }}
                    className="btn btn-primary !py-1.5 !px-3 !text-xs"
                  >
                    <Icon name="plus" className="h-4 w-4" />
                    Add Member
                  </button>
                </div>
              </div>

              {/* Members Table */}
              <div className="card p-6 shadow-sm">
                <h3 className="font-display text-lg font-bold uppercase mb-3">
                  Registered Members & Athletes ({applyScope(db.members).length})
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b bg-muted/50 text-muted-foreground">
                        <th className="p-3 font-bold uppercase">Member ID</th>
                        <th className="p-3 font-bold uppercase">Name</th>
                        <th className="p-3 font-bold uppercase">Sport</th>
                        <th className="p-3 font-bold uppercase">Belt Grade</th>
                        <th className="p-3 font-bold uppercase">Academy</th>
                        <th className="p-3 font-bold uppercase">Status</th>
                        <th className="p-3 font-bold uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {applyScope(db.members).map((m: Rec) => (
                        <tr key={m.id} className="hover:bg-muted/30">
                          <td className="p-3 font-mono font-bold text-primary">{m.id}</td>
                          <td className="p-3 font-bold text-foreground">{m.name}</td>
                          <td className="p-3">{m.sport}</td>
                          <td className="p-3 font-semibold">{m.belt || "—"}</td>
                          <td className="p-3 text-muted-foreground">{m.academy}</td>
                          <td className="p-3">
                            <StatusPill s={m.status} />
                          </td>
                          <td className="p-3 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditItem({ col: "members", item: m });
                                setFormData({ ...m });
                              }}
                              className="rounded p-1 hover:bg-muted text-muted-foreground hover:text-foreground"
                              title="Edit"
                            >
                              <Icon name="edit" className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setConfirmDelete({ col: "members", id: m.id, name: m.name })
                              }
                              className="rounded p-1 hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                              title="Delete"
                            >
                              <Icon name="trash" className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Affiliations & Certs grid */}
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Affiliations */}
                <div className="card p-6 shadow-sm">
                  <h3 className="font-display text-lg font-bold uppercase mb-3">
                    Academy Affiliations ({applyScope(db.affiliations).length})
                  </h3>
                  <div className="space-y-3">
                    {applyScope(db.affiliations).map((a: Rec) => (
                      <div key={a.id} className="flex justify-between items-center rounded-xl border p-3.5">
                        <div>
                          <p className="font-bold text-foreground">{a.academy}</p>
                          <p className="text-xs text-muted-foreground">
                            State: {a.state} · Expiry: {a.expiry}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <StatusPill s={a.status} />
                          {a.status === "Pending" && (
                            <button
                              type="button"
                              onClick={() => {
                                upsert("affiliations", { ...a, status: "Approved" });
                                toast(`Approved affiliation for ${a.academy}`);
                              }}
                              className="btn btn-outline !py-1 !px-2.5 !text-[11px]"
                            >
                              Approve
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Certificates */}
                <div className="card p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-display text-lg font-bold uppercase">
                      Issued Certificates ({(db.certificates ?? []).length})
                    </h3>
                    <Link to="/verify" className="text-xs text-primary font-bold hover:underline">
                      Verify Page →
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {(db.certificates ?? []).map((c: Rec) => (
                      <div key={c.id} className="flex justify-between items-center rounded-xl border p-3.5">
                        <div>
                          <p className="font-mono text-xs font-bold text-primary">{c.id}</p>
                          <p className="font-bold text-foreground">{c.name}</p>
                          <p className="text-xs text-muted-foreground">{c.title} · {c.issued}</p>
                        </div>
                        <StatusPill s={c.status} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ACADEMIES & BATCHES */}
          {safeTab === "academies" && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
                <div>
                  <h2 className="font-display text-2xl font-black uppercase">
                    Multi-Sports Academies & Training Centers
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Manage multi-sport institutions, admission queues, batch timetables and branches
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setCreateKind("academies");
                    setFormData({
                      name: "",
                      sport: "Karate",
                      city: "Kolhapur",
                      state: "Maharashtra",
                      type: "Martial Arts",
                      coach: "Sensei R. Patil",
                      programs: "Beginner Batch, Advanced Squad",
                      status: "Open",
                      img: "martial",
                    });
                  }}
                  className="btn btn-primary !py-1.5 !px-3 !text-xs"
                >
                  <Icon name="plus" className="h-4 w-4" />
                  Add Academy
                </button>
              </div>

              {/* Academies Table */}
              <div className="card p-6 shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b bg-muted/50 text-muted-foreground">
                        <th className="p-3 font-bold uppercase">Academy Name</th>
                        <th className="p-3 font-bold uppercase">Sport</th>
                        <th className="p-3 font-bold uppercase">Location</th>
                        <th className="p-3 font-bold uppercase">Head Coach</th>
                        <th className="p-3 font-bold uppercase">Programs</th>
                        <th className="p-3 font-bold uppercase">Admission</th>
                        <th className="p-3 font-bold uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {applyScope(db.academies).map((a: Rec) => (
                        <tr key={a.id} className="hover:bg-muted/30">
                          <td className="p-3 font-bold text-foreground">{a.name}</td>
                          <td className="p-3">
                            <Badge tone="navy">{a.sport}</Badge>
                          </td>
                          <td className="p-3 text-muted-foreground">{a.city}, {a.state}</td>
                          <td className="p-3 font-semibold">{a.coach}</td>
                          <td className="p-3 text-muted-foreground line-clamp-1">{a.programs}</td>
                          <td className="p-3">
                            <StatusPill s={a.status} />
                          </td>
                          <td className="p-3 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditItem({ col: "academies", item: a });
                                setFormData({ ...a });
                              }}
                              className="rounded p-1 hover:bg-muted text-muted-foreground hover:text-foreground"
                              title="Edit"
                            >
                              <Icon name="edit" className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setConfirmDelete({ col: "academies", id: a.id, name: a.name })
                              }
                              className="rounded p-1 hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                              title="Delete"
                            >
                              <Icon name="trash" className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: GYM & FITNESS */}
          {safeTab === "gyms" && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
                <div>
                  <h2 className="font-display text-2xl font-black uppercase">
                    Gym & Fitness Center Operations
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Gym locations, membership subscriptions, group class capacities and trainer rosters
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setCreateKind("gyms");
                    setFormData({
                      name: "",
                      city: "Kolhapur",
                      state: "Maharashtra",
                      owner: "V. More",
                      branches: 2,
                      status: "Active",
                      img: "gym",
                    });
                  }}
                  className="btn btn-primary !py-1.5 !px-3 !text-xs"
                >
                  <Icon name="plus" className="h-4 w-4" />
                  Add Gym Branch
                </button>
              </div>

              {/* Gym Branches */}
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {(db.gyms ?? []).map((g: Rec) => (
                  <div key={g.id} className="card p-5 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-lg text-foreground">{g.name}</h4>
                        <p className="text-xs text-muted-foreground">{g.city}, {g.state}</p>
                      </div>
                      <StatusPill s={g.status} />
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2 rounded-lg bg-muted/40 p-3 text-xs">
                      <div>
                        <p className="text-muted-foreground">Owner</p>
                        <p className="font-bold">{g.owner}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Branches</p>
                        <p className="font-bold">{g.branches}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2 pt-2 border-t">
                      <button
                        type="button"
                        onClick={() => {
                          setEditItem({ col: "gyms", item: g });
                          setFormData({ ...g });
                        }}
                        className="btn btn-outline flex-1 !py-1 !text-xs"
                      >
                        Edit Details
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setConfirmDelete({ col: "gyms", id: g.id, name: g.name })
                        }
                        className="rounded p-2 text-destructive hover:bg-destructive/10"
                      >
                        <Icon name="trash" className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Group Classes Capacity Management */}
              <div className="card p-6 shadow-sm">
                <h3 className="font-display text-lg font-bold uppercase mb-4">
                  Group Classes & Batch Capacities
                </h3>
                <div className="grid gap-4 md:grid-cols-3">
                  {(db.classes ?? []).map((c: Rec) => (
                    <div key={c.id} className="rounded-xl border p-4">
                      <p className="font-bold">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.gym} · {c.time}</p>
                      <div className="my-3 h-2 rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full bg-primary"
                          style={{
                            width: `${Math.min(100, (c.booked / c.capacity) * 100)}%`,
                          }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span>{c.booked}/{c.capacity} booked</span>
                        <button
                          type="button"
                          onClick={() => {
                            upsert("classes", { ...c, booked: Math.max(0, c.booked - 1) });
                            toast("Check-in cleared for slot");
                          }}
                          className="text-primary hover:underline font-semibold"
                        >
                          Clear Slot
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: CHAMPIONSHIPS & DRAWS */}
          {safeTab === "championships" && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
                <div>
                  <h2 className="font-display text-2xl font-black uppercase">
                    Championships & Tournament Brackets
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Schedule championships, manage match draws and publish medal rankings
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setCreateKind("championships");
                    setFormData({
                      title: "",
                      sport: "Karate",
                      venue: "Kolhapur Sports Complex",
                      date: "2026-12-15",
                      deadline: "2026-12-01",
                      categories: "Senior, U-18",
                      status: "Open",
                      fee: 800,
                      img: "hero",
                    });
                  }}
                  className="btn btn-primary !py-1.5 !px-3 !text-xs"
                >
                  <Icon name="plus" className="h-4 w-4" />
                  Add Championship
                </button>
              </div>

              {/* Championships Table */}
              <div className="card p-6 shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b bg-muted/50 text-muted-foreground">
                        <th className="p-3 font-bold uppercase">Championship</th>
                        <th className="p-3 font-bold uppercase">Sport</th>
                        <th className="p-3 font-bold uppercase">Venue</th>
                        <th className="p-3 font-bold uppercase">Event Date</th>
                        <th className="p-3 font-bold uppercase">Entry Fee</th>
                        <th className="p-3 font-bold uppercase">Status</th>
                        <th className="p-3 font-bold uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {(db.championships ?? []).map((c: Rec) => (
                        <tr key={c.id} className="hover:bg-muted/30">
                          <td className="p-3 font-bold text-foreground">{c.title}</td>
                          <td className="p-3"><Badge tone="navy">{c.sport}</Badge></td>
                          <td className="p-3 text-muted-foreground">{c.venue}</td>
                          <td className="p-3 font-mono">{c.date}</td>
                          <td className="p-3 font-bold">{inr(c.fee)}</td>
                          <td className="p-3"><StatusPill s={c.status} /></td>
                          <td className="p-3 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditItem({ col: "championships", item: c });
                                setFormData({ ...c });
                              }}
                              className="rounded p-1 hover:bg-muted text-muted-foreground hover:text-foreground"
                              title="Edit"
                            >
                              <Icon name="edit" className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setConfirmDelete({ col: "championships", id: c.id, name: c.title })
                              }
                              className="rounded p-1 hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                              title="Delete"
                            >
                              <Icon name="trash" className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Match Fixtures Scorecard Updates */}
              <div className="card p-6 shadow-sm">
                <h3 className="font-display text-lg font-bold uppercase mb-3">
                  Match Draws & Fixtures Live Updater
                </h3>
                <div className="space-y-3">
                  {(db.fixtures ?? []).map((f: Rec) => (
                    <div key={f.id} className="flex flex-wrap justify-between items-center gap-3 rounded-xl border p-4">
                      <div>
                        <p className="text-xs font-bold uppercase text-primary">{f.championship}</p>
                        <p className="font-bold text-foreground text-sm">{f.match}: {f.players}</p>
                        <p className="text-xs text-muted-foreground font-mono">{f.time}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold bg-muted px-2.5 py-1 rounded text-xs">
                          {f.result}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const newScore = prompt("Enter updated match score/result:", f.result);
                            if (newScore) {
                              upsert("fixtures", { ...f, result: newScore });
                              toast("Updated match result");
                            }
                          }}
                          className="btn btn-outline !py-1 !px-2.5 !text-xs"
                        >
                          Update Score
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: COURSES & E-LEARNING */}
          {safeTab === "courses" && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
                <div>
                  <h2 className="font-display text-2xl font-black uppercase">
                    Courses & Sports E-Learning
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Manage martial arts syllabus, fitness education courses and certification exams
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setCreateKind("courses");
                    setFormData({
                      title: "",
                      category: "Martial Arts",
                      instructor: "Sensei R. Patil",
                      duration: "6 weeks",
                      level: "Beginner",
                      fee: 1499,
                      status: "Enrolling",
                      modules: "Module 1|Module 2|Module 3",
                      img: "martial",
                    });
                  }}
                  className="btn btn-primary !py-1.5 !px-3 !text-xs"
                >
                  <Icon name="plus" className="h-4 w-4" />
                  Add Course
                </button>
              </div>

              {/* Course list */}
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {(db.courses ?? []).map((c: Rec) => (
                  <div key={c.id} className="card p-5 shadow-sm">
                    <div className="flex justify-between items-start">
                      <Badge tone="navy">{c.category}</Badge>
                      <StatusPill s={c.status} />
                    </div>
                    <h4 className="mt-3 font-bold text-lg text-foreground">{c.title}</h4>
                    <p className="text-xs text-muted-foreground">{c.instructor} · {c.duration} · {c.level}</p>
                    <p className="mt-3 font-display text-2xl font-bold">{c.fee ? inr(c.fee) : "Free"}</p>

                    <div className="mt-4 flex gap-2 pt-2 border-t">
                      <button
                        type="button"
                        onClick={() => {
                          setEditItem({ col: "courses", item: c });
                          setFormData({ ...c });
                        }}
                        className="btn btn-outline flex-1 !py-1 !text-xs"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setConfirmDelete({ col: "courses", id: c.id, name: c.title })
                        }
                        className="rounded p-2 text-destructive hover:bg-destructive/10"
                      >
                        <Icon name="trash" className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: MEDIA & MODERATION */}
          {safeTab === "media" && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
                <div>
                  <h2 className="font-display text-2xl font-black uppercase">
                    Sports Media, Reels & Content Moderation
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Review user-reported media, manage demonstration reels and publish photo galleries
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setCreateKind("videos");
                    setFormData({
                      title: "",
                      creator: "KALAWAR Media",
                      category: "Martial Arts",
                      type: "reel",
                      views: 1200,
                      likes: 95,
                      status: "Published",
                      img: "martial",
                    });
                  }}
                  className="btn btn-primary !py-1.5 !px-3 !text-xs"
                >
                  <Icon name="plus" className="h-4 w-4" />
                  Add Video / Reel
                </button>
              </div>

              {/* User Reports & Moderation Queue */}
              <div className="card p-6 shadow-sm">
                <h3 className="font-display text-lg font-bold uppercase mb-3">
                  User Reports & Moderation Queue ({(db.reports ?? []).length})
                </h3>
                {(db.reports ?? []).length > 0 ? (
                  <div className="space-y-3">
                    {(db.reports ?? []).map((r: Rec) => (
                      <div key={r.id} className="flex flex-wrap justify-between items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4">
                        <div>
                          <p className="font-bold text-foreground">{r.content}</p>
                          <p className="text-xs text-muted-foreground">
                            Reason: <span className="font-semibold text-destructive">{r.reason}</span> · Reported by: {r.reporter}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              remove("reports", r.id);
                              toast("Content approved & report dismissed");
                            }}
                            className="btn btn-outline !py-1 !px-2.5 !text-xs"
                          >
                            Dismiss Report
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              remove("reports", r.id);
                              toast("Reported content removed");
                            }}
                            className="btn btn-primary !py-1 !px-2.5 !text-xs !bg-destructive"
                          >
                            Remove Content
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Empty text="Moderation queue is clear — no pending reports." />
                )}
              </div>

              {/* Videos list */}
              <div className="card p-6 shadow-sm">
                <h3 className="font-display text-lg font-bold uppercase mb-3">
                  Published Reels & Long-Form Content ({(db.videos ?? []).length})
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b bg-muted/50 text-muted-foreground">
                        <th className="p-3 font-bold uppercase">Title</th>
                        <th className="p-3 font-bold uppercase">Creator</th>
                        <th className="p-3 font-bold uppercase">Category</th>
                        <th className="p-3 font-bold uppercase">Format</th>
                        <th className="p-3 font-bold uppercase">Views</th>
                        <th className="p-3 font-bold uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {(db.videos ?? []).map((v: Rec) => (
                        <tr key={v.id} className="hover:bg-muted/30">
                          <td className="p-3 font-bold text-foreground">{v.title}</td>
                          <td className="p-3 font-semibold">{v.creator}</td>
                          <td className="p-3">{v.category}</td>
                          <td className="p-3 uppercase font-mono">{v.type}</td>
                          <td className="p-3 font-mono">{v.views.toLocaleString("en-IN")}</td>
                          <td className="p-3">
                            <button
                              type="button"
                              onClick={() =>
                                setConfirmDelete({ col: "videos", id: v.id, name: v.title })
                              }
                              className="rounded p-1 text-destructive hover:bg-destructive/10"
                            >
                              <Icon name="trash" className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: E-COMMERCE STORE */}
          {safeTab === "store" && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
                <div>
                  <h2 className="font-display text-2xl font-black uppercase">
                    E-Commerce Store & Product Catalogue
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Manage uniforms, protective gear, cricket/football equipment, orders and stock levels
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => downloadCSV("kalawar-products", db.products ?? [])}
                    className="btn btn-outline !py-1.5 !px-3 !text-xs"
                  >
                    <Icon name="download" className="h-4 w-4" />
                    Export Products CSV
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCreateKind("products");
                      setFormData({
                        name: "",
                        category: "Martial Arts Uniforms",
                        price: 1999,
                        discount: 0,
                        stock: 25,
                        sku: `KS-STORE-${Math.floor(100 + Math.random() * 900)}`,
                        sizes: "S,M,L,XL",
                        colors: "White,Black",
                        desc: "Sample product added from Admin Panel.",
                        img: "gear",
                      });
                    }}
                    className="btn btn-primary !py-1.5 !px-3 !text-xs"
                  >
                    <Icon name="plus" className="h-4 w-4" />
                    Add Product
                  </button>
                </div>
              </div>

              {/* Product Inventory Table */}
              <div className="card p-6 shadow-sm">
                <h3 className="font-display text-lg font-bold uppercase mb-3">
                  Product Inventory ({(db.products ?? []).length} items)
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b bg-muted/50 text-muted-foreground">
                        <th className="p-3 font-bold uppercase">SKU</th>
                        <th className="p-3 font-bold uppercase">Product Name</th>
                        <th className="p-3 font-bold uppercase">Category</th>
                        <th className="p-3 font-bold uppercase">Price (INR)</th>
                        <th className="p-3 font-bold uppercase">Stock</th>
                        <th className="p-3 font-bold uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {(db.products ?? []).map((p: Rec) => (
                        <tr key={p.id} className="hover:bg-muted/30">
                          <td className="p-3 font-mono font-bold text-primary">{p.sku}</td>
                          <td className="p-3 font-bold text-foreground">{p.name}</td>
                          <td className="p-3">{p.category}</td>
                          <td className="p-3 font-bold">
                            {inr(finalPrice(p))}
                            {p.discount > 0 && (
                              <span className="ml-1 text-[10px] text-muted-foreground line-through">
                                {inr(p.price)}
                              </span>
                            )}
                          </td>
                          <td className="p-3 font-mono font-semibold">
                            {p.stock > 0 ? (
                              <span className="text-success">{p.stock} units</span>
                            ) : (
                              <span className="text-destructive">Out of Stock</span>
                            )}
                          </td>
                          <td className="p-3 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditItem({ col: "products", item: p });
                                setFormData({ ...p });
                              }}
                              className="rounded p-1 hover:bg-muted text-muted-foreground hover:text-foreground"
                              title="Edit"
                            >
                              <Icon name="edit" className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setConfirmDelete({ col: "products", id: p.id, name: p.name })
                              }
                              className="rounded p-1 hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                              title="Delete"
                            >
                              <Icon name="trash" className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Order Status Management */}
              <div className="card p-6 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-display text-lg font-bold uppercase">
                    Order Dispatch & Tracking Management ({(db.orders ?? []).length})
                  </h3>
                  <button
                    type="button"
                    onClick={() => downloadCSV("kalawar-orders", db.orders ?? [])}
                    className="btn btn-outline !py-1 !px-2.5 !text-xs"
                  >
                    <Icon name="download" className="h-4 w-4" />
                    Export Orders
                  </button>
                </div>
                <div className="space-y-3">
                  {(db.orders ?? []).map((o: Rec) => (
                    <div key={o.id} className="flex flex-wrap justify-between items-center gap-4 rounded-xl border p-4">
                      <div>
                        <p className="font-mono font-bold text-sm text-primary">{o.id}</p>
                        <p className="font-bold text-foreground">{o.customer}</p>
                        <p className="text-xs text-muted-foreground">{o.items} · {o.date}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="font-bold text-sm">{inr(o.total)}</p>
                          <StatusPill s={o.status} />
                        </div>

                        {/* Status Change Select */}
                        <select
                          value={o.status}
                          onChange={(e) => {
                            upsert("orders", { ...o, status: e.target.value });
                            toast(`Updated order ${o.id} to ${e.target.value}`);
                          }}
                          className="field !h-8 !py-0.5 !text-xs font-semibold"
                        >
                          <option>Processing</option>
                          <option>Shipped</option>
                          <option>Delivered</option>
                          <option>Cancelled</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: FINANCE & SUBSCRIPTIONS */}
          {safeTab === "finance" && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
                <div>
                  <h2 className="font-display text-2xl font-black uppercase">
                    Finance, Transactions & Memberships
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Audit trail of mock payments, membership renewals and fee collections
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => downloadCSV("kalawar-transactions", db.transactions ?? [])}
                  className="btn btn-outline !py-1.5 !px-3 !text-xs"
                >
                  <Icon name="download" className="h-4 w-4" />
                  Export Transactions CSV
                </button>
              </div>

              {/* Transactions Log */}
              <div className="card p-6 shadow-sm">
                <h3 className="font-display text-lg font-bold uppercase mb-3">
                  Transaction Audit History
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b bg-muted/50 text-muted-foreground">
                        <th className="p-3 font-bold uppercase">Txn ID</th>
                        <th className="p-3 font-bold uppercase">Payer / Member</th>
                        <th className="p-3 font-bold uppercase">Purpose</th>
                        <th className="p-3 font-bold uppercase">Amount</th>
                        <th className="p-3 font-bold uppercase">Date</th>
                        <th className="p-3 font-bold uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {(db.transactions ?? []).map((t: Rec) => (
                        <tr key={t.id} className="hover:bg-muted/30">
                          <td className="p-3 font-mono font-bold text-primary">{t.id}</td>
                          <td className="p-3 font-bold text-foreground">{t.user}</td>
                          <td className="p-3">{t.purpose}</td>
                          <td className="p-3 font-bold">{inr(t.amount)}</td>
                          <td className="p-3 text-muted-foreground">{t.date}</td>
                          <td className="p-3"><StatusPill s={t.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Active Subscriptions */}
              <div className="card p-6 shadow-sm">
                <h3 className="font-display text-lg font-bold uppercase mb-3">
                  Active Recurring Subscriptions ({(db.subscriptions ?? []).length})
                </h3>
                <div className="grid gap-4 md:grid-cols-3">
                  {(db.subscriptions ?? []).map((s: Rec) => (
                    <div key={s.id} className="rounded-xl border p-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <p className="font-bold text-foreground">{s.user}</p>
                        <StatusPill s={s.status} />
                      </div>
                      <p className="text-xs text-muted-foreground font-semibold">Plan: {s.plan}</p>
                      <p className="text-[11px] text-muted-foreground">
                        Valid: {s.start} to {s.expiry}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          upsert("subscriptions", { ...s, status: "Active", expiry: "2027-04-30" });
                          toast(`Extended subscription for ${s.user}`);
                        }}
                        className="btn btn-outline w-full !py-1 !text-xs mt-2"
                      >
                        Simulate Renewal
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 10: BROADCAST TEMPLATES */}
          {safeTab === "notifications" && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
                <div>
                  <h2 className="font-display text-2xl font-black uppercase">
                    Notification Templates & Delivery Engine
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Draft, preview and simulate alerts across Push, Email, SMS/OTP and WhatsApp
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setCreateKind("templates");
                    setFormData({
                      channel: "Push",
                      title: "New Announcement",
                      recipients: "All registered members",
                      body: "KALAWAR Sports updates (simulated).",
                      status: "Draft",
                    });
                  }}
                  className="btn btn-primary !py-1.5 !px-3 !text-xs"
                >
                  <Icon name="plus" className="h-4 w-4" />
                  New Template
                </button>
              </div>

              {/* Templates Grid */}
              <div className="grid gap-6 md:grid-cols-2">
                {(db.templates ?? []).map((t: Rec) => (
                  <div key={t.id} className="card p-6 shadow-sm flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex justify-between items-center">
                        <Badge tone="navy">{t.channel}</Badge>
                        <Badge tone={t.status === "Dispatched" ? "ok" : "warn"}>{t.status}</Badge>
                      </div>
                      <h4 className="mt-2 text-lg font-bold text-foreground">{t.title}</h4>
                      <p className="text-xs font-semibold text-primary">Recipients: {t.recipients}</p>
                      <div className="mt-3 rounded-lg bg-muted/60 p-3 font-mono text-xs text-foreground/80">
                        {t.body}
                      </div>
                    </div>

                    <div className="pt-2 border-t flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          upsert("notifications", {
                            id: uid("NT"),
                            title: t.title,
                            body: t.body.replace("{name}", "Member").replace("{date}", "Soon"),
                            type: "Broadcast",
                            date: new Date().toISOString().slice(0, 10),
                            read: false,
                          });
                          upsert("templates", { ...t, status: "Dispatched" });
                          toast(`Simulated batch dispatch via ${t.channel}`);
                        }}
                        className="btn btn-primary flex-1 !py-1.5 !text-xs"
                      >
                        Simulate Dispatch
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setConfirmDelete({ col: "templates", id: t.id, name: t.title })
                        }
                        className="rounded p-2 text-destructive hover:bg-destructive/10"
                      >
                        <Icon name="trash" className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 11: SETTINGS & MOBILE APP */}
          {safeTab === "settings" && (
            <div className="space-y-8 animate-fade-in">
              <div className="border-b pb-4">
                <h2 className="font-display text-2xl font-black uppercase">
                  Website Settings, Policies & Mobile Integration
                </h2>
                <p className="text-xs text-muted-foreground">
                  Organization contact parameters, sports category flags and Android app integration placeholders
                </p>
              </div>

              {/* Android Integration Placeholder Section */}
              <div className="card overflow-hidden border-2 border-primary/40 bg-navy p-6 text-navy-foreground shadow-xl lg:p-8">
                <div className="grid items-center gap-8 lg:grid-cols-[1fr_260px]">
                  <div>
                    <span className="inline-block rounded-full bg-primary/20 px-3 py-1 text-xs font-bold text-primary uppercase tracking-wider">
                      Android Ecosystem Roadmap
                    </span>
                    <h3 className="mt-3 font-display text-3xl font-black uppercase text-navy-foreground">
                      Mobile App Coming Soon
                    </h3>
                    <p className="mt-2 text-sm text-navy-foreground/80 leading-relaxed">
                      The KALAWAR Sports Android app will synchronize athlete registrations, attendance
                      biometrics, championship draws, live video feeds, and offline digital membership passes
                      through centralized RESTful endpoints.
                    </p>

                    <div className="mt-6 grid grid-cols-2 gap-3 text-xs">
                      <div className="rounded-lg bg-navy-2 p-3">
                        <p className="text-navy-foreground/60">Deep-link Scheme</p>
                        <p className="font-mono font-bold text-primary">kalawar://app/home</p>
                      </div>
                      <div className="rounded-lg bg-navy-2 p-3">
                        <p className="text-navy-foreground/60">Shared Data Schema</p>
                        <p className="font-bold text-success">Unified React/Android Model</p>
                      </div>
                    </div>
                  </div>

                  {/* HTML / CSS Phone Mockup */}
                  <div className="mx-auto w-56 rounded-[36px] border-4 border-navy-2 bg-navy p-3 shadow-2xl">
                    <div className="h-3 w-16 mx-auto rounded-full bg-navy-2 mb-2" />
                    <div className="aspect-[9/18] w-full rounded-[24px] bg-background p-3 text-foreground flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-[8px] font-bold">
                          <span>9:41</span>
                          <span>5G 100%</span>
                        </div>
                        <div className="mt-3 text-center">
                          <p className="font-display font-black text-xs text-primary">KALAWAR</p>
                          <p className="text-[7px] text-muted-foreground">ATHLETE PORTAL</p>
                        </div>
                        <div className="mt-3 h-10 rounded bg-navy p-1 text-[8px] text-navy-foreground">
                          <p className="font-bold">Next Match: 10:00 AM</p>
                          <p className="text-[7px] opacity-75">Kolhapur Stadium</p>
                        </div>
                      </div>
                      <div className="text-center text-[8px] font-bold text-primary">
                        • Synchronized Prototype •
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Organization Contact Details Settings */}
              <div className="card p-6 shadow-sm space-y-4">
                <h3 className="font-display text-lg font-bold uppercase">
                  Website Configuration & Contact Details
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {(db.settings ?? []).map((s: Rec) => (
                    <div key={s.id} className="rounded-lg border p-3">
                      <p className="text-xs font-bold text-muted-foreground uppercase">{s.key}</p>
                      <input
                        type="text"
                        value={s.value}
                        onChange={(e) => {
                          upsert("settings", { ...s, value: e.target.value });
                        }}
                        className="field mt-1 !text-xs font-semibold"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Homepage & Promotional Banners Manager */}
              <div className="card p-6 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
                  <div>
                    <h3 className="font-display text-lg font-bold uppercase">
                      Homepage & Promotional Banners
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Control active announcement strips and promotional hero alerts across the portal
                    </p>
                  </div>
                  <Badge tone="navy">{(db.banners ?? []).length} Banners</Badge>
                </div>

                {/* Add Banner Inline Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newBannerTitle.trim()) return;
                    upsert("banners", {
                      id: uid("BN"),
                      title: newBannerTitle.trim(),
                      section: newBannerSection,
                      status: "Active",
                    });
                    toast(`Created banner "${newBannerTitle.trim()}"`);
                    setNewBannerTitle("");
                  }}
                  className="flex flex-wrap items-center gap-3 rounded-xl border bg-muted/20 p-4"
                >
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-[11px] font-bold uppercase text-muted-foreground">
                      Banner Title / Announcement Text
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. State Championship Registrations Closing Soon"
                      value={newBannerTitle}
                      onChange={(e) => setNewBannerTitle(e.target.value)}
                      className="field mt-1 !text-xs"
                      required
                    />
                  </div>
                  <div className="w-48">
                    <label className="block text-[11px] font-bold uppercase text-muted-foreground">
                      Placement Section
                    </label>
                    <select
                      value={newBannerSection}
                      onChange={(e) => setNewBannerSection(e.target.value)}
                      className="field mt-1 !text-xs font-semibold"
                    >
                      <option>Home Strip</option>
                      <option>Home Hero</option>
                      <option>Global Header</option>
                      <option>Championships</option>
                    </select>
                  </div>
                  <div className="self-end">
                    <button type="submit" className="btn btn-primary !py-2 !px-4 !text-xs">
                      <Icon name="plus" className="h-4 w-4" />
                      Add Banner
                    </button>
                  </div>
                </form>

                {/* Banners List */}
                <div className="space-y-3">
                  {(db.banners ?? []).map((b: Rec) => (
                    <div
                      key={b.id}
                      className="flex flex-wrap items-center justify-between gap-4 rounded-xl border p-4 hover:bg-muted/10 transition-colors"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-primary">{b.id}</span>
                          <Badge tone="navy">{b.section}</Badge>
                          <StatusPill s={b.status} />
                        </div>
                        <p className="mt-1 font-bold text-sm text-foreground">{b.title}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const nextStatus = b.status === "Active" ? "Inactive" : "Active";
                            upsert("banners", { ...b, status: nextStatus });
                            toast(`Banner ${b.id} set to ${nextStatus}`);
                          }}
                          className={`btn !py-1 !px-3 !text-xs ${
                            b.status === "Active" ? "btn-outline text-success" : "btn-outline text-muted-foreground"
                          }`}
                        >
                          {b.status === "Active" ? "Deactivate" : "Activate"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDelete({ col: "banners", id: b.id, name: b.title })}
                          className="rounded p-2 text-destructive hover:bg-destructive/10"
                          title="Delete Banner"
                        >
                          <Icon name="trash" className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Configurable Sports Disciplines & Categories Engine */}
              <div className="card p-6 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
                  <div>
                    <h3 className="font-display text-lg font-bold uppercase">
                      Configurable Sports Disciplines & Categories
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Register sports disciplines and combat forms dynamically across academy directories, filters, and championships
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge tone="navy">{(db.sports ?? []).length} Disciplines</Badge>
                    <button
                      type="button"
                      onClick={() => downloadCSV("kalawar-sports-categories", db.sports ?? [])}
                      className="btn btn-outline !py-1 !px-2.5 !text-xs"
                    >
                      <Icon name="download" className="h-4 w-4" />
                      Export CSV
                    </button>
                  </div>
                </div>

                {/* Quick Add Sport Category */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newSportName.trim()) return;
                    const exists = (db.sports ?? []).some(
                      (s: Rec) => s.name.toLowerCase() === newSportName.trim().toLowerCase()
                    );
                    if (exists) {
                      toast(`Sport "${newSportName.trim()}" is already registered`);
                      return;
                    }
                    upsert("sports", {
                      id: uid("SP"),
                      name: newSportName.trim(),
                      status: "Active",
                      img: newSportImg,
                    });
                    toast(`Registered new sport category: ${newSportName.trim()}`);
                    setNewSportName("");
                  }}
                  className="flex flex-wrap items-center gap-3 rounded-xl border bg-muted/20 p-4"
                >
                  <div className="flex-1 min-w-[180px]">
                    <label className="block text-[11px] font-bold uppercase text-muted-foreground">
                      Sport Discipline Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Archery, Shooting, Fencing, Judo, Wushu, Kickboxing"
                      value={newSportName}
                      onChange={(e) => setNewSportName(e.target.value)}
                      className="field mt-1 !text-xs"
                      required
                    />
                  </div>
                  <div className="w-48">
                    <label className="block text-[11px] font-bold uppercase text-muted-foreground">
                      Visual / Sport Theme
                    </label>
                    <select
                      value={newSportImg}
                      onChange={(e) => setNewSportImg(e.target.value)}
                      className="field mt-1 !text-xs font-semibold"
                    >
                      <option value="martial">Martial Arts & Combat</option>
                      <option value="gym">Gym & Fitness</option>
                      <option value="hero">Team & Field</option>
                      <option value="gear">Equipment & Gear</option>
                    </select>
                  </div>
                  <div className="self-end">
                    <button type="submit" className="btn btn-primary !py-2 !px-4 !text-xs">
                      <Icon name="plus" className="h-4 w-4" />
                      Register Sport
                    </button>
                  </div>
                </form>

                {/* Sports Grid */}
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 max-h-[360px] overflow-y-auto p-1">
                  {(db.sports ?? []).map((s: Rec) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between gap-2 rounded-xl border p-3 hover:border-primary/40 transition-colors"
                    >
                      <div>
                        <p className="font-bold text-xs text-foreground">{s.name}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="font-mono text-[10px] text-muted-foreground">{s.id}</span>
                          <span className="text-[10px] text-muted-foreground">· {s.img}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            const nextStatus = s.status === "Active" ? "Inactive" : "Active";
                            upsert("sports", { ...s, status: nextStatus });
                            toast(`${s.name} is now ${nextStatus}`);
                          }}
                          className={`rounded px-2 py-0.5 text-[10px] font-bold border transition-colors ${
                            s.status === "Active"
                              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : "border-muted bg-muted text-muted-foreground"
                          }`}
                        >
                          {s.status ?? "Active"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDelete({ col: "sports", id: s.id, name: s.name })}
                          className="rounded p-1 text-destructive hover:bg-destructive/10"
                          title={`Delete ${s.name}`}
                        >
                          <Icon name="trash" className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Reusable Form Modal for Create / Edit */}
      <Modal
        open={!!createKind || !!editItem}
        onClose={() => {
          setCreateKind(null);
          setEditItem(null);
          setFormData({});
        }}
        title={`${editItem ? "Edit" : "Add New"} ${createKind || editItem?.col || "Record"}`}
      >
        <form onSubmit={handleSaveForm} className="space-y-4">
          {Object.entries(formData)
            .filter(([k]) => k !== "id" && k !== "img")
            .map(([k, val]) => (
              <div key={k}>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {k}
                </label>
                <input
                  type={typeof val === "number" ? "number" : "text"}
                  value={val}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [k]: typeof val === "number" ? +e.target.value : e.target.value,
                    })
                  }
                  className="field mt-1"
                  required
                />
              </div>
            ))}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <button
              type="button"
              onClick={() => {
                setCreateKind(null);
                setEditItem(null);
                setFormData({});
              }}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Record
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirmation Dialog for Delete */}
      <Modal
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Confirm Deletion"
      >
        <div className="space-y-4">
          <p className="text-sm">
            Are you sure you want to delete{" "}
            <span className="font-bold text-foreground">{confirmDelete?.name}</span> (ID:{" "}
            {confirmDelete?.id})? This will immediately remove it from the demonstration database.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setConfirmDelete(null)}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="btn btn-primary !bg-destructive"
            >
              Confirm Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
