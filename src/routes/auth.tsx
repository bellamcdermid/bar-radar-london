import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Flame } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Hot Or Not Pubs" },
      { name: "description", content: "Sign in to rate London pubs by how attractive the men are." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<"google" | "apple" | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/" });
    });
  }, [navigate]);

  async function signInWith(provider: "google" | "apple") {
    setOauthLoading(provider);
    try {
      const result = await lovable.auth.signInWithOAuth(provider, {
        redirect_uri: window.location.origin,
      });
      if (result.error) throw new Error(result.error.message ?? "Sign-in failed");
      if (result.redirected) return;
      navigate({ to: "/" });
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong");
    } finally {
      setOauthLoading(null);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        toast.success("Check your inbox to confirm your email.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back.");
        navigate({ to: "/" });
      }
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[var(--gradient-sunset)]">
      <Toaster />
      <div className="w-full max-w-md bg-card rounded-3xl shadow-[var(--shadow-warm)] p-8 border border-border/50">
        <Link to="/" className="flex items-center gap-2 mb-6">
          <span className="h-10 w-10 rounded-full bg-[var(--gradient-warm)] flex items-center justify-center">
            <Flame className="h-5 w-5 text-cream" strokeWidth={2.5} />
          </span>
          <span className="font-display text-2xl font-semibold text-[var(--burgundy)]">Hot Or Not Pubs</span>
        </Link>
        <h1 className="font-display text-3xl font-semibold text-foreground">
          {mode === "signin" ? "Welcome back" : "Join the map"}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {mode === "signin"
            ? "Sign in to rate London's pubs."
            : "Create an account to start scoring tonight's crowd."}
        </p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255} className="mt-1.5 h-11 rounded-xl" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} maxLength={72} className="mt-1.5 h-11 rounded-xl" />
          </div>
          <Button type="submit" disabled={loading} className="w-full h-11 rounded-xl bg-[var(--burgundy)] hover:bg-[var(--burgundy)]/90 text-primary-foreground font-medium">
            {loading ? "Just a moment…" : mode === "signin" ? "Sign in" : "Create account"}
          </Button>
        </form>
        <div className="mt-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs uppercase tracking-wide text-muted-foreground">or</span>
          <div className="h-px flex-1 bg-border" />
        </div>
        <div className="mt-4 space-y-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => signInWith("google")}
            disabled={oauthLoading !== null}
            className="w-full h-11 rounded-xl"
          >
            {oauthLoading === "google" ? "Redirecting…" : "Continue with Google"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => signInWith("apple")}
            disabled={oauthLoading !== null}
            className="w-full h-11 rounded-xl"
          >
            {oauthLoading === "apple" ? "Redirecting…" : "Continue with Apple"}
          </Button>
        </div>
        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-5 w-full text-sm text-muted-foreground hover:text-foreground"
        >
          {mode === "signin" ? "New here? Create an account" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}