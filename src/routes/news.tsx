import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { DemoTag, Img, Modal, PageHero, Section } from "@/components/kit";
import { RegisterForm, Site, StatusPill, seo } from "@/components/site";
import { NewsGrid } from "@/components/cards";
import type { Rec } from "@/data/mock";

export const Route = createFileRoute("/news")({
  head: () => seo("News & Events", "Sports news, federation announcements, achievements, events and photo galleries from KALAWAR Sports."),
  component: News,
});

function News() {
  const { db } = useStore();
  const [ev, setEv] = useState<Rec | null>(null); const [gal, setGal] = useState<Rec | null>(null);
  return (
    <Site>
      <PageHero title="News & Events" sub="Announcements, achievements, events and galleries." />
      <Section title="Latest news"><NewsGrid /></Section>
      <Section tone="muted" title="Events" action={<DemoTag>Status labels are demonstrations, not a live feed</DemoTag>}>
        <div className="grid gap-4 md:grid-cols-3">{db.events.map((e) => <div key={e.id} className="card p-5"><StatusPill s={e.status} /><p className="mt-2 text-lg font-bold">{e.title}</p><p className="text-sm text-muted-foreground">{e.date} · {e.place}</p><button disabled={e.status === "Completed"} className="btn btn-primary mt-4 w-full" onClick={() => setEv(e)}>Register</button></div>)}</div>
      </Section>
      <Section title="Photo galleries">
        <div className="grid gap-4 md:grid-cols-3">{db.galleries.map((g) => <button key={g.id} onClick={() => setGal(g)} className="card card-lift overflow-hidden text-left"><Img k={g.img} alt={g.title} className="aspect-[4/3] w-full" /><div className="p-4"><p className="font-bold">{g.title}</p><p className="text-sm text-muted-foreground">{g.category} · {g.photos} photos</p></div></button>)}</div>
      </Section>
      <Modal open={!!ev} onClose={() => setEv(null)} title={ev?.title ?? ""}>{ev && <RegisterForm title={ev.title} kind="Event registration" onDone={() => setEv(null)} />}</Modal>
      <Modal open={!!gal} onClose={() => setGal(null)} title={gal?.title ?? ""} wide>{gal && <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{Array.from({ length: 6 }, (_, i) => <Img key={i} k={["hero", "martial", "gym"][(i + gal.id.length) % 3] ?? "hero"} alt={`${gal.title} photo ${i + 1}`} className="aspect-square w-full rounded-lg" />)}</div>}</Modal>
    </Site>
  );
}
