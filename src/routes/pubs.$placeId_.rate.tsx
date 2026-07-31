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
import { ArrowLeft, Flame, MapPin } from "lucide-react";

type Pub = { place_id: string; name: string; address: string | null; lat: number; lng: number };

const SCORE_LABELS: Record<number, string> = {
  5: "Average and below",
  6: "Promising",
  7: "Some cuties",
  8: "Getting hotter",
  9: "Hot!",
  10: "So hot would buy them a drink",
};

export const Route = createFileRoute("/pubs/$placeId_/rate")({
  loader: async ({ params }) => {
    const { data: pub } = await supabase
      .from("pubs")
      .select("*")
      .eq("place_id", params.placeId)
      .maybeSingle();
    if (pub) return { pub: pub as Pub };
    try {
      const { fetchPlaceDetails } = await import("@/lib/places.functions");
      const details = await fetchPlaceDetails({ data: { placeId: params.placeId } });
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("pubs").upsert(details, { onConflict: "place_id" });
      }
      return { pub: details as Pub };
    } catch {
      throw notFound();
    }
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `Rate ${loaderData?.pub.name ?? "this pub"} — Hot Or Not Pubs` },
      { name: "description", content: `Post an honest rating of the crowd at ${loaderData?.pub.name ?? "this pub"}.` },
      { name: "robots", content: "noindex" },
    ],
  }),
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center p-6 text-center">
      <div>
        <h1 className="font-display text-2xl mb-2">Something went wrong</h1>
        <p className="text-muted-foreground">{error.message}</p>
        <Button asChild className="mt-4"><Link to="/map">Back to map</Link></Button>
      </div>
    </div>
  ),
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center p-6 text-center">
      <div>
        <h1 className="font-display text-2xl mb-2">Pub not found</h1>
        <Button asChild className="mt-4"><Link to="/map">Back to map</Link></Button>
      </div>
    </div>
  ),
  component: RatePage,
});

function RatePage() {
  const { pub } = Route.useLoaderData();
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [score, setScore] = useState(7);
  const [comment, setComment] = useState("");
  const [visitedAt, setVisitedAt] = useState(format(new Date(), "yyyy-MM-dd"));
  const [displayName, setDisplayName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
      setAuthChecked(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setUserId(s?.user?.id ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;
    if (!visitedAt) {
      toast.error("Pick a date you visited");
      return;
    }
    setBusy(true);
    try {
      const dow = getDay(parseISO(visitedAt));
      const { error } = await supabase.from("ratings").insert({
        user_id: userId,
        place_id: pub.place_id,
        score,
        comment: comment.trim().slice(0, 500) || null,
        visited_at: visitedAt,
        day_of_week: dow,
        display_name: displayName.trim().slice(0, 40) || null,
      });
      if (error) throw error;
      toast.success("Rating posted");
      navigate({ to: "/pubs/$placeId", params: { placeId: pub.place_id } });
    } catch (err: any) {
      toast.error(err.message ?? "Could not save rating");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      <SiteHeader />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <Link
          to="/pubs/$placeId"
          params={{ placeId: pub.place_id }}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4" /> Back to {pub.name}
        </Link>

        <div className="bg-card rounded-3xl border border-border/60 shadow-[var(--shadow-soft)] p-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[var(--burgundy)] text-cream flex items-center justify-center">
              <Flame className="h-6 w-6" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="font-display text-3xl font-semibold text-[var(--burgundy)] leading-tight">
                Rate {pub.name}
              </h1>
              {pub.address && (
                <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
                  <MapPin className="h-3.5 w-3.5" /> {pub.address}
                </p>
              )}
            </div>
          </div>

          {!authChecked ? (
            <p className="mt-6 text-muted-foreground">Loading…</p>
          ) : !userId ? (
            <div className="mt-6 bg-[var(--gradient-sunset)] rounded-2xl p-6 text-center">
              <p className="font-display text-xl text-[var(--burgundy)] mb-3">
                Sign in to post your rating
              </p>
              <Button
                onClick={() => navigate({ to: "/auth" })}
                className="bg-[var(--burgundy)] hover:bg-[var(--burgundy)]/90 text-cream rounded-full px-6"
              >
                Sign in
              </Button>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-6">
              <p className="text-sm text-muted-foreground">
                Be honest. How attractive were the men here on the day you visited?
              </p>

              <div className="mt-5">
                <div className="flex items-baseline justify-between">
                  <Label className="text-sm font-medium">Score</Label>
                  <span className="font-display text-3xl text-[var(--burgundy)] font-semibold">
                    {score}
                    <span className="text-sm text-muted-foreground">/10</span>
                  </span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={10}
                  value={score}
                  onChange={(e) => setScore(Number(e.target.value))}
                  className="w-full mt-2 accent-[var(--coral)]"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  {[5, 6, 7, 8, 9, 10].map((n) => (
                    <span key={n}>{n}</span>
                  ))}
                </div>
                <p className="mt-2 text-center font-display text-lg text-[var(--burgundy)]">
                  {SCORE_LABELS[score]}
                </p>
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
                <div className="text-xs text-muted-foreground text-right mt-1">
                  {comment.length}/500
                </div>
              </div>

              <Button
                type="submit"
                disabled={busy}
                className="mt-4 w-full sm:w-auto h-11 px-8 rounded-full bg-[var(--burgundy)] hover:bg-[var(--burgundy)]/90 text-cream font-medium"
              >
                {busy ? "Posting…" : "Post rating"}
              </Button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}