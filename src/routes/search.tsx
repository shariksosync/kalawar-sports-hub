import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { globalSearch, inr, useStore } from "@/lib/store";
import { Badge, DemoTag, Empty, Icon, PageHero, Section } from "@/components/kit";
import { ProductCard, ProductModal, Site, seo } from "@/components/site";
import type { Rec } from "@/data/mock";

type SearchParams = {
  q?: string;
};

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>): SearchParams => ({
    q: typeof search.q === "string" ? search.q : "",
  }),
  head: () =>
    seo(
      "Search",
      "Search across sports academies, gyms, courses, championships, news, products, reels and athletes on KALAWAR Sports."
    ),
  component: SearchPage,
});

function SearchPage() {
  const { q = "" } = Route.useSearch();
  const nav = useNavigate();
  const { db } = useStore();
  const [searchTerm, setSearchTerm] = useState(q);
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<Rec | null>(null);

  const results = useMemo(() => {
    return globalSearch(db, q);
  }, [db, q]);

  const totalMatches = results.reduce((acc, g) => acc + g.items.length, 0);

  const displayedGroups = useMemo(() => {
    if (activeCategory === "all") return results;
    return results.filter((g) => g.col === activeCategory);
  }, [results, activeCategory]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    nav({ to: "/search", search: { q: searchTerm } });
  };

  return (
    <Site>
      <PageHero
        title="Global Search & Discovery"
        sub="Discover sports academies, fitness programs, events, merchandise, and educational content."
      />

      <Section
        title="Search Results"
        eyebrow="Discovery Engine"
        action={<DemoTag>Centralized prototype index</DemoTag>}
      >
        {/* Search Bar */}
        <div className="mx-auto mb-8 max-w-2xl">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Icon
                name="search"
                className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search academies, gyms, tournaments, courses, products…"
                className="field !pl-11"
                aria-label="Search term"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Search
            </button>
          </form>

          {/* Quick Category Filters */}
          {results.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActiveCategory("all")}
                className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                  activeCategory === "all"
                    ? "border-primary bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                All Results ({totalMatches})
              </button>
              {results.map((g) => (
                <button
                  key={g.col}
                  type="button"
                  onClick={() => setActiveCategory(g.col)}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                    activeCategory === g.col
                      ? "border-primary bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  {g.label} ({g.items.length})
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Results Body */}
        {q ? (
          <div>
            <div className="mb-6 flex items-center justify-between border-b pb-3">
              <p className="text-sm text-muted-foreground">
                Showing results for <span className="font-semibold text-foreground">"{q}"</span> —{" "}
                <span className="font-bold text-primary">{totalMatches}</span> found
              </p>
            </div>

            {totalMatches > 0 ? (
              <div className="space-y-10">
                {displayedGroups.map((group) => (
                  <div key={group.col} className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-2">
                      <h3 className="font-display text-xl font-bold uppercase tracking-wide">
                        {group.label}{" "}
                        <span className="text-sm font-normal text-muted-foreground">
                          ({group.items.length})
                        </span>
                      </h3>
                      <Link to={group.to as any} className="text-xs font-semibold text-primary hover:underline">
                        View full section →
                      </Link>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {group.items.map((item: Rec) => (
                        <div
                          key={item.id}
                          className="card card-lift flex flex-col justify-between p-5"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2">
                              <Badge tone="navy">{group.label}</Badge>
                              {item.status && <Badge>{item.status}</Badge>}
                            </div>
                            <h4 className="mt-3 text-lg font-bold">
                              {item[group.title] || item.name || item.title}
                            </h4>
                            {item.sport && (
                              <p className="mt-1 text-xs font-semibold text-primary">
                                Sport: {item.sport}
                              </p>
                            )}
                            {item.city && (
                              <p className="text-xs text-muted-foreground">
                                Location: {item.city}, {item.state}
                              </p>
                            )}
                            {item.instructor && (
                              <p className="text-xs text-muted-foreground">
                                Instructor: {item.instructor}
                              </p>
                            )}
                            {item.price !== undefined && (
                              <p className="mt-2 font-display text-xl font-bold">
                                {inr(item.price)}
                              </p>
                            )}
                            {item.desc && (
                              <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                                {item.desc}
                              </p>
                            )}
                          </div>

                          <div className="mt-4 pt-3 border-t">
                            {group.col === "products" ? (
                              <button
                                type="button"
                                onClick={() => setSelectedProduct(item)}
                                className="btn btn-outline w-full !py-1.5 !text-xs"
                              >
                                View Product Details
                              </button>
                            ) : (
                              <Link
                                to={group.to as any}
                                className="btn btn-outline w-full !py-1.5 !text-xs text-center"
                              >
                                View in {group.label}
                              </Link>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Empty text={`No results found for "${q}". Try searching for karate, boxing, gear, or academy.`} />
            )}
          </div>
        ) : (
          <div className="py-12 text-center">
            <Icon name="search" className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-xl font-bold">Search the KALAWAR Sports Ecosystem</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Search across registered multi-sports academies, fitness gyms, certified coaches,
              tournaments, belt forms, store gear, reels, and articles.
            </p>
          </div>
        )}
      </Section>

      <ProductModal p={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </Site>
  );
}
