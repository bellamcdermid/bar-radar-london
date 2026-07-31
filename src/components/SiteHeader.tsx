import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Flame } from "lucide-react";

export function SiteHeader() {
  const [email, setEmail] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setEmail(session?.user?.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <header className="h-16 border-b border-border/60 bg-card/80 backdrop-blur sticky top-0 z-30">
      <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="h-9 w-9 rounded-full bg-[var(--gradient-warm)] flex items-center justify-center shadow-[var(--shadow-soft)]">
            <Flame className="h-4 w-4 text-cream" strokeWidth={2.5} />
          </span>
          <span className="font-display text-xl font-semibold tracking-tight text-[var(--burgundy)]">
            Hot Or Not Pubs
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex text-foreground hover:text-[var(--burgundy)]">
            <Link to="/map">Explore map</Link>
          </Button>
          {email ? (
            <>
              <span className="hidden sm:inline text-sm text-muted-foreground">{email}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={async () => {
                  await supabase.auth.signOut();
                  navigate({ to: "/" });
                }}
              >
                Sign out
              </Button>
            </>
          ) : (
            <Button asChild size="sm" className="bg-[var(--burgundy)] hover:bg-[var(--burgundy)]/90 text-primary-foreground rounded-full px-5">
              <Link to="/auth">Sign in</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
