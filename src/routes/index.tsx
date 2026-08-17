import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Flame, MapPin, Lock, MessageSquare, CalendarDays, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hot Or Not Pubs — London's flirtiest map" },
      { name: "description", content: "A crowdsourced map of London pubs and bars rated by how attractive the men are — by day of the week." },
      { property: "og:title", content: "Hot Or Not Pubs — London's flirtiest map" },
      { property: "og:description", content: "Find London's flirtiest pubs. Honest ratings, by night." },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setEmail(session?.user?.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden px-4 pt-16 pb-24 sm:pt-24 sm:pb-32">
          <div className="absolute inset-0 -z-10 bg-[var(--gradient-sunset)] opacity-40" />
          <div className="mx-auto max-w-5xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-card/80 backdrop-blur px-4 py-1.5 text-sm text-muted-foreground shadow-[var(--shadow-soft)] mb-6">
              <Flame className="h-4 w-4 text-[var(--burgundy)]" />
              <span>London's flirtiest map</span>
            </div>
            <h1 className="font-display text-5xl sm:text-7xl font-semibold text-[var(--burgundy)] leading-[1.05] tracking-tight">
              Find the hottest crowd in London tonight.
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-foreground/80 max-w-2xl mx-auto leading-relaxed">
              Honest, anonymous ratings of pubs and bars based on how attractive the men usually are.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="h-14 rounded-full px-8 bg-[var(--burgundy)] hover:bg-[var(--burgundy)]/90 text-cream font-medium text-base shadow-[var(--shadow-warm)]"
              >
                <Link to="/map">
                  Explore the map <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              {!email && (
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-14 rounded-full px-8 border-[var(--burgundy)]/30 text-[var(--burgundy)] font-medium text-base"
                >
                  <Link to="/auth">Sign in</Link>
                </Button>
              )}
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Browse {FREE_PREVIEW_LIMIT} pubs then unlock more by rating a pub or bar that you've been to.
            </p>
          </div>
        </section>

        {/* How it works */}
        <section className="px-4 py-20 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-center text-[var(--burgundy)] mb-14">
              How it works
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StepCard
                icon={<MapPin className="h-6 w-6" />}
                title="Discover"
                description="Explore pubs and cocktail bars around you on an interactive London map."
              />
              <StepCard
                icon={<Lock className="h-6 w-6" />}
                title="Unlock"
                description="Sign in to see scores and comments, or post a rating to browse more."
              />
              <StepCard
                icon={<CalendarDays className="h-6 w-6" />}
                title="Filter by day"
                description="Ratings are split by day of the week because we know Thursdays hit different."
              />
              <StepCard
                icon={<MessageSquare className="h-6 w-6" />}
                title="Share"
                description="Leave honest scores and comments to help others find the best crowd."
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 py-20 sm:py-24 bg-[var(--gradient-sunset)]">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl sm:text-5xl font-semibold text-[var(--burgundy)]">
              Ready to find tonight's crowd?
            </h2>
            <p className="mt-4 text-lg text-[var(--burgundy)]/80">
              Join the map, rate the talent, and find someone off the apps.
            </p>
            <Button
              asChild
              size="lg"
              className="mt-8 h-14 rounded-full px-8 bg-[var(--burgundy)] hover:bg-[var(--burgundy)]/90 text-cream font-medium text-base shadow-[var(--shadow-warm)]"
            >
              <Link to="/map">Open the map</Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 px-4 py-8">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="h-7 w-7 rounded-full bg-[var(--gradient-warm)] flex items-center justify-center">
              <Flame className="h-3.5 w-3.5 text-cream" strokeWidth={2.5} />
            </span>
            <span className="font-display font-semibold text-foreground">Hot Or Not Pubs</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/terms" className="hover:text-foreground">
              Terms &amp; Conditions
            </Link>
            <span>London's hottest map.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function StepCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-card rounded-3xl border border-border/60 p-6 shadow-[var(--shadow-soft)] text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[var(--burgundy)] text-cream mb-4">
        {icon}
      </div>
      <h3 className="font-display text-xl font-semibold text-[var(--burgundy)]">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

const FREE_PREVIEW_LIMIT = 3;
