"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Sparkles,
  LineChart,
  PiggyBank,
  ArrowRight,
} from "lucide-react";

import { Button, Card } from "@/components/ui_wealth";
import { formatCurrency } from "@/lib/utils";

export default function HomePage() {
  return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Background */}

        <div className="absolute inset-0 -z-10 grid-bg opacity-40" />

        <div className="absolute -z-10 top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-primary/10 blur-3xl" />

        {/* Header */}

        <header className="sticky top-0 z-20 backdrop-blur-md bg-background/60 border-b border-border/50">
          <div className="max-w-6xl mx-auto h-16 px-6 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="size-8 rounded-xl bg-gradient-to-br from-primary to-accent2 grid place-items-center text-white">
                <TrendingUp className="size-4" />
              </div>

              <span className="font-display font-bold text-lg">
              WealthOS
            </span>
            </Link>

            <nav className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>

              <Link href="/signup">
                <Button size="sm">
                  Get Started
                </Button>
              </Link>
            </nav>
          </div>
        </header>

        {/* Hero */}

        <section className="max-w-6xl mx-auto px-6 pt-16 pb-24 grid lg:grid-cols-2 gap-12 items-center">

          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground mb-6">
              <Sparkles className="size-3 text-primary" />
              AI-powered insights, now in beta
            </div>

            <h1 className="text-5xl md:text-6xl font-display font-bold leading-[1.05] tracking-tight">
              Understand Your
              <br />
              Wealth,
              <span className="bg-gradient-to-r from-primary to-accent2 bg-clip-text text-transparent">
              {" "}
                Finally.
            </span>
            </h1>

            <p className="mt-6 text-lg text-muted-foreground max-w-md">
              AI-powered portfolio tracking for stocks, crypto,
              and mutual funds. Built for Indian investors.
            </p>

            <div className="mt-8 flex gap-3">
              <Link href="/signup">
                <Button size="lg">
                  Start Free
                  <ArrowRight className="size-4 ml-2" />
                </Button>
              </Link>

              <Link href="/dashboard">
                <Button size="lg" variant="ghost">
                  See Demo
                </Button>
              </Link>
            </div>

            <div className="mt-12 flex items-center gap-6 text-sm">
              <div>
                <div className="font-display font-bold text-xl">
                  10,000+
                </div>
                <div className="text-xs text-muted-foreground">
                  investors
                </div>
              </div>

              <div className="h-8 w-px bg-border" />

              <div>
                <div className="font-display font-bold text-xl">
                  ₹50Cr+
                </div>
                <div className="text-xs text-muted-foreground">
                  tracked
                </div>
              </div>

              <div className="h-8 w-px bg-border" />

              <div>
                <div className="font-display font-bold text-xl">
                  99.9%
                </div>
                <div className="text-xs text-muted-foreground">
                  uptime
                </div>
              </div>
            </div>
          </motion.div>

          {/* Dashboard Card */}

          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.2,
              }}
          >
            <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
            >
              <Card glass glow className="p-6">
                <div className="text-xs text-muted-foreground">
                  Total Portfolio
                </div>

                <div className="text-3xl font-display font-bold font-mono-num mt-1">
                  {formatCurrency(1423540)}
                </div>

                <div className="text-gain text-sm font-mono-num mt-1">
                  +₹8,240 today (+0.58%)
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3">
                  {[
                    { name: "BTC", v: "+12.4%" },
                    { name: "RELIANCE", v: "+4.8%" },
                    { name: "ETH", v: "-1.2%" },
                  ].map((item, i) => (
                      <div
                          key={i}
                          className="rounded-xl bg-elevated p-3"
                      >
                        <div className="text-[10px] text-muted-foreground">
                          {item.name}
                        </div>

                        <div
                            className={`text-xs font-mono-num font-semibold ${
                                item.v.startsWith("+")
                                    ? "text-gain"
                                    : "text-loss"
                            }`}
                        >
                          {item.v}
                        </div>
                      </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </section>

        {/* Features */}

        <section className="max-w-6xl mx-auto px-6 pb-24 grid md:grid-cols-3 gap-5">
          {[
            {
              icon: LineChart,
              t: "Live Market Data",
              d: "Real-time prices for crypto, Indian stocks and mutual funds.",
            },
            {
              icon: Sparkles,
              t: "AI Portfolio Analyst",
              d: "Ask anything about your portfolio in plain English.",
            },
            {
              icon: PiggyBank,
              t: "Smart Budget Control",
              d: "Track spend by category with intelligent alerts.",
            },
          ].map((feature) => (
              <Card
                  key={feature.t}
                  glass
                  className="p-6"
              >
                <div className="size-10 rounded-xl bg-primary/15 text-primary grid place-items-center mb-4">
                  <feature.icon className="size-5" />
                </div>

                <h3 className="font-display font-semibold mb-1">
                  {feature.t}
                </h3>

                <p className="text-sm text-muted-foreground">
                  {feature.d}
                </p>
              </Card>
          ))}
        </section>

        {/* Footer */}

        <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
          © 2026 WealthOS · Built for Indian investors
        </footer>
      </div>
  );
}