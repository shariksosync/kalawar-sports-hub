import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { inr, uid, useStore } from "@/lib/store";
import { Fields, Icon, Section, validate, type FieldDef } from "@/components/kit";
import { Site, seo } from "@/components/site";
import { useCartLines } from "./cart";

export const Route = createFileRoute("/checkout")({
  head: () => seo("Checkout", "Demo checkout — no money will be charged."),
  component: Checkout,
});

const ADDR: FieldDef[] = [
  { name: "name", label: "Full name", required: true }, { name: "phone", label: "Mobile", type: "tel", required: true },
  { name: "email", label: "Email", type: "email", required: true }, { name: "pin", label: "PIN code", required: true },
  { name: "line", label: "Address", type: "textarea", required: true }, { name: "city", label: "City", required: true },
  { name: "state", label: "State", required: true },
];
const SAMPLE = { name: "Aarav Patil", phone: "+91 98765 43210", email: "aarav@example.com", pin: "416122", line: "Plot 12, Savarkar Nagar", city: "Kolhapur", state: "Maharashtra" };

function Checkout() {
  const { upsert, clearCart, toast, db } = useStore();
  const { lines, total } = useCartLines();
  const [v, setV] = useState<Record<string, string>>({}); const [e, setE] = useState<Record<string, string>>({});
  const [pay, setPay] = useState(""); const [busy, setBusy] = useState(false); const [order, setOrder] = useState<string | null>(null);
  const place = (ev: React.FormEvent) => {
    ev.preventDefault();
    const errs = validate(ADDR, v); if (!pay) errs.pay = "Choose a payment method"; setE(errs);
    if (Object.keys(errs).length) return toast("Please complete the form", "err");
    setBusy(true);
    setTimeout(() => {
      const id = uid("ORD");
      upsert("orders", { id, customer: v.name, items: lines.map((l) => `${l.p!.name} x${l.qty}`).join(", "), total, date: new Date().toISOString().slice(0, 10), status: "Processing", payment: `${pay} (demo)`, address: `${v.line}, ${v.city}, ${v.state} ${v.pin}` });
      lines.forEach((l) => { const p = db.products.find((x) => x.id === l.id)!; upsert("products", { ...p, stock: Math.max(0, p.stock - l.qty) }); });
      upsert("transactions", { id: uid("TXN"), user: v.name, purpose: `Shop order ${id}`, amount: total, date: new Date().toISOString().slice(0, 10), status: "Success (demo)" });
      upsert("notifications", { id: uid("NT"), title: "Order placed (demo)", body: `Order ${id} for ${inr(total)} confirmed.`, type: "Payment", date: new Date().toISOString().slice(0, 10), read: false });
      clearCart(); setOrder(id); setBusy(false);
    }, 900);
  };
  if (order) return <Site><Section title="Order confirmed"><div className="card mx-auto max-w-lg p-8 text-center"><div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-success text-success-foreground"><Icon name="check" /></div><p className="text-xl font-bold">Thank you!</p><p className="mt-1 text-muted-foreground">Order <b>{order}</b> placed. Demo Payment — No Money Was Charged.</p><div className="mt-5 flex justify-center gap-2"><Link to="/orders" className="btn btn-primary">View orders</Link><Link to="/shop" className="btn btn-outline">Keep shopping</Link></div></div></Section></Site>;
  if (!lines.length) return <Site><Section title="Checkout"><p className="mb-4">Your cart is empty.</p><Link to="/shop" className="btn btn-primary">Go to shop</Link></Section></Site>;
  return (
    <Site>
      <Section title="Checkout">
        <p className="mb-6 rounded-lg border-2 border-dashed border-primary bg-accent p-4 font-semibold text-accent-foreground">Demo Payment — No Money Will Be Charged. Do not enter real card numbers, CVV, UPI PIN or banking passwords.</p>
        <form onSubmit={place} noValidate className="grid gap-8 lg:grid-cols-[1fr_340px]">
          <div className="space-y-6">
            <div className="card p-6"><div className="mb-4 flex items-center justify-between"><h3 className="text-xl font-bold uppercase">Shipping address</h3><button type="button" className="text-sm font-semibold text-accent-foreground underline" onClick={() => setV(SAMPLE)}>Fill sample data</button></div><Fields defs={ADDR} values={v} errors={e} onChange={(n, x) => setV((o) => ({ ...o, [n]: x }))} /></div>
            <fieldset className="card p-6"><legend className="px-1 text-xl font-bold uppercase">Payment method (proposed)</legend>
              <div className="mt-2 grid gap-3 sm:grid-cols-3">{["UPI", "Debit/Credit Card", "Net Banking"].map((m) => <label key={m} className={`cursor-pointer rounded-lg border p-4 text-sm font-semibold ${pay === m ? "border-primary bg-accent" : ""}`}><input type="radio" name="pay" className="mr-2" checked={pay === m} onChange={() => setPay(m)} />{m}</label>)}</div>
              {e.pay && <p className="mt-2 text-xs text-destructive">{e.pay}</p>}
              <p className="mt-3 text-xs text-muted-foreground">Integration placeholder: a provider such as Razorpay can be connected later. Gateway not configured in demo.</p>
            </fieldset>
          </div>
          <div className="card h-fit space-y-2 p-6">{lines.map((l) => <div key={l.id} className="flex justify-between text-sm"><span>{l.p!.name} ×{l.qty}</span></div>)}<div className="flex justify-between border-t pt-2 text-lg font-bold"><span>Total</span><span>{inr(total)}</span></div><button disabled={busy} className="btn btn-primary w-full">{busy ? "Processing demo payment…" : "Place demo order"}</button></div>
        </form>
      </Section>
    </Site>
  );
}
