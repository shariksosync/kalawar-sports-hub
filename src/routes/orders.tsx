import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { clean, inr, uid, useStore } from "@/lib/store";
import { DemoTag, Empty, Modal, Section } from "@/components/kit";
import { Site, StatusPill, seo } from "@/components/site";
import type { Rec } from "@/data/mock";

export const Route = createFileRoute("/orders")({
  head: () => seo("Order History", "Your demo orders, simulated shipment tracking and refund requests."),
  component: Orders,
});

const STEPS = ["Processing", "Shipped", "Out for delivery", "Delivered"];

function Orders() {
  const { db, upsert, toast } = useStore();
  const [track, setTrack] = useState<Rec | null>(null); const [req, setReq] = useState<Rec | null>(null);
  const [type, setType] = useState("Refund"); const [reason, setReason] = useState("");
  return (
    <Site>
      <Section title="Order history" action={<DemoTag>Simulated tracking — no courier connected</DemoTag>}>
        {db.orders.length ? <div className="space-y-3">{db.orders.map((o) => (
          <div key={o.id} className="card flex flex-wrap items-center justify-between gap-3 p-5">
            <div><p className="font-bold">{o.id} <StatusPill s={o.status} /></p><p className="text-sm text-muted-foreground">{o.date} · {o.items}</p></div>
            <div className="flex items-center gap-2"><span className="font-bold">{inr(o.total)}</span><button className="btn btn-outline" onClick={() => setTrack(o)}>Track</button><button className="btn btn-outline" onClick={() => { setReq(o); setReason(""); }}>Cancel / refund</button></div>
          </div>))}</div> : <Empty />}
      </Section>
      <Modal open={!!track} onClose={() => setTrack(null)} title={`Tracking ${track?.id ?? ""}`}>
        {track && <ol className="space-y-3">{STEPS.map((s, i) => { const cur = Math.max(0, STEPS.indexOf(track.status)); return <li key={s} className="flex items-center gap-3"><span className={`h-4 w-4 rounded-full ${i <= cur ? "bg-success" : "bg-muted"}`} /><span className={i <= cur ? "font-semibold" : "text-muted-foreground"}>{s}</span></li>; })}{/cancel/i.test(track.status) && <li className="text-destructive">Order cancelled</li>}</ol>}
      </Modal>
      <Modal open={!!req} onClose={() => setReq(null)} title="Cancellation / refund request">
        {req && <form onSubmit={(e) => { e.preventDefault(); if (!reason.trim()) return toast("Please give a reason", "err"); upsert("refunds", { id: uid("RF"), order: req.id, customer: req.customer, type, reason: clean(reason), status: "Pending" }); toast("Request submitted (demo)"); setReq(null); }} className="space-y-3">
          <select className="field" aria-label="Request type" value={type} onChange={(e) => setType(e.target.value)}><option>Refund</option><option>Cancellation</option></select>
          <textarea className="field" aria-label="Reason" rows={3} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason" />
          <button className="btn btn-primary w-full">Submit request</button>
        </form>}
      </Modal>
    </Site>
  );
}
