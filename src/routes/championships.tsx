import { createFileRoute } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { DemoTag, PageHero, Section } from "@/components/kit";
import { Site, StatusPill, seo } from "@/components/site";
import { ChampionshipList } from "@/components/cards";

export const Route = createFileRoute("/championships")({
  head: () => seo("Championships", "Register for KALAWAR championships, view draws, fixtures, results, rankings and medal records."),
  component: Champs,
});

function Champs() {
  const { db } = useStore();
  return (
    <Site>
      <PageHero title="Championships" sub="Registrations, draws, fixtures, results and rankings." img="hero" />
      <Section title="Championship directory"><ChampionshipList /></Section>
      <Section tone="muted" title="Fixtures & results" action={<DemoTag>Live-status labels are demonstrations</DemoTag>}>
        <div className="space-y-2">{db.fixtures.map((f) => <div key={f.id} className="card flex flex-wrap items-center justify-between gap-2 p-4"><div><p className="text-xs text-muted-foreground">{f.championship} · {f.time}</p><p className="font-semibold">{f.match}: {f.players}</p></div><StatusPill s={f.result} /></div>)}</div>
      </Section>
      <Section title="Player rankings & medals">
        <div className="overflow-x-auto"><table className="w-full min-w-[520px] text-sm"><thead><tr className="border-b text-left text-muted-foreground"><th className="py-2">#</th><th>Athlete</th><th>Sport</th><th>Points</th><th>🥇</th><th>🥈</th><th>🥉</th></tr></thead>
          <tbody>{[...db.rankings].sort((a, b) => b.points - a.points).map((r, i) => <tr key={r.id} className="border-b"><td className="py-2 font-bold">{i + 1}</td><td>{r.name}</td><td>{r.sport}</td><td>{r.points}</td><td>{r.gold}</td><td>{r.silver}</td><td>{r.bronze}</td></tr>)}</tbody></table></div>
      </Section>
    </Site>
  );
}
