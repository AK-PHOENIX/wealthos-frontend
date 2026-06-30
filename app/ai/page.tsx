"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Sparkles, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";

import { AppShell } from "@/components/layout/AppShell";
import { Card, Button, Input } from "@/components/ui_wealth";

import { usePortfolioStats } from "@/hooks/usePortfolioStats";
import { useExpenseStore, useBudgetStore } from "@/store";

import { formatCurrency, formatPercent, cn } from "@/lib/utils";
import type { ChatMessage } from "@/types";
import api from "@/lib/api";

const SUGGESTED = [
  "How is my portfolio doing?",
  "Where am I overspending?",
  "What are my riskiest holdings?",
  "Give me a savings tip.",
];

export default function AIPage() {
  const stats = usePortfolioStats();
  const expenses = useExpenseStore((s) => s.expenses);
  const budgets = useBudgetStore((s) => s.budgets);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "intro",
      role: "assistant",
      content: `Hi! I've analyzed your portfolio of **${formatCurrency(
          stats.totalValue
      )}**. Ask me anything — performance, risk, spending, or a savings strategy.`,
    },
  ]);

  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.scrollTo({
      top: ref.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, typing]);

  const topHolding = [...stats.holdings].sort(
      (a, b) =>
          b.quantity * b.currentPrice - a.quantity * a.currentPrice
  )[0];

  const topExpenseCat = budgets.reduce(
      (p, c) => (c.spent > p.spent ? c : p),
      budgets[0]
  );

  const overBudget = budgets.filter((b) => b.spent > b.limit);

  const monthlySpend = expenses.reduce((a, e) => a + e.amount, 0);

  const budgetScore = Math.max(
      0,
      Math.min(
          100,
          100 -
          overBudget.length * 15 -
          (monthlySpend >
          budgets.reduce((a, b) => a + b.limit, 0)
              ? 20
              : 0)
      )
  );

  async function send(q: string) {
    if (!q.trim()) return;

    setMessages((m) => [
      ...m,
      { id: crypto.randomUUID(), role: "user", content: q },
    ]);

    setInput("");
    setTyping(true);

    try {
      const res = await api.post("/ai/chat", { message: q });
      setMessages((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: res.data.reply || "Unable to process right now."
        },
      ]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Sorry, I'm having trouble connecting to the AI service right now."
        },
      ]);
    } finally {
      setTyping(false);
    }
  }

  const userMessages = messages.filter(
      (m) => m.role === "user"
  ).length;

  return (
      <AppShell title="AI Analyst">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 h-[calc(100vh-9rem)]">
          <Card className="lg:col-span-3 overflow-y-auto">
            <h3 className="font-display font-semibold mb-4">
              Your Financial Snapshot
            </h3>

            <div className="space-y-3">
              <Snap
                  label="Portfolio value"
                  value={formatCurrency(stats.totalValue)}
              />
              <Snap
                  label="Monthly spend"
                  value={formatCurrency(monthlySpend)}
              />
              <Snap
                  label="Budget health"
                  value={`${budgetScore} / 100`}
              />
              <Snap
                  label="Top holding"
                  value={`${topHolding?.symbol} · ${formatCurrency(
                      (topHolding?.quantity ?? 0) *
                      (topHolding?.currentPrice ?? 0)
                  )}`}
              />
              <Snap
                  label="Biggest expense category"
                  value={`${topExpenseCat?.category} · ${formatCurrency(
                      topExpenseCat?.spent ?? 0
                  )}`}
              />
            </div>
          </Card>

          <Card className="lg:col-span-7 flex flex-col p-0 overflow-hidden">
            <div
                ref={ref}
                className="flex-1 overflow-y-auto p-6 space-y-4"
            >
              {messages.map((m) => (
                  <div
                      key={m.id}
                      className={cn(
                          "flex gap-3",
                          m.role === "user" && "flex-row-reverse"
                      )}
                  >
                    {m.role === "assistant" && (
                        <div className="size-8 rounded-lg bg-primary/15 text-primary grid place-items-center shrink-0">
                          <Bot className="size-4" />
                        </div>
                    )}

                    <div
                        className={cn(
                            "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
                            m.role === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-foreground"
                        )}
                    >
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                    </div>
                  </div>
              ))}

              {typing && (
                  <div className="flex gap-3">
                    <div className="size-8 rounded-lg bg-primary/15 text-primary grid place-items-center">
                      <Bot className="size-4" />
                    </div>
                    <div className="bg-muted rounded-2xl px-4 py-3 flex gap-1">
                      {[0, 1, 2].map((i) => (
                          <span
                              key={i}
                              className="size-1.5 rounded-full bg-muted-foreground animate-bounce"
                              style={{ animationDelay: `${i * 0.15}s` }}
                          />
                      ))}
                    </div>
                  </div>
              )}
            </div>

            {userMessages === 0 && (
                <div className="px-6 pb-3 flex flex-wrap gap-2">
                  {SUGGESTED.map((s) => (
                      <button
                          key={s}
                          onClick={() => send(s)}
                          className="px-3 h-8 rounded-full border text-xs hover:bg-muted flex items-center gap-1.5"
                      >
                        <Sparkles className="size-3 text-primary" />
                        {s}
                      </button>
                  ))}
                </div>
            )}

            <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
                className="p-4 border-t flex gap-2"
            >
              <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about your portfolio..."
              />
              <Button type="submit" size="icon">
                <Send className="size-4" />
              </Button>
            </form>
          </Card>
        </div>
      </AppShell>
  );
}

function Snap({
                label,
                value,
              }: {
  label: string;
  value: string;
}) {
  return (
      <div className="p-3 rounded-xl bg-muted">
        <div className="text-[11px] text-muted-foreground uppercase">
          {label}
        </div>
        <div className="font-semibold mt-1 text-sm">{value}</div>
      </div>
  );
}