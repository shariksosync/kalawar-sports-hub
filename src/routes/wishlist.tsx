import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { Empty, Section } from "@/components/kit";
import { ProductCard, ProductModal, Site, seo } from "@/components/site";
import type { Rec } from "@/data/mock";

export const Route = createFileRoute("/wishlist")({
  head: () => seo("Wishlist", "Products you saved in the KALAWAR Sports shop."),
  component: Wishlist,
});

function Wishlist() {
  const { db, wishlist } = useStore();
  const [sel, setSel] = useState<Rec | null>(null);
  const list = db.products.filter((p) => wishlist.includes(p.id));
  return (
    <Site>
      <Section title="Wishlist">
        {list.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{list.map((p) => <ProductCard key={p.id} p={p} onView={() => setSel(p)} />)}</div> : <div className="space-y-4"><Empty text="No saved products yet." /><Link to="/shop" className="btn btn-primary">Browse shop</Link></div>}
      </Section>
      <ProductModal p={sel} onClose={() => setSel(null)} />
    </Site>
  );
}
