import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { BUSINESS, type Rec } from "@/data/mock";
import { useStore } from "@/lib/store";
import { DemoTag, Icon, Img, Section } from "@/components/kit";
import { ProductCard, ProductModal, RegisterForm, Site, seo } from "@/components/site";
import { AcademyBrowser, ChampionshipList, CourseCard, NewsGrid, ProgramGrid, VideoGrid } from "@/components/cards";
import { PhoneMock } from "@/components/phone";

export const Route = createFileRoute("/")({
  head: () => seo("One Platform. Every Sport.", "KALAWAR Sports connects sports federations, academies, gyms, athletes, coaches and fitness communities in one digital ecosystem."),
  component: Home,
});

const CATS = [
  { t: "Sports Federation", d: "Hierarchy, affiliations and memberships.", to: "/federation", i: "shield" },
  { t: "Martial Arts", d: "Belt grading, forms and Dan exams.", to: "/federation", i: "medal" },
  { t: "Gym & Fitness", d: "Memberships, programs and progress.", to: "/gym", i: "dumbbell" },
  { t: "Multi-Sports Academies", d: "Admissions, batches and coaches.", to: "/academies", i: "users" },
  { t: "Championships", d: "Registrations, draws and results.", to: "/championships", i: "trophy" },
  { t: "Courses & Certification", d: "Coach, referee and fitness courses.", to: "/courses", i: "book" },
  { t: "Sports Education", d: "Articles, tutorials and reels.", to: "/media", i: "play" },
  { t: "Sports Equipment Store", d: "Uniforms, gloves and gear.", to: "/shop", i: "bag" },
] as const;

function Home() {
  const { db } = useStore();
  const [p, setP] = useState<Rec | null>(null);
  const [course, setCourse] = useState(false);
  return (
    <Site>
      {/* Dynamic Active Announcement Strip from Admin Banners */}
      {(db.banners ?? [])
        .filter(
          (b: Rec) =>
            b.status === "Active" &&
            (b.section === "Home Strip" || b.section === "Home Hero")
        )
        .map((b: Rec) => (
          <aside
            key={b.id}
            aria-label="Promotional Announcement"
            className="border-b border-primary/30 bg-primary/10 px-4 py-2.5 text-center text-xs font-bold sm:text-sm"
          >
            <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-2">
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-primary" />
              <span className="font-extrabold uppercase tracking-wider text-primary">
                Live Announcement:
              </span>
              <span className="text-foreground">{b.title}</span>
              <Link
                to="/championships"
                className="ml-1 font-bold text-primary underline hover:text-primary/80"
              >
                View Details &rarr;
              </Link>
            </div>
          </aside>
        ))}

      {/* Hero */}
      <section className="relative overflow-hidden bg-navy text-navy-foreground">
        <Img k="hero" alt="Martial arts athletes training in a multi-sport arena" eager className="absolute inset-0 h-full w-full" />
        <div className="hero-overlay absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 md:py-36">
          <p className="mb-5 inline-block rounded-full border border-primary/50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-primary">Sports • Fitness • Martial Arts • Academy Management</p>
          <h1 className="max-w-4xl text-5xl font-black uppercase leading-[0.95] md:text-7xl">One platform. Every sport. <span className="text-primary">Endless possibilities.</span></h1>
          <p className="mt-6 max-w-2xl text-lg text-navy-foreground/80">Connecting sports federations, academies, gyms, athletes, coaches, and fitness communities through one integrated digital ecosystem.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/academies" className="btn btn-primary !px-6 !py-3">Explore Sports <Icon name="arrow" className="h-4 w-4" /></Link>
            <Link to="/account" className="btn btn-ghost-light !px-6 !py-3">Register Now</Link>
            <Link to="/shop" className="btn btn-ghost-light !px-6 !py-3">Explore Our Shop</Link>
          </div>
        </div>
      </section>

      <Section eyebrow="The ecosystem" title="Everything sport, connected">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATS.map((c) => (
            <Link key={c.t} to={c.to} className="card card-lift group p-6">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-navy text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground"><Icon name={c.i} className="h-6 w-6" /></span>
              <h3 className="mt-4 text-xl font-bold">{c.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{c.d}</p>
            </Link>
          ))}
        </div>
      </Section>

      <Section tone="muted" eyebrow="About" title="From KALAWAR Sports">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div><p className="text-lg leading-relaxed">{BUSINESS.description}</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[["Founder & President", BUSINESS.founder], ["Director", BUSINESS.director]].map(([r, n]) => (
                <div key={r} className="card flex items-center gap-3 p-4"><span className="grid h-14 w-14 place-items-center rounded-full bg-navy text-navy-foreground" aria-hidden><Icon name="user" /></span><div><p className="font-bold">{n}</p><p className="text-sm text-muted-foreground">{r}</p></div></div>
              ))}
            </div>
            <Link to="/about" className="btn btn-navy mt-6">More about us</Link>
          </div>
          <Img k="martial" alt="Karate athlete performing a high kick" className="aspect-[4/3] w-full rounded-2xl" />
        </div>
      </Section>

      <Section tone="navy" eyebrow="Federation" title="Built for federations" sub="Illustrative modules powered by sample records." action={<Link to="/federation" className="btn btn-primary">Open federation</Link>}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[["Federation structure", `${db.hierarchy.length} units`], ["State & district admin", `${db.hierarchy.filter((h) => h.level !== "National").length} regions`], ["Academy affiliation", `${db.affiliations.filter((a) => a.status === "Pending").length} pending`], ["Membership registration", `${db.members.length} members`], ["Belt grading", `${db.belts.length} records`], ["Coach & referee certification", `${db.referees.length} referees`], ["Championship management", `${db.championships.length} events`], ["Digital certificates", `${db.certificates.length} issued`]].map(([t, v]) => (
            <div key={t} className="rounded-xl border border-navy-2 bg-navy-2/50 p-5"><p className="text-sm text-navy-foreground/70">{t}</p><p className="mt-1 font-display text-3xl font-bold text-primary">{v}</p><p className="text-[11px] uppercase tracking-wide text-navy-foreground/50">Sample data</p></div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Academies" title="Featured academies" action={<Link to="/academies" className="btn btn-outline">All academies</Link>}><AcademyBrowser limit={3} /></Section>
      <Section tone="muted" eyebrow="Gym & fitness" title="Programs for every goal"><ProgramGrid /></Section>
      <Section eyebrow="Compete" title="Upcoming championships" action={<Link to="/championships" className="btn btn-outline">All championships</Link>}><ChampionshipList limit={3} /></Section>

      <Section tone="muted" eyebrow="Learn" title="Learning & certification" sub="Martial arts training, fitness education, coach and referee certification, online exams and digital certificates." action={<Link to="/courses" className="btn btn-outline">All courses</Link>}>
        <div className="grid gap-5 md:grid-cols-3">{db.courses.slice(0, 3).map((c) => <CourseCard key={c.id} c={c} onOpen={() => setCourse(true)} />)}</div>
        {course && <p className="mt-4 text-center"><Link to="/courses" className="btn btn-primary">Continue to course catalogue</Link></p>}
      </Section>

      <Section tone="navy" eyebrow="Media" title="Sports reels & videos" action={<Link to="/media" className="btn btn-primary">Open reels</Link>}><VideoGrid limit={4} /></Section>

      <Section eyebrow="Shop" title="Gear up" sub="Prices and stock are demonstration data." action={<Link to="/shop" className="btn btn-outline">Visit shop</Link>}>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{db.products.slice(0, 4).map((x) => <ProductCard key={x.id} p={x} onView={() => setP(x)} />)}</div>
        <ProductModal p={p} onClose={() => setP(null)} />
      </Section>

      <Section tone="muted" eyebrow="Newsroom" title="News, events & achievements" action={<Link to="/news" className="btn btn-outline">All news</Link>}><NewsGrid limit={3} /></Section>

      <section className="bg-primary py-16 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6">
          <h2 className="text-4xl font-black uppercase md:text-5xl">Be Part of the KALAWAR Sports Community</h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/account" className="btn btn-navy">Register as an Athlete</Link>
            <Link to="/academies" className="btn btn-navy">Join an Academy</Link>
            <Link to="/gym" className="btn btn-navy">Register a Gym</Link>
            <Link to="/courses" className="btn btn-navy">Explore Courses</Link>
          </div>
        </div>
      </section>

      <Section eyebrow="Mobile" title="Mobile app coming soon" sub="Android apps are planned to share accounts, registrations and content with this website. Not yet published.">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <ul className="space-y-3">{["Shared accounts across web and app", "Centralized APIs and database (planned)", "Synchronized registrations", "Deep links between web pages and app screens"].map((t) => <li key={t} className="flex gap-2"><Icon name="check" className="h-5 w-5 text-success" />{t}</li>)}<li><DemoTag>Planned integration — not live</DemoTag></li></ul>
          <PhoneMock />
        </div>
      </Section>

      <Section tone="muted" eyebrow="Contact" title="Get in touch">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-3"><p className="font-bold">{BUSINESS.hq}</p><p>{BUSINESS.address}</p>{BUSINESS.phones.map((ph) => <a key={ph} href={`tel:${ph.replace(/\s/g, "")}`} className="btn btn-outline mr-2"><Icon name="phone" className="h-4 w-4" />{ph}</a>)}<p><a className="font-semibold text-accent-foreground underline" href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a></p></div>
          <div className="card p-6"><RegisterForm title="Website enquiry" kind="Contact enquiry" extra={[{ name: "msg", label: "Message", type: "textarea", required: true }]} /></div>
        </div>
      </Section>
    </Site>
  );
}