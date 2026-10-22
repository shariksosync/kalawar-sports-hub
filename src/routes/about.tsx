import { createFileRoute, Link } from "@tanstack/react-router";
import { BUSINESS } from "@/data/mock";
import { Icon, PageHero, Section } from "@/components/kit";
import { Site, seo } from "@/components/site";
import { PhoneMock } from "@/components/phone";

export const Route = createFileRoute("/about")({
  head: () => seo("About Us", "About KALAWAR Sports — founder, director, mission and the connected digital sports ecosystem."),
  component: About,
});

function About() {
  return (
    <Site>
      <PageHero title="About KALAWAR Sports" sub="A technology-driven platform for sports, fitness, martial arts and academy management." img="martial" />
      <Section title="From KALAWAR Sports"><p className="max-w-4xl text-lg leading-relaxed">{BUSINESS.description}</p></Section>
      <Section tone="muted" title="Leadership">
        <div className="grid gap-5 sm:grid-cols-2">
          {[["Founder & President", BUSINESS.founder], ["Director", BUSINESS.director]].map(([r, n]) => (
            <div key={r} className="card flex items-center gap-4 p-6"><span className="grid h-20 w-20 place-items-center rounded-full bg-navy text-navy-foreground"><Icon name="user" className="h-8 w-8" /></span><div><p className="text-xl font-bold">{n}</p><p className="text-muted-foreground">{r}</p><p className="mt-1 text-xs text-muted-foreground">Portrait placeholder — official photo to be supplied.</p></div></div>
          ))}
        </div>
      </Section>
      <Section title="Website & Android integration" sub="The planned platform connects this website and Android apps through shared accounts, centralized APIs and a centralized database. This prototype implements the website only, with integration placeholders.">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <ul className="space-y-2">{["Responsive website", "Android mobile applications (planned)", "Shared accounts", "Centralized APIs (planned)", "Centralized database (planned)", "Synchronized registrations", "Shared content", "Deep links between web and app"].map((t) => <li key={t} className="flex gap-2"><Icon name="check" className="h-5 w-5 text-success" />{t}</li>)}</ul>
          <PhoneMock />
        </div>
        <div className="mt-8"><Link to="/contact" className="btn btn-primary">Contact us</Link></div>
      </Section>
      <Section tone="muted" title="Security & scalability roadmap" sub="Placeholders for production work that requires a backend. None of these are active in this demo.">
        <div className="grid gap-3 sm:grid-cols-3">{["Secure authentication", "OTP verification", "Encrypted network communication", "API permissions", "Database backup & recovery", "Logging & monitoring", "Anti-spam controls", "Cloud infrastructure", "Scalable architecture"].map((t) => <div key={t} className="card p-4 text-sm font-semibold">{t}<p className="text-xs font-normal text-muted-foreground">Planned — not configured in demo</p></div>)}</div>
      </Section>
    </Site>
  );
}
