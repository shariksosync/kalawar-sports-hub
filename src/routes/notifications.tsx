import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { Badge, DemoTag, Empty, Icon, PageHero, Section, statusTone } from "@/components/kit";
import { Site, seo } from "@/components/site";
import type { Rec } from "@/data/mock";

export const Route = createFileRoute("/notifications")({
  head: () =>
    seo(
      "Notifications",
      "KALAWAR Sports notification center — membership expiries, championship deadlines, exam results and payment confirmations."
    ),
  component: NotificationsCenter,
});

function NotificationsCenter() {
  const { db, upsert, remove, toast } = useStore();
  const [filterType, setFilterType] = useState("all");
  const [onlyUnread, setOnlyUnread] = useState(false);

  const list: Rec[] = db.notifications ?? [];

  const filtered = list.filter((n: Rec) => {
    if (onlyUnread && n.read) return false;
    if (filterType !== "all" && n.type !== filterType) return false;
    return true;
  });

  const unreadCount = list.filter((n: Rec) => !n.read).length;

  const markAsRead = (n: Rec) => {
    upsert("notifications", { ...n, read: true });
  };

  const markAllRead = () => {
    list.forEach((n: Rec) => {
      if (!n.read) upsert("notifications", { ...n, read: true });
    });
    toast("All notifications marked as read");
  };

  const deleteNotification = (id: string) => {
    remove("notifications", id);
    toast("Notification removed");
  };

  const types = ["all", "Membership", "Examination", "Championship", "Payment"];

  return (
    <Site>
      <PageHero
        title="Notification Center"
        sub="Stay informed on registrations, belt exams, tournament fixtures, and account alerts."
      />

      <Section
        title="Your Alerts"
        eyebrow="Activity Center"
        action={<DemoTag>Mock alert queue</DemoTag>}
      >
        <div className="mx-auto max-w-4xl">
          {/* Controls Bar */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b pb-4">
            <div className="flex flex-wrap items-center gap-2">
              {types.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFilterType(t)}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                    filterType === t
                      ? "border-primary bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  {t === "all" ? "All Types" : t}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyUnread}
                  onChange={(e) => setOnlyUnread(e.target.checked)}
                  className="rounded accent-primary"
                />
                Unread only ({unreadCount})
              </label>

              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllRead}
                  className="btn btn-outline !py-1 !px-3 !text-xs"
                >
                  Mark all as read
                </button>
              )}
            </div>
          </div>

          {/* Notification List */}
          {filtered.length > 0 ? (
            <div className="space-y-3">
              {filtered.map((n: Rec) => (
                <div
                  key={n.id}
                  className={`card flex items-start justify-between gap-4 p-4 transition-all ${
                    !n.read ? "border-l-4 border-l-primary bg-primary/[0.02]" : "opacity-85"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
                        !n.read ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Icon
                        name={
                          n.type === "Payment"
                            ? "bag"
                            : n.type === "Championship"
                            ? "trophy"
                            : n.type === "Examination"
                            ? "medal"
                            : "bell"
                        }
                        className="h-5 w-5"
                      />
                    </span>

                    <div>
                      <div className="flex items-center gap-2">
                        <Badge tone={statusTone(n.type)}>{n.type}</Badge>
                        <span className="text-xs text-muted-foreground">{n.date}</span>
                        {!n.read && (
                          <span className="inline-block h-2 w-2 rounded-full bg-primary" />
                        )}
                      </div>

                      <h4 className="mt-1 font-bold text-foreground">{n.title}</h4>
                      <p className="mt-1 text-sm text-muted-foreground">{n.body}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!n.read && (
                      <button
                        type="button"
                        onClick={() => markAsRead(n)}
                        className="rounded p-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
                        title="Mark as read"
                      >
                        <Icon name="check" className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => deleteNotification(n.id)}
                      className="rounded p-1.5 text-xs text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      title="Delete"
                    >
                      <Icon name="trash" className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Empty
              text={
                onlyUnread
                  ? "No unread notifications."
                  : "No notifications found in this category."
              }
            />
          )}

          {/* Delivery Simulation Notice */}
          <div className="mt-8 rounded-xl border border-dashed p-4 text-center text-xs text-muted-foreground">
            <p className="font-semibold text-foreground">Delivery Architecture Notice</p>
            <p className="mt-1">
              All delivery actions in this prototype are simulated client-side. In production, alerts
              dispatch via Web Push, Firebase Cloud Messaging (FCM), Twilio SMS/OTP, and the WhatsApp
              Business API.
            </p>
          </div>
        </div>
      </Section>
    </Site>
  );
}
