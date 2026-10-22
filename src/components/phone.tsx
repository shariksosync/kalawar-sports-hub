export function PhoneMock() {
  return (
    <div className="mx-auto w-60 rounded-[2.5rem] border-[10px] border-navy bg-navy p-1 shadow-2xl" aria-label="Phone mockup of the planned KALAWAR app" role="img">
      <div className="overflow-hidden rounded-[1.8rem] bg-background">
        <div className="bg-navy px-4 pb-6 pt-5 text-navy-foreground">
          <div className="mx-auto mb-4 h-1.5 w-16 rounded-full bg-navy-2" />
          <p className="font-display text-lg font-extrabold">KALAWAR<span className="text-primary"> SPORTS</span></p>
          <p className="text-xs opacity-70">Coming soon to Android</p>
        </div>
        <div className="-mt-3 space-y-2 p-3">
          {["My Membership", "Next Exam", "Championships", "Workout Plan"].map((t, i) => (
            <div key={t} className="flex items-center gap-2 rounded-xl border bg-card p-2.5 text-xs font-semibold shadow-sm">
              <span className={`h-7 w-7 rounded-lg ${i % 2 ? "bg-navy" : "bg-primary"}`} />{t}
            </div>
          ))}
          <div className="flex justify-around pt-2">{[0, 1, 2, 3].map((i) => <span key={i} className={`h-2 w-2 rounded-full ${i === 0 ? "bg-primary" : "bg-muted-foreground/30"}`} />)}</div>
        </div>
      </div>
    </div>
  );
}
