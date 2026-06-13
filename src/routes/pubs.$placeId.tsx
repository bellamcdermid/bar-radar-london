import { createFileRoute, Link, useNavigate, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { format, getDay, parseISO } from "date-fns";
import { ArrowLeft, Flame, MapPin, Trash2 } from "lucide-react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAYS_LONG = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

type Pub = { place_id: string; name: string; address: string | null; lat: number; lng: number };
type Rating = {
  id: string;
  user_id: string;
  score: number;
  comment: string | null;
  visited_at: string;
  day_of_week: number;
  display_name: string | null;
  created_at: string;
};

export const Route = createFileRoute("/pubs/$placeId")({
  loader: async ({ params }) => {
    const { data: pub } = await supabase
      .from("pubs")
      .select("*")
      .eq("place_id", params.placeId)
      .maybeSingle();
    if (!pub) throw notFound();
    return { pub: pub as Pub };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.pub.name ?? "Pub"} — Hot Or Not Pubs` },
      { name: "description", content: `See how attractive the men are at ${loaderData?.pub.name ?? "this pub"}, rated by day of the week.` },
      { property: "og:title", content: `${loaderData?.pub.name ?? "Pub"} on Hot Or Not Pubs` },
      { property: "og:description", content: loaderData?.pub.address ?? "" },
    ],
  }),
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center p-6 text-center">
      <div>
        <h1 className="font-display text-2xl mb-2">Something went wrong</h1>
        <p className="text-muted-foreground">{error.message}</p>
        <Button asChild className="mt-4"><Link to="/">Back to map</Link></Button>
      </div>
    </div>
  ),
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center p-6 text-center">
      <div>
        <h1 className="font-display text-2xl mb-2">Pub not found</h1>
        <Button asChild className="mt-4"><Link to="/">Back to map</Link></Button>
      </div>
    </div>
  ),
  component: PubDetail,
});

function PubDetail() {
  const { pub } = Route.useLoaderData();
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [dayFilter, setDayFilter] = useState<number | "all">("all");
  const [userId, setUserId] = useState<string | null>(null);

  async function loadRatings() {
    const { data } = await supabase
      .from("ratings")
      .select("*")
      .eq("place_id", pub.place_id)
      .order("created_at", { ascending: false });
    setRatings((data ?? []) as Rating[]);
  }

  useEffect(() => {
    loadRatings();
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setUserId(s?.user?.id ?? null));
    return () => sub.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pub.place_id]);

  const filtered = dayFilter === "all" ? ratings : ratings.filter((r) => r.day_of_week === dayFilter);
  const avg = filtered.length ? filtered.reduce((s, r) => s + r.score, 0) / filtered.length : null;

  // Per-day breakdown
  const dayStats = DAYS.map((_, d) => {
    const subset = ratings.filter((r) => r.day_of_week === d);
    return {
      day: d,
      avg: subset.length ? subset.reduce((s, r) => s + r.score, 0) / subset.length : null,
      count: subset.length,
    };
  });

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      <SiteHeader />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to map
        </Link>

        <div className="bg-card rounded-3xl border border-border/60 shadow-[var(--shadow-soft)] p-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[var(--burgundy)] leading-tight">
                {pub.name}
              </h1>
              {pub.address && (
                <p className="mt-2 text-muted-foreground flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" /> {pub.address}
                </p>
              )}
            </div>
            <ScorePill avg={avg} count={filtered.length} />
          </div>

          {/* Day filter chips */}
          <div className="mt-6">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
              Filter by day
            </div>
            <div className="flex flex-wrap gap-2">
              <DayChip active={dayFilter === "all"} onClick={() => setDayFilter("all")} label="All days" />
              {DAYS.map((d, i) => (
                <DayChip
                  key={d}
                  active={dayFilter === i}
                  onClick={() => setDayFilter(i)}
                  label={d}
                  avg={dayStats[i].avg}
                  count={dayStats[i].count}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Rate form */}
        <RateForm pub={pub} userId={userId} onAdded={loadRatings} />

        {/* Ratings list */}
        <section className="mt-8">
          <h2 className="font-display text-2xl font-semibold mb-4">
            {filtered.length} {filtered.length === 1 ? "rating" : "ratings"}
            {dayFilter !== "all" && ` for ${DAYS_LONG[dayFilter]}s`}
          </h2>
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground bg-card rounded-2xl border border-dashed border-border">
              No ratings yet{dayFilter !== "all" ? ` for ${DAYS_LONG[dayFilter]}s` : ""}. Be the first.
            </div>
          ) : (
            <ul className="space-y-3">
              {filtered.map((r) => (
                <RatingCard key={r.id} rating={r} mine={r.user_id === userId} onDeleted={loadRatings} />
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

function ScorePill({ avg, count }: { avg: number | null; count: number }) {
  const color = avg === null ? "bg-muted text-muted-foreground" : avg >= 8 ? "bg-[var(--burgundy)] text-cream" : avg >= 6 ? "bg-[var(--coral)] text-[var(--burgundy)]" : "bg-[var(--rose)] text-[var(--burgundy)]";
  return (
    <div className={`rounded-2xl px-5 py-3 ${color} shadow-[var(--shadow-soft)]`}>
      <div className="flex items-baseline gap-1">
        <Flame className="h-5 w-5 self-center" strokeWidth={2.5} />
        <span className="font-display text-3xl font-semibold">
          {avg === null ? "—" : avg.toFixed(1)}
        </span>
        <span className="text-sm opacity-80">/ 10</span>
      </div>
      <div className="text-xs opacity-80 mt-0.5">{count} {count === 1 ? "rating" : "ratings"}</div>
    </div>
  );
}

function DayChip({ active, onClick, label, avg, count }: { active: boolean; onClick: () => void; label: string; avg?: number | null; count?: number }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 h-10 rounded-full text-sm font-medium border transition flex items-center gap-2 ${
        active
          ? "bg-[var(--burgundy)] text-cream border-[var(--burgundy)]"
          : "bg-card text-foreground border-border hover:border-[var(--coral)]"
      }`}
    >
      <span>{label}</span>
      {avg !== undefined && count !== undefined && count > 0 && (
        <span className={`text-xs ${active ? "text-cream/80" : "text-muted-foreground"}`}>
          {avg!.toFixed(1)}
        </span>
      )}
    </button>
  );
}

function RateForm({ pub, userId, onAdded }: { pub: Pub; userId: string | null; onAdded: () => void }) {
  const navigate = useNavigate();
  const [score, setScore] = useState(7);
  const [comment, setComment] = useState("");
  const [visitedAt, setVisitedAt] = useState(format(new Date(), "yyyy-MM-dd"));
  const [displayName, setDisplayName] = useState("");
  const [busy, setBusy] = useState(false);

  if (!userId) {
    return (
      <div className="mt-6 bg-[var(--gradient-sunset)] rounded-3xl p-6 text-center">
        <p className="font-display text-xl text-[var(--burgundy)] mb-3">Sign in to rate {pub.name}</p>
        <Button onClick={() => navigate({ to: "/auth" })} className="bg-[var(--burgundy)] hover:bg-[var(--burgundy)]/90 text-cream rounded-full px-6">
          Sign in
        </Button>
      </div>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedComment = comment.trim().slice(0, 500);
    const trimmedName = displayName.trim().slice(0, 40) || null;
    if (!visitedAt) {
      toast.error("Pick a date you visited");
      return;
    }
    setBusy(true);
    try {
      const dow = getDay(parseISO(visitedAt));
      const { error } = await supabase.from("ratings").insert({
        user_id: userId!,
        place_id: pub.place_id,
        score,
        comment: trimmedComment || null,
        visited_at: visitedAt,
        day_of_week: dow,
        display_name: trimmedName,
      });
      if (error) throw error;
      toast.success("Rating posted");
      setComment("");
      onAdded();
    } catch (err: any) {
      toast.error(err.message ?? "Could not save rating");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-6 bg-card rounded-3xl border border-border/60 p-6 shadow-[var(--shadow-soft)]">
      <h2 className="font-display text-2xl font-semibold text-[var(--burgundy)]">Rate the talent</h2>
      <p className="text-sm text-muted-foreground mt-1">Be honest. How attractive were the men here on the day you visited?</p>

      <div className="mt-5">
        <div className="flex items-baseline justify-between">
          <Label className="text-sm font-medium">Score</Label>
          <span className="font-display text-3xl text-[var(--burgundy)] font-semibold">{score}<span className="text-sm text-muted-foreground">/10</span></span>
        </div>
        <input
          type="range"
          min={1}
          max={10}
          value={score}
          onChange={(e) => setScore(Number(e.target.value))}
          className="w-full mt-2 accent-[var(--coral)]"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>Bleak</span>
          <span>Promising</span>
          <span>Smoking</span>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mt-5">
        <div>
          <Label htmlFor="visited">Date visited</Label>
          <Input
            id="visited"
            type="date"
            value={visitedAt}
            max={format(new Date(), "yyyy-MM-dd")}
            onChange={(e) => setVisitedAt(e.target.value)}
            className="mt-1.5 h-11 rounded-xl"
          />
        </div>
        <div>
          <Label htmlFor="name">Display name (optional)</Label>
          <Input
            id="name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            maxLength={40}
            placeholder="Anonymous"
            className="mt-1.5 h-11 rounded-xl"
          />
        </div>
      </div>

      <div className="mt-4">
        <Label htmlFor="comment">Comment (optional)</Label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={500}
          placeholder="The crowd, the vibe, the verdict…"
          className="mt-1.5 rounded-xl min-h-24"
        />
        <div className="text-xs text-muted-foreground text-right mt-1">{comment.length}/500</div>
      </div>

      <Button type="submit" disabled={busy} className="mt-4 w-full sm:w-auto h-11 px-8 rounded-full bg-[var(--burgundy)] hover:bg-[var(--burgundy)]/90 text-cream font-medium">
        {busy ? "Posting…" : "Post rating"}
      </Button>
    </form>
  );
}

function RatingCard({ rating, mine, onDeleted }: { rating: Rating; mine: boolean; onDeleted: () => void }) {
  async function del() {
    if (!confirm("Delete this rating?")) return;
    const { error } = await supabase.from("ratings").delete().eq("id", rating.id);
    if (error) toast.error(error.message);
    else {
      toast.success("Deleted");
      onDeleted();
    }
  }
  const color = rating.score >= 8 ? "bg-[var(--burgundy)] text-cream" : rating.score >= 6 ? "bg-[var(--coral)] text-[var(--burgundy)]" : "bg-[var(--rose)] text-[var(--burgundy)]";
  return (
    <li className="bg-card rounded-2xl border border-border/60 p-5 flex gap-4">
      <div className={`shrink-0 w-14 h-14 rounded-2xl flex flex-col items-center justify-center ${color}`}>
        <span className="font-display text-2xl font-semibold leading-none">{rating.score}</span>
        <span className="text-[10px] opacity-80">/ 10</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2">
          <span className="font-medium text-foreground">{rating.display_name || "Anonymous"}</span>
          <span className="text-xs text-muted-foreground shrink-0">
            {DAYS_LONG[rating.day_of_week]}, {format(parseISO(rating.visited_at), "d MMM yyyy")}
          </span>
        </div>
        {rating.comment && (
          <p className="mt-1.5 text-sm text-foreground/90 whitespace-pre-wrap break-words">{rating.comment}</p>
        )}
        {mine && (
          <button onClick={del} className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive">
            <Trash2 className="h-3 w-3" /> Delete
          </button>
        )}
      </div>
    </li>
  );
}