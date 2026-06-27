"use client";

import { useMemo, useState } from "react";
import { Plus, Search, ArrowUpRight, ArrowDownRight } from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { Card, Button, Badge, Tabs, Input } from "@/components/ui_wealth";
import { Sparkline } from "@/components/charts";

import { marketService } from "@/lib/services";
import { usePortfolioStore } from "@/store";

import { formatCurrency, formatPercent } from "@/lib/utils";
import type { MarketAsset } from "@/types";

export default function MarketsPage() {
  const [tab, setTab] = useState<"Crypto" | "Stock">("Crypto");
  const [q, setQ] = useState("");

  const addHolding = usePortfolioStore((s) => s.addHolding);

  const items = useMemo(() => {
    return marketService
        .list()
        .filter(
            (m) =>
                m.type === tab &&
                (m.symbol.toLowerCase().includes(q.toLowerCase()) ||
                    m.name.toLowerCase().includes(q.toLowerCase()))
        );
  }, [tab, q]);

  function quickAdd(m: MarketAsset) {
    addHolding({
      symbol: m.symbol,
      name: m.name,
      type: m.type,
      quantity: 1,
      buyPrice: m.price,
      currentPrice: m.price,
      buyDate: new Date().toISOString().slice(0, 10),
    });
  }

  return (
      <AppShell title="Markets">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <Tabs
              value={tab}
              onChange={setTab}
              options={[
                { value: "Crypto", label: "Crypto" },
                { value: "Stock", label: "Stocks" },
              ]}
          />

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />

            <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search markets..."
                className="pl-9"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((m) => (
              <Card
                  key={m.symbol}
                  className="hover:scale-[1.01] dark:hover:glow-primary transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-display font-bold text-lg">
                      {m.symbol}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {m.name}
                    </div>
                  </div>

                  <Badge tone={m.change24h >= 0 ? "gain" : "loss"}>
                    {m.change24h >= 0 ? (
                        <ArrowUpRight className="size-3 inline" />
                    ) : (
                        <ArrowDownRight className="size-3 inline" />
                    )}

                    {formatPercent(m.change24h)}
                  </Badge>
                </div>

                <div className="font-mono-num text-2xl font-semibold mt-2">
                  {formatCurrency(m.price)}
                </div>

                <div className="my-3 -mx-2">
                  <Sparkline
                      data={m.history}
                      positive={m.change24h >= 0}
                      width={300}
                      height={50}
                  />
                </div>

                <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => quickAdd(m)}
                    className="w-full"
                >
                  <Plus className="size-3.5" />
                  Add to Portfolio
                </Button>
              </Card>
          ))}
        </div>
      </AppShell>
  );
}