import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, BarChart3, Brain, Wallet } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
      <main className="min-h-screen bg-background text-foreground">

        {/* NAVBAR */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="font-semibold text-lg">WealthOS</div>

          <div className="flex gap-3">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>

        {/* HERO */}
        <section className="max-w-6xl mx-auto px-6 py-24 text-center">
          <h1 className="text-5xl font-bold tracking-tight">
            Your Portfolio. Understood.
          </h1>

          <p className="text-muted-foreground mt-4 text-lg">
            Track stocks, crypto, and mutual funds with AI-powered insights.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <Link href="/signup">
              <Button size="lg">
                Get Started <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>

            <Link href="/dashboard">
              <Button variant="outline" size="lg">
                View Dashboard
              </Button>
            </Link>
          </div>
        </section>

        {/* FEATURES */}
        <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-6">

          <Card className="p-6">
            <BarChart3 className="w-6 h-6 mb-3 text-blue-500" />
            <h3 className="font-semibold">Live Market Data</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Real-time tracking of stocks and crypto assets.
            </p>
          </Card>

          <Card className="p-6">
            <Brain className="w-6 h-6 mb-3 text-purple-500" />
            <h3 className="font-semibold">AI Portfolio Analyst</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Smart insights based on your holdings and spending.
            </p>
          </Card>

          <Card className="p-6">
            <Wallet className="w-6 h-6 mb-3 text-green-500" />
            <h3 className="font-semibold">Smart Budget Tracking</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Stay on top of your monthly expenses easily.
            </p>
          </Card>

        </section>

        {/* FOOTER */}
        <footer className="border-t py-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} WealthOS. All rights reserved.
        </footer>

      </main>
  );
}