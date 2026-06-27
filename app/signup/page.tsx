"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TrendingUp } from "lucide-react";

import { Button, Card, Input, Label } from "@/components/ui_wealth";
import { useUserStore } from "@/store";

export default function SignupPage() {
  const router = useRouter();
  const setUser = useUserStore((s) => s.setUser);

  const [form, setForm] = useState({
    name: "",
    email: "",
    pw: "",
    income: "",
  });

  const [err, setErr] = useState("");

  return (
      <div className="min-h-screen grid place-items-center relative px-4 py-10">
        <div className="absolute inset-0 -z-10 grid-bg opacity-30" />

        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center justify-center gap-2 mb-6">
            <div className="size-9 rounded-xl bg-gradient-to-br from-primary to-accent2 grid place-items-center text-white">
              <TrendingUp className="size-4" />
            </div>
            <span className="font-bold text-xl">WealthOS</span>
          </Link>

          <Card glass>
            <h1 className="text-2xl font-bold mb-1">Create account</h1>
            <p className="text-sm text-muted-foreground mb-6">
              Start tracking in under a minute.
            </p>

            <form
                onSubmit={(e) => {
                  e.preventDefault();

                  if (!form.name || !form.email || !form.pw || !form.income) {
                    setErr("All fields required");
                    return;
                  }

                  setUser({
                    name: form.name,
                    email: form.email,
                    income: Number(form.income),
                  });

                  router.push("/dashboard");
                }}
                className="space-y-4"
            >
              <div>
                <Label>Full name</Label>
                <Input
                    value={form.name}
                    onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                    }
                    placeholder="Arjun Mehta"
                />
              </div>

              <div>
                <Label>Email</Label>
                <Input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                    }
                    placeholder="you@example.com"
                />
              </div>

              <div>
                <Label>Password</Label>
                <Input
                    type="password"
                    value={form.pw}
                    onChange={(e) =>
                        setForm({ ...form, pw: e.target.value })
                    }
                    placeholder="••••••••"
                />
              </div>

              <div>
                <Label>Monthly income</Label>
                <Input
                    type="number"
                    value={form.income}
                    onChange={(e) =>
                        setForm({ ...form, income: e.target.value })
                    }
                    placeholder="185000"
                />
              </div>

              {err && <p className="text-xs text-red-500">{err}</p>}

              <Button type="submit" className="w-full">
                Create account
              </Button>
            </form>

            <p className="text-xs text-center text-muted-foreground mt-5">
              Have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </Card>
        </div>
      </div>
  );
}