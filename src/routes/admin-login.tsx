import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { clean, isEmail, useStore } from "@/lib/store";
import { DemoTag, Icon, Modal } from "@/components/kit";
import { Wordmark, seo } from "@/components/site";

export const Route = createFileRoute("/admin-login")({
  head: () =>
    seo(
      "Admin Login",
      "KALAWAR Sports administrative portal login for federations, academies and system administrators."
    ),
  component: AdminLogin,
});

const DEMO_ADMIN = {
  email: "admin@kalawarsports.demo",
  password: "KalawarDemo123",
  role: "Super Admin",
  name: "Santosh Kasabe (Admin)",
};

function AdminLogin() {
  const { session, login, toast } = useStore();
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [busy, setBusy] = useState(false);

  const handleFillDemo = () => {
    setEmail(DEMO_ADMIN.email);
    setPassword(DEMO_ADMIN.password);
    toast("Demo credentials filled");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return toast("Please enter your admin email or username", "err");
    if (!password) return toast("Please enter your password", "err");

    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      // Demo validation check
      if (email.toLowerCase() === DEMO_ADMIN.email.toLowerCase() && password === DEMO_ADMIN.password) {
        login(
          {
            email: DEMO_ADMIN.email,
            name: DEMO_ADMIN.name,
            role: DEMO_ADMIN.role,
          },
          remember
        );
        toast("Authenticated as Super Admin");
        nav({ to: "/admin" as any });
      } else {
        // Allow demo login for other roles or arbitrary admin usernames with warning
        login(
          {
            email: clean(email),
            name: clean(email.split("@")[0].replace(/[._]/g, " ").toUpperCase()),
            role: "Super Admin",
          },
          remember
        );
        toast("Logged in in demo mode");
        nav({ to: "/admin" as any });
      }
    }, 400);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !isEmail(forgotEmail)) return toast("Please enter a valid email", "err");
    toast(`Demo password reset link dispatched to ${forgotEmail}`);
    setForgotOpen(false);
    setForgotEmail("");
  };

  return (
    <div className="flex min-h-screen flex-col bg-navy text-navy-foreground">
      {/* Top Navbar */}
      <header className="border-b border-navy-2 px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Wordmark light />
          <Link to="/" className="text-xs font-semibold text-navy-foreground/75 hover:text-primary">
            ← Back to Public Website
          </Link>
        </div>
      </header>

      {/* Main Login Area */}
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="card border-navy-2 bg-navy-2/60 p-6 shadow-2xl backdrop-blur sm:p-8">
            <div className="text-center">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-primary font-display text-2xl font-black text-primary-foreground">
                K
              </span>
              <h1 className="mt-4 font-display text-3xl font-black uppercase tracking-wider text-navy-foreground">
                Admin Control Portal
              </h1>
              <p className="mt-1 text-xs text-navy-foreground/70">
                Centralized management for KALAWAR Sports ecosystem
              </p>
            </div>

            {/* Demo Notice Banner */}
            <div className="mt-6 rounded-xl border border-primary/40 bg-primary/10 p-3.5 text-xs">
              <div className="flex items-start gap-2.5">
                <Icon name="shield" className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-primary uppercase tracking-wide">
                    Demonstration Mode
                  </p>
                  <p className="text-navy-foreground/80">
                    This login is a client-side prototype. Do not enter real production credentials.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Demo Credentials Panel */}
            <div className="mt-4 rounded-xl border border-navy-2 bg-navy p-3 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-navy-foreground/60">Email: <span className="font-mono text-primary font-bold">admin@kalawarsports.demo</span></p>
                  <p className="text-navy-foreground/60">Pass: <span className="font-mono text-primary font-bold">KalawarDemo123</span></p>
                </div>
                <button
                  type="button"
                  onClick={handleFillDemo}
                  className="rounded-lg bg-primary/20 px-2.5 py-1 text-[11px] font-bold text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  Auto-Fill
                </button>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-navy-foreground/80">
                  Admin Email / Username
                </label>
                <div className="relative mt-1">
                  <Icon
                    name="mail"
                    className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-foreground/40"
                  />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@kalawarsports.demo"
                    className="field !bg-navy !pl-10 !text-navy-foreground placeholder:text-navy-foreground/30 focus:!border-primary"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-navy-foreground/80">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setForgotOpen(true)}
                    className="text-[11px] text-primary hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative mt-1">
                  <Icon
                    name="shield"
                    className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-foreground/40"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="field !bg-navy !pl-10 !pr-10 !text-navy-foreground placeholder:text-navy-foreground/30 focus:!border-primary"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-foreground/50 hover:text-navy-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <Icon name="eye" className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-navy-foreground/80">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="rounded accent-primary"
                  />
                  Remember session
                </label>
                <span className="text-[11px] text-navy-foreground/50">Demo Token: ACTIVE</span>
              </div>

              <button
                type="submit"
                disabled={busy}
                className="btn btn-primary w-full !py-2.5 font-bold uppercase tracking-wider"
              >
                {busy ? "Authenticating…" : "Access Dashboard"}
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-xs text-navy-foreground/50">
            © {new Date().getFullYear()} KALAWAR Sports · Administrative Prototype
          </p>
        </div>
      </main>

      {/* Forgot Password Modal */}
      <Modal open={forgotOpen} onClose={() => setForgotOpen(false)} title="Reset Admin Password (Demo)">
        <form onSubmit={handleForgotSubmit} className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Enter your administrative email to simulate receiving a password reset code.
          </p>
          <div>
            <label className="block text-xs font-bold uppercase text-muted-foreground">Admin Email</label>
            <input
              type="email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              placeholder="admin@kalawarsports.demo"
              className="field mt-1"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-full">
            Dispatch Reset Code (Simulated)
          </button>
        </form>
      </Modal>
    </div>
  );
}
