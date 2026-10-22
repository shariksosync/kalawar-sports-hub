import { createFileRoute, Link } from "@tanstack/react-router";
import { finalPrice, inr, useStore } from "@/lib/store";
import { Empty, Img, Section } from "@/components/kit";
import { Site, seo } from "@/components/site";

export const Route = createFileRoute("/cart")({
  head: () => seo("Cart", "Review items in your KALAWAR Sports demo shopping cart."),
  component: Cart,
});

export function useCartLines() {
  const { cart, db } = useStore();
  const lines = cart.map((c) => ({ ...c, p: db.products.find((p) => p.id === c.id) })).filter((l) => l.p);
  const subtotal = lines.reduce((a, l) => a + finalPrice(l.p!) * l.qty, 0);
  const shipping = subtotal > 0 && subtotal < 999 ? 99 : 0;
  return { lines, subtotal, shipping, total: subtotal + shipping };
}

function Cart() {
  const { setQty } = useStore();
  const { lines, subtotal, shipping, total } = useCartLines();
  return (
    <Site>
      <Section title="Your cart">
        {!lines.length ? <div className="space-y-4"><Empty text="Your cart is empty." /><Link to="/shop" className="btn btn-primary">Go shopping</Link></div> : (
          <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
            <ul className="space-y-3">{lines.map((l) => (
              <li key={l.id} className="card flex flex-wrap items-center gap-4 p-4">
                <Img k={l.p!.img} alt={l.p!.name} className="h-20 w-20 rounded-lg" />
                <div className="min-w-40 flex-1"><p className="font-bold">{l.p!.name}</p><p className="text-sm text-muted-foreground">{[l.size, l.color].filter(Boolean).join(" · ")} {inr(finalPrice(l.p!))} each</p></div>
                <div className="flex items-center gap-2"><button aria-label="Decrease" className="btn btn-outline !px-3" onClick={() => setQty(l.id, l.qty - 1)}>−</button><span className="w-6 text-center font-bold">{l.qty}</span><button aria-label="Increase" disabled={l.qty >= l.p!.stock} className="btn btn-outline !px-3" onClick={() => setQty(l.id, l.qty + 1)}>+</button></div>
                <p className="w-24 text-right font-bold">{inr(finalPrice(l.p!) * l.qty)}</p>
                <button className="text-sm text-destructive underline" onClick={() => setQty(l.id, 0)}>Remove</button>
              </li>))}</ul>
            <div className="card h-fit space-y-2 p-6"><div className="flex justify-between"><span>Subtotal</span><span>{inr(subtotal)}</span></div><div className="flex justify-between"><span>Shipping (demo)</span><span>{shipping ? inr(shipping) : "Free"}</span></div><div className="flex justify-between border-t pt-2 text-lg font-bold"><span>Total</span><span>{inr(total)}</span></div><Link to="/checkout" className="btn btn-primary w-full">Checkout</Link></div>
          </div>
        )}
      </Section>
    </Site>
  );
}
