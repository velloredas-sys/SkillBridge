import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { authClient, authEnabled } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Wordmark } from "@/components/mark";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { FormEvent, useState } from "react";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const { user, isPending } = useCurrentUserState();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!isPending && user) return <Navigate to="/dashboard" />;

  async function onEmail(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === "up") {
        const res = await authClient.signUp.email({ email, password, name: name || email.split("@")[0] });
        if (res.error) throw new Error(res.error.message || "Could not create account");
      } else {
        const res = await authClient.signIn.email({ email, password });
        if (res.error) throw new Error(res.error.message || "Could not sign in");
      }
      window.location.assign("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  async function onGoogle() {
    setError(null);
    setBusy(true);
    try {
      const { data, error: signInError } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
      if (signInError) throw new Error(signInError.message || "Could not start Google sign-in");
      if (data?.url) window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in is not set up yet");
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-bark p-10 text-cream lg:flex">
        <Link to="/">
          <Wordmark light />
        </Link>
        <div>
          <p className="font-display text-4xl leading-tight">A map, not another portal.</p>
          <p className="mt-4 max-w-md text-cream/70">
            Students learn. Colleges see the gaps. Industry hires people who can actually do the work.
          </p>
        </div>
        <p className="text-sm text-cream/50">SIH26044 · Ministry of Ayush problem statement</p>
      </div>
      <div className="flex flex-col justify-center px-6 py-12">
        <div className="mx-auto w-full max-w-sm">
          <Link to="/" className="mb-8 inline-block lg:hidden">
            <Wordmark />
          </Link>
          <h1 className="text-3xl">Sign in</h1>
          <p className="mt-1 text-sm text-muted-foreground">Use a campus or work account to keep your skill map.</p>

          {!authEnabled ? (
            <p className="mt-6 text-sm text-muted-foreground">Sign-in is disabled.</p>
          ) : (
            <>
              <div className="mt-6 space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  disabled={busy}
                  onClick={onGoogle}
                >
                  Continue with Google
                </Button>
              </div>
              <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground">
                <span className="h-px flex-1 bg-border" />
                or email
                <span className="h-px flex-1 bg-border" />
              </div>
              <form onSubmit={onEmail} className="space-y-3">
                {mode === "up" ? (
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
                  </div>
                ) : null}
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete={mode === "up" ? "new-password" : "current-password"}
                  />
                </div>
                {error ? <p className="text-sm text-destructive">{error}</p> : null}
                <Button type="submit" className="w-full" disabled={busy}>
                  {busy ? "Please wait…" : mode === "up" ? "Create account" : "Sign in with email"}
                </Button>
              </form>
              <button
                type="button"
                className="mt-4 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                onClick={() => setMode((m) => (m === "up" ? "in" : "up"))}
              >
                {mode === "up" ? "Already have an account? Sign in" : "New here? Create an account"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
