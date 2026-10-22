import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { DemoTag, PageHero, Section } from "@/components/kit";
import { Site, seo } from "@/components/site";
import type { Rec } from "@/data/mock";

export const Route = createFileRoute("/policy/$slug")({
  head: ({ params }) => {
    const titles: Record<string, string> = {
      privacy: "Privacy Policy",
      terms: "Terms & Conditions",
      refund: "Refund & Cancellation Policy",
      shipping: "Shipping Policy",
    };
    return seo(titles[params.slug] || "Policy", "Official policies and guidelines for KALAWAR Sports.");
  },
  component: PolicyPage,
});

const POLICIES = [
  { slug: "privacy", label: "Privacy Policy" },
  { slug: "terms", label: "Terms & Conditions" },
  { slug: "refund", label: "Refund & Cancellation" },
  { slug: "shipping", label: "Shipping Policy" },
];

function PolicyPage() {
  const { slug } = Route.useParams();
  const nav = useNavigate();
  const { db } = useStore();

  const currentPolicy = (db.policies ?? []).find(
    (p: Rec) => p.id === slug
  ) || {
    id: slug,
    title: POLICIES.find((p) => p.slug === slug)?.label || "Policy Document",
    body: "This is demonstration policy content for KALAWAR Sports. The full legal framework will be published prior to commercial launch.",
  };

  return (
    <Site>
      <PageHero
        title={currentPolicy.title}
        sub="Official guidelines, terms of service and user agreements."
      />

      <Section
        title={currentPolicy.title}
        eyebrow="Legal & Governance"
        action={<DemoTag>Prototype draft</DemoTag>}
      >
        <div className="mx-auto max-w-4xl">
          {/* Policy navigation tabs */}
          <div className="mb-8 flex flex-wrap gap-2 border-b pb-4">
            {POLICIES.map((p) => (
              <Link
                key={p.slug}
                to="/policy/$slug"
                params={{ slug: p.slug }}
                className={`rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                  slug === p.slug
                    ? "bg-primary text-primary-foreground shadow"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                }`}
              >
                {p.label}
              </Link>
            ))}
          </div>

          {/* Policy content */}
          <article className="card p-6 shadow-sm sm:p-10 space-y-6">
            <div className="border-b pb-4">
              <h3 className="font-display text-2xl font-black uppercase text-foreground">
                {currentPolicy.title}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Last updated: October 2026 · Version 1.0 (Demo)
              </p>
            </div>

            <div className="prose max-w-none text-muted-foreground leading-relaxed space-y-4">
              <p className="text-base text-foreground font-medium">{currentPolicy.body}</p>

              <h4 className="text-lg font-bold text-foreground uppercase pt-4">
                1. Scope & Application
              </h4>
              <p>
                KALAWAR Sports provides an integrated sports, fitness, martial arts, and academy
                management ecosystem. This policy governs all interactions across our web portal,
                affiliated sports federations, academies, gyms, tournament registrations, and e-commerce
                store transactions.
              </p>

              <h4 className="text-lg font-bold text-foreground uppercase pt-4">
                2. User Data & Demonstration Environment
              </h4>
              <p>
                In this prototype phase, all operations are executed in a simulated client-side
                environment. No real payment processing, SMS dispatch, or external biometric data collection
                takes place without prior verified integration.
              </p>

              <h4 className="text-lg font-bold text-foreground uppercase pt-4">
                3. Contact Information
              </h4>
              <p>
                For official inquiries regarding this policy, contact the administrative office at:
                <br />
                <b>KALAWAR Sports National Headquarters</b>
                <br />
                Office No. — Gat No. 601 & 602, Plot No. 83, Savarkar Nagar, P. Shiroli, Hatkanangale,
                Kolhapur, Maharashtra – 416122.
                <br />
                Email: kalawarsports@gmail.com · Phones: +91 70833 14435 / +91 95614 27125
              </p>
            </div>
          </article>
        </div>
      </Section>
    </Site>
  );
}
