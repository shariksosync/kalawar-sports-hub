import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { initialDb, type Rec } from "@/data/mock";

// Prototype state only. localStorage is used to persist DEMO data — it is not a database.
type CartItem = { id: string; qty: number; size?: string; color?: string };
type Session = { email: string; name: string; role: string } | null;
type User = { name: string; email: string; phone: string } | null;

type Store = {
  db: Record<string, Rec[]>;
  upsert: (col: string, rec: Rec) => Rec;
  remove: (col: string, id: string) => void;
  cart: CartItem[];
  addToCart: (id: string, qty?: number, opts?: { size?: string; color?: string }) => void;
  setQty: (id: string, qty: number) => void;
  clearCart: () => void;
  wishlist: string[];
  toggleWish: (id: string) => void;
  liked: string[]; saved: string[]; following: string[];
  toggleIn: (k: "liked" | "saved" | "following", id: string) => void;
  session: Session;
  login: (s: NonNullable<Session>, remember: boolean) => void;
  logout: () => void;
  setRole: (role: string) => void;
  user: User;
  setUser: (u: User) => void;
  toast: (msg: string, kind?: "ok" | "err") => void;
  resetDemo: () => void;
};

const Ctx = createContext<Store | null>(null);
const KEY = "kalawar-demo-v1";
export const uid = (p: string) => `${p}-${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 99)}`;
export const clean = (s: string) => String(s ?? "").replace(/[<>]/g, "").trim().slice(0, 2000);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [db, setDb] = useState(initialDb);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWish] = useState<string[]>([]);
  const [lists, setLists] = useState({ liked: [] as string[], saved: [] as string[], following: [] as string[] });
  const [session, setSession] = useState<Session>(null);
  const [remember, setRemember] = useState(true);
  const [user, setUser] = useState<User>(null);
  const [toasts, setToasts] = useState<{ id: number; msg: string; kind: string }[]>([]);
  const loaded = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (s.db) setDb({ ...initialDb, ...s.db });
        if (s.cart) setCart(s.cart);
        if (s.wishlist) setWish(s.wishlist);
        if (s.lists) setLists(s.lists);
        if (s.user) setUser(s.user);
      }
      const ses = localStorage.getItem(KEY + "-session") || sessionStorage.getItem(KEY + "-session");
      if (ses) setSession(JSON.parse(ses));
    } catch {}
    loaded.current = true;
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    localStorage.setItem(KEY, JSON.stringify({ db, cart, wishlist, lists, user }));
  }, [db, cart, wishlist, lists, user]);

  useEffect(() => {
    if (!loaded.current) return;
    localStorage.removeItem(KEY + "-session");
    sessionStorage.removeItem(KEY + "-session");
    if (session) (remember ? localStorage : sessionStorage).setItem(KEY + "-session", JSON.stringify(session));
  }, [session, remember]);

  const toast = useCallback((msg: string, kind: "ok" | "err" = "ok") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  const log = (action: string) =>
    setDb((d) => ({ ...d, logs: [{ id: uid("LG"), actor: session?.name ?? "Visitor", action, date: new Date().toISOString().slice(0, 16).replace("T", " ") }, ...(d.logs ?? [])] }));

  const store: Store = useMemo(() => ({
    db,
    upsert: (col, rec) => {
      const r = { ...rec, id: rec.id || uid(col.slice(0, 3).toUpperCase()) };
      setDb((d) => {
        const list = d[col] ?? [];
        const exists = list.some((x) => x.id === r.id);
        return { ...d, [col]: exists ? list.map((x) => (x.id === r.id ? r : x)) : [r, ...list] };
      });
      if (col !== "logs" && col !== "comments") log(`Saved ${col} record ${r.id}`);
      return r;
    },
    remove: (col, id) => { setDb((d) => ({ ...d, [col]: (d[col] ?? []).filter((x) => x.id !== id) })); log(`Deleted ${col} record ${id}`); },
    cart,
    addToCart: (id, qty = 1, opts) => {
      setCart((c) => { const f = c.find((x) => x.id === id); return f ? c.map((x) => (x.id === id ? { ...x, qty: x.qty + qty } : x)) : [...c, { id, qty, ...opts }]; });
      toast("Added to cart");
    },
    setQty: (id, qty) => setCart((c) => (qty <= 0 ? c.filter((x) => x.id !== id) : c.map((x) => (x.id === id ? { ...x, qty } : x)))),
    clearCart: () => setCart([]),
    wishlist,
    toggleWish: (id) => setWish((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id])),
    ...lists,
    toggleIn: (k, id) => setLists((l) => ({ ...l, [k]: l[k].includes(id) ? l[k].filter((x) => x !== id) : [...l[k], id] })),
    session,
    login: (s, rem) => { setRemember(rem); setSession(s); },
    logout: () => setSession(null),
    setRole: (role) => setSession((s) => (s ? { ...s, role } : s)),
    user, setUser,
    toast,
    resetDemo: () => { setDb(initialDb); setCart([]); setWish([]); toast("Demo data reset"); },
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [db, cart, wishlist, lists, session, user, toast]);

  return (
    <Ctx.Provider value={store}>
      {children}
      <div aria-live="polite" className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
        {toasts.map((t) => (
          <div key={t.id} className={`rounded-lg px-4 py-3 text-sm font-medium shadow-lg ${t.kind === "err" ? "bg-destructive text-destructive-foreground" : "bg-navy text-navy-foreground"}`}>
            {t.kind === "ok" && <span className="mr-2 text-primary">●</span>}{t.msg}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStore outside provider");
  return s;
}

export const inr = (n: number) => "₹" + Math.round(Number(n) || 0).toLocaleString("en-IN");
export const finalPrice = (p: Rec) => Math.round(p.price * (1 - (p.discount || 0) / 100));

// Validation helpers
export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
export const isPhone = (v: string) => /^(\+91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}$/.test(v.trim());

export function toCSV(rows: Rec[]) {
  if (!rows.length) return "";
  const keys = Object.keys(rows[0]);
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  return [keys.join(","), ...rows.map((r) => keys.map((k) => esc(r[k])).join(","))].join("\n");
}
export function downloadCSV(name: string, rows: Rec[]) {
  const blob = new Blob([toCSV(rows)], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${name}-sample.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}

// Centralized search config — add a category here to extend global search.
export const SEARCH_CONFIG: { col: string; label: string; fields: string[]; title: string; to: string }[] = [
  { col: "members", label: "Students & Athletes", fields: ["name", "sport", "academy"], title: "name", to: "/federation" },
  { col: "trainers", label: "Coaches & Trainers", fields: ["name", "specialty", "city"], title: "name", to: "/gym" },
  { col: "referees", label: "Referees", fields: ["name", "sport"], title: "name", to: "/federation" },
  { col: "academies", label: "Academies", fields: ["name", "sport", "city"], title: "name", to: "/academies" },
  { col: "gyms", label: "Gyms", fields: ["name", "city"], title: "name", to: "/gym" },
  { col: "sports", label: "Sports", fields: ["name"], title: "name", to: "/academies" },
  { col: "programs", label: "Fitness Content", fields: ["name", "desc"], title: "name", to: "/gym" },
  { col: "videos", label: "Videos & Reels", fields: ["title", "creator", "category"], title: "title", to: "/media" },
  { col: "courses", label: "Courses", fields: ["title", "category", "instructor"], title: "title", to: "/courses" },
  { col: "championships", label: "Championships", fields: ["title", "sport", "venue"], title: "title", to: "/championships" },
  { col: "events", label: "Events", fields: ["title", "place"], title: "title", to: "/news" },
  { col: "news", label: "News", fields: ["title", "category"], title: "title", to: "/news" },
  { col: "products", label: "Products", fields: ["name", "category", "sku"], title: "name", to: "/shop" },
];
export function globalSearch(db: Record<string, Rec[]>, q: string) {
  const s = q.trim().toLowerCase();
  if (!s) return [];
  return SEARCH_CONFIG.map((c) => ({
    ...c,
    items: (db[c.col] ?? []).filter((r) => c.fields.some((f) => String(r[f] ?? "").toLowerCase().includes(s))),
  })).filter((g) => g.items.length);
}
