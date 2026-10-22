import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { clean, inr, uid, useStore } from "@/lib/store";
import { DemoTag, Empty, Icon, Modal, Section } from "@/components/kit";
import { Site, StatusPill, Wordmark, seo } from "@/components/site";
import { BUSINESS, type Rec } from "@/data/mock";

export const Route = createFileRoute("/orders")({
  head: () =>
    seo(
      "Order History",
      "Your demo orders, simulated shipment tracking, digital payment receipts, and refund requests."
    ),
  component: Orders,
});

const STEPS = ["Processing", "Shipped", "Out for delivery", "Delivered"];

function Orders() {
  const { db, upsert, toast } = useStore();
  const [track, setTrack] = useState<Rec | null>(null);
  const [req, setReq] = useState<Rec | null>(null);
  const [receipt, setReceipt] = useState<Rec | null>(null);
  const [type, setType] = useState("Refund");
  const [reason, setReason] = useState("");

  const ordersList: Rec[] = db.orders ?? [];

  return (
    <Site>
      <Section
        title="Order History"
        eyebrow="My Purchases"
        action={<DemoTag>Simulated fulfillment & receipts</DemoTag>}
      >
        {ordersList.length ? (
          <div className="space-y-3">
            {ordersList.map((o) => (
              <div
                key={o.id}
                className="card flex flex-wrap items-center justify-between gap-3 p-5"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold">{o.id}</span>
                    <StatusPill s={o.status} />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {o.date} · {o.items}
                  </p>
                  {o.payment && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Method: <span className="font-semibold">{o.payment}</span>
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-display text-lg font-bold text-foreground mr-2">
                    {inr(o.total)}
                  </span>
                  <button
                    type="button"
                    className="btn btn-outline !py-1.5 !px-3 !text-xs"
                    onClick={() => setReceipt(o)}
                  >
                    <Icon name="check" className="h-3.5 w-3.5 text-primary" />
                    Receipt
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline !py-1.5 !px-3 !text-xs"
                    onClick={() => setTrack(o)}
                  >
                    Track
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline !py-1.5 !px-3 !text-xs"
                    onClick={() => {
                      setReq(o);
                      setReason("");
                    }}
                  >
                    Cancel / Refund
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Empty text="You have no recorded orders in this session." />
        )}
      </Section>

      {/* Shipment Tracker Modal */}
      <Modal open={!!track} onClose={() => setTrack(null)} title={`Shipment Tracking — ${track?.id ?? ""}`}>
        {track && (
          <div className="space-y-4">
            <DemoTag>Simulated carrier API</DemoTag>
            <div className="rounded-xl bg-muted/60 p-4">
              <p className="text-xs text-muted-foreground">Carrier: KALAWAR Logistics Express (Simulated)</p>
              <p className="font-mono text-xs font-bold text-primary mt-1">AWB: KLW-TRK-{track.id.replace("ORD-", "")}99</p>
              <p className="text-xs text-muted-foreground mt-1">Delivery Address: {track.address || "P. Shiroli, Kolhapur, Maharashtra"}</p>
            </div>
            <ol className="space-y-4 pt-2">
              {STEPS.map((s, i) => {
                const cur = Math.max(0, STEPS.indexOf(track.status));
                const isPassed = i <= cur;
                return (
                  <li key={s} className="flex items-center gap-3">
                    <span
                      className={`grid h-6 w-6 place-items-center rounded-full text-xs font-bold ${
                        isPassed
                          ? "bg-primary text-primary-foreground shadow"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {isPassed ? "✓" : i + 1}
                    </span>
                    <div>
                      <span className={`text-sm ${isPassed ? "font-bold text-foreground" : "text-muted-foreground"}`}>
                        {s}
                      </span>
                      {isPassed && (
                        <p className="text-[10px] text-muted-foreground">
                          {i === cur ? "Updated today (demo)" : "Completed"}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
              {/cancel/i.test(track.status) && (
                <li className="text-sm font-bold text-destructive">Order Cancelled & Refund Initiated</li>
              )}
            </ol>
          </div>
        )}
      </Modal>

      {/* Digital Payment Receipt Modal (Section H) */}
      <Modal open={!!receipt} onClose={() => setReceipt(null)} title={`Tax Invoice & Receipt — ${receipt?.id ?? ""}`} wide>
        {receipt && (
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
                  <p className="font-mono text-xs font-bold mt-2">Invoice: INV-{receipt.id}</p>
                  <p className="text-xs text-muted-foreground">Date: {receipt.date}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs border-b pb-4">
                <div>
                  <p className="text-muted-foreground font-semibold">Billed To:</p>
                  <p className="font-bold text-foreground text-sm mt-0.5">{receipt.customer}</p>
                  <p className="text-muted-foreground mt-0.5">{receipt.address || "Maharashtra, India"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground font-semibold">Payment Details:</p>
                  <p className="font-bold text-foreground mt-0.5">{receipt.payment || "UPI (demo)"}</p>
                  <p className="font-mono text-muted-foreground text-[11px]">Txn Ref: TXN-KLW-{Date.now().toString().slice(-6)}</p>
                </div>
              </div>

              <div className="text-xs space-y-2">
                <div className="flex justify-between font-bold border-b pb-1 text-muted-foreground">
                  <span>Description</span>
                  <span>Amount</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>{receipt.items}</span>
                  <span className="font-mono">{inr(Math.round(receipt.total / 1.18))}</span>
                </div>
                <div className="flex justify-between py-1 text-muted-foreground">
                  <span>Integrated GST (18%)</span>
                  <span className="font-mono">{inr(receipt.total - Math.round(receipt.total / 1.18))}</span>
                </div>
                <div className="flex justify-between border-t pt-2 text-sm font-black">
                  <span>Total Paid (INR)</span>
                  <span className="font-mono text-primary text-base">{inr(receipt.total)}</span>
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

      {/* Cancellation / Refund Request Modal */}
      <Modal open={!!req} onClose={() => setReq(null)} title="Cancellation / Refund Request">
        {req && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!reason.trim()) return toast("Please give a reason", "err");
              upsert("refunds", {
                id: uid("RF"),
                order: req.id,
                customer: req.customer,
                type,
                reason: clean(reason),
                status: "Pending",
              });
              toast("Request submitted (demo)");
              setReq(null);
            }}
            className="space-y-3"
          >
            <label className="block text-xs font-bold uppercase text-muted-foreground">
              Request Type
              <select
                className="field mt-1"
                aria-label="Request type"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option>Refund</option>
                <option>Cancellation</option>
              </select>
            </label>
            <label className="block text-xs font-bold uppercase text-muted-foreground">
              Reason for Request
              <textarea
                className="field mt-1"
                aria-label="Reason"
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Size mismatch, defective stitching, etc."
                required
              />
            </label>
            <button type="submit" className="btn btn-primary w-full">
              Submit Request
            </button>
          </form>
        )}
      </Modal>
    </Site>
  );
}
