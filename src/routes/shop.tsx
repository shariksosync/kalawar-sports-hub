import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { finalPrice, useStore } from "@/lib/store";
import { DemoTag, Empty, PageHero, Section } from "@/components/kit";
import { ProductCard, ProductModal, Site, seo } from "@/components/site";
import { PRODUCT_CATEGORIES, type Rec } from "@/data/mock";

export const Route = createFileRoute("/shop")({
  head: () => seo("Shop", "Martial arts uniforms, belts, gloves, fitness accessories, cricket and football gear and KALAWAR merchandise."),
  component: Shop,
});

function Shop() {
  const { db } = useStore();
  const [q, setQ] = useState(""); const [cat, setCat] = useState(""); const [max, setMax] = useState(10000); const [sort, setSort] = useState("featured");
  const [shown, setShown] = useState(8); const [sel, setSel] = useState<Rec | null>(null);
  let list = db.products.filter((p) => (!cat || p.category === cat) && finalPrice(p) <= max && (p.name + p.sku).toLowerCase().includes(q.toLowerCase()));
  if (sort === "low") list = [...list].sort((a, b) => finalPrice(a) - finalPrice(b));
  if (sort === "high") list = [...list].sort((a, b) => finalPrice(b) - finalPrice(a));
  if (sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
  return (
    <Site>
      <PageHero title="KALAWAR Shop" sub="Gear for every discipline. Prices and stock are demonstration data." img="gear" />
      <Section title="All products" action={<DemoTag>Demo store — no real orders</DemoTag>}>
        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          <aside className="space-y-5">
            <input aria-label="Search products" className="field" placeholder="Search products…" value={q} onChange={(e) => setQ(e.target.value)} />
            <div><p className="mb-2 text-sm font-bold uppercase">Category</p><div className="flex flex-wrap gap-2 lg:flex-col">{["", ...PRODUCT_CATEGORIES].map((c) => <button key={c} onClick={() => setCat(c)} aria-pressed={cat === c} className={`rounded-md px-3 py-1.5 text-left text-sm ${cat === c ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>{c || "All"}</button>)}</div></div>
            <label className="block text-sm font-bold uppercase">Max price: ₹{max.toLocaleString("en-IN")}<input type="range" min={200} max={10000} step={100} value={max} onChange={(e) => setMax(+e.target.value)} className="mt-2 w-full accent-[var(--color-primary)]" /></label>
            <select aria-label="Sort" className="field" value={sort} onChange={(e) => setSort(e.target.value)}><option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option><option value="name">Name A–Z</option></select>
          </aside>
          <div>
            <p className="mb-3 text-sm text-muted-foreground">{list.length} products</p>
            {list.length ? <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{list.slice(0, shown).map((p) => <ProductCard key={p.id} p={p} onView={() => setSel(p)} />)}</div> : <Empty text="No products match your filters." />}
            {list.length > shown && <div className="mt-6 text-center"><button className="btn btn-outline" onClick={() => setShown(shown + 8)}>Load more</button></div>}
          </div>
        </div>
      </Section>
      <ProductModal p={sel} onClose={() => setSel(null)} />
    </Site>
  );
}
