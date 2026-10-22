import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { clean, uid, useStore } from "@/lib/store";
import { Icon, Img, Modal, PageHero, Section } from "@/components/kit";
import { Site, seo } from "@/components/site";
import { ShareBar, VideoGrid } from "@/components/cards";

export const Route = createFileRoute("/media")({
  head: () => seo("Sports Media", "Sports reels, martial arts demonstrations, workout tutorials and championship highlights."),
  component: Media,
});

const REASONS = ["Spam", "Misleading", "Harassment", "Unsafe technique", "Copyright"];

function Media() {
  const { db, liked, saved, following, toggleIn, upsert, toast } = useStore();
  const [cat, setCat] = useState(""); const [i, setI] = useState(0); const [text, setText] = useState("");
  const [report, setReport] = useState(false); const [reason, setReason] = useState(""); const [sent, setSent] = useState(false);
  const reels = db.videos.filter((v) => v.type === "reel" && (!cat || v.category === cat));
  const v = reels[Math.min(i, reels.length - 1)];
  const cats = [...new Set(db.videos.map((x) => x.category))];
  const comments = v ? db.comments.filter((c) => c.video === v.id) : [];
  const trending = [...db.videos].sort((a, b) => b.views - a.views).slice(0, 4);
  return (
    <Site>
      <PageHero title="Sports Media" sub="Reels, tutorials and highlights from the community." img="martial" />
      <Section title="Reels feed">
        <div className="mb-5 flex flex-wrap gap-2">{["", ...cats].map((c) => <button key={c} onClick={() => { setCat(c); setI(0); }} aria-pressed={cat === c} className={`rounded-full border px-3 py-1 text-sm font-semibold ${cat === c ? "border-primary bg-primary text-primary-foreground" : ""}`}>{c || "For you"}</button>)}</div>
        {v ? (
          <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
            <div className="relative mx-auto w-full max-w-[380px] overflow-hidden rounded-2xl bg-navy">
              <Img k={v.img} alt={v.title} className="aspect-[9/16] w-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-16 p-4 text-navy-foreground">
                <div className="flex items-center gap-2"><span className="font-semibold">@{v.creator.replace(/\s/g, "").toLowerCase()}</span><button onClick={() => toggleIn("following", v.creator)} className="rounded-full border border-navy-foreground/60 px-2 py-0.5 text-xs">{following.includes(v.creator) ? "Following" : "Follow"}</button></div>
                <p className="mt-1 text-sm">{v.title}</p><p className="text-xs opacity-70">{v.views.toLocaleString("en-IN")} views</p>
              </div>
              <div className="absolute bottom-4 right-3 flex flex-col items-center gap-4 text-navy-foreground">
                <button aria-label="Like" aria-pressed={liked.includes(v.id)} onClick={() => toggleIn("liked", v.id)} className={liked.includes(v.id) ? "text-primary" : ""}><Icon name="heart" filled={liked.includes(v.id)} className="h-7 w-7" /><span className="block text-xs">{v.likes + (liked.includes(v.id) ? 1 : 0)}</span></button>
                <a href="#comments" aria-label="Comments"><Icon name="chat" className="h-7 w-7" /><span className="block text-xs">{comments.length}</span></a>
                <button aria-label="Save" aria-pressed={saved.includes(v.id)} onClick={() => toggleIn("saved", v.id)} className={saved.includes(v.id) ? "text-primary" : ""}><Icon name="bookmark" filled={saved.includes(v.id)} className="h-7 w-7" /></button>
                <button aria-label="Report" onClick={() => { setReport(true); setSent(false); setReason(""); }}><Icon name="flag" className="h-6 w-6" /></button>
              </div>
              <div className="absolute left-3 top-3 flex gap-2"><button className="btn btn-ghost-light !px-3 !py-1" disabled={i === 0} onClick={() => setI(i - 1)}>Prev</button><button className="btn btn-ghost-light !px-3 !py-1" disabled={i >= reels.length - 1} onClick={() => setI(i + 1)}>Next</button></div>
            </div>
            <div id="comments" className="space-y-4">
              <ShareBar text={v.title} />
              <h3 className="text-xl font-bold uppercase">Comments</h3>
              <form onSubmit={(e) => { e.preventDefault(); const t = clean(text); if (!t) return; upsert("comments", { id: uid("CM"), video: v.id, user: "You", text: t }); setText(""); }} className="flex gap-2"><input aria-label="Add comment" className="field" value={text} onChange={(e) => setText(e.target.value)} placeholder="Add a comment…" /><button className="btn btn-primary">Post</button></form>
              {comments.map((c) => <div key={c.id} className="rounded-lg bg-muted p-3 text-sm"><b>{c.user}</b> {c.text}</div>)}
              {!comments.length && <p className="text-sm text-muted-foreground">Be the first to comment.</p>}
              <h3 className="pt-4 text-xl font-bold uppercase">Trending</h3>
              <ul className="space-y-2">{trending.map((t) => <li key={t.id} className="flex justify-between text-sm"><span>{t.title}</span><span className="text-muted-foreground">{t.views.toLocaleString("en-IN")} views</span></li>)}</ul>
            </div>
          </div>
        ) : <p>No reels in this category.</p>}
      </Section>
      <Section tone="navy" title="All videos & long-form"><VideoGrid /></Section>
      <Modal open={report} onClose={() => setReport(false)} title="Report content">
        {sent ? <p className="rounded-lg bg-success/10 p-4">Thanks — your report was submitted to moderators (demo).</p> : (
          <form onSubmit={(e) => { e.preventDefault(); if (!reason) return toast("Select a reason", "err"); upsert("reports", { id: uid("UR"), content: `Video: ${v?.title}`, reason, reporter: "you", status: "Open" }); setSent(true); }} className="space-y-3">
            {REASONS.map((r) => <label key={r} className="flex items-center gap-2"><input type="radio" name="reason" checked={reason === r} onChange={() => setReason(r)} />{r}</label>)}
            <button className="btn btn-danger w-full">Submit report</button>
          </form>
        )}
      </Modal>
    </Site>
  );
}
