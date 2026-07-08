import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2, LockKeyhole, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { adminLogin, getAdminToken, storeAdminSession } from "@/lib/hackathon-api";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Login — NexTerra Orbit Hackathon" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (getAdminToken()) {
      void navigate({ to: "/dashboard" });
    }
  }, [navigate]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || !password) {
      setError("Enter your email and password");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const { token, admin } = await adminLogin(email.trim().toLowerCase(), password);
      storeAdminSession(token, admin);
      void navigate({ to: "/dashboard" });
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
      <div className="absolute inset-0 -z-10 grid-bg opacity-20" />
      <Card className="w-full max-w-md border-border/60 bg-card/60 p-6 backdrop-blur sm:p-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
            [ ADMIN_ACCESS ]
          </div>
          <h1 className="mt-2 font-mono text-2xl font-bold tracking-tight">Mission Control</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to manage registrations and publish results.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="admin-email">Email</Label>
            <Input
              id="admin-email"
              type="email"
              autoComplete="email"
              placeholder="admin@nexterra.dev"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={submitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-password">Password</Label>
            <Input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={submitting}
            />
          </div>

          {error && (
            <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Signing in…
              </>
            ) : (
              <>
                <LockKeyhole className="h-4 w-4" /> Sign in
              </>
            )}
          </Button>
        </form>

        <p className="mt-6 text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Authorized personnel only
        </p>
      </Card>
    </main>
  );
}
