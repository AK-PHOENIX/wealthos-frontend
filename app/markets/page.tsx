"use client";

import { useMemo, useState, useEffect } from "react";
import { Plus, Search, ArrowUpRight, ArrowDownRight, Wifi, WifiOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { AppShell } from "@/components/layout/AppShell";
import { Card, Button, Badge, Tabs, Input } from "@/components/ui_wealth";
import { Sparkline } from "@/components/charts";

import { usePortfolioStore, useMarketStore } from "@/store";
import { useBinanceTicker } from "@/hooks/useBinanceTicker";
import { useUsdInr } from "@/hooks/useUsdInr";

import { formatCurrency, formatPercent } from "@/lib/utils";
import type { MarketAsset } from "@/types";

export default function MarketsPage() {
  const [tab, setTab] = useState<"Crypto" | "Stock">("Crypto");
  const [q, setQ] = useState("");

  const addHolding = usePortfolioStore((s) => s.addHolding);
  const { marketData, fetchMarketData } = useMarketStore();

  const { tickers, connected } = useBinanceTicker();
  const usdInr = useUsdInr();

  // Fetch initial data from backend
  useEffect(() => {
    fetchMarketData();
  }, []);

  // Merge backend data with live Binance tickers
  const mergedData = useMemo(() => {
    return marketData.map((m) => {
      if (m.type === 'Crypto' && tickers[m.symbol]) {
        const live = tickers[m.symbol];
        return {
          ...m,
          price: live.price * usdInr,      // convert USDT → INR
          change24h: live.change24h,
        };
      }
      return m;
    });
  }, [marketData, tickers, usdInr]);

  const items = useMemo(() => {
    return mergedData.filter(
      (m) =>
        m.type === tab &&
        (m.symbol.toLowerCase().includes(q.toLowerCase()) ||
          m.name.toLowerCase().includes(q.toLowerCase()))
    );
  }, [mergedData, tab, q]);

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
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <Tabs
            value={tab}
            onChange={setTab}
            options={[
              { value: "Crypto", label: "Crypto" },
              { value: "Stock", label: "Stocks" },
            ]}
          />
          {/* Live indicator */}
          <div className={`flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full border ${
            connected
              ? 'text-gain border-gain/30 bg-gain/10'
              : 'text-muted-foreground border-border'
          }`}>
            {connected ? (
              <><Wifi className="size-3" /> Live</>
            ) : (
              <><WifiOff className="size-3" /> Connecting...</>
            )}
          </div>
        </div>

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

      {/* Market grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {items.map((m) => {
            const isLive = m.type === 'Crypto' && !!tickers[m.symbol]
            return (
              <motion.div
                key={m.symbol}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                <Card className="hover:scale-[1.01] transition-all h-full">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="font-display font-bold text-lg">{m.symbol}</div>
                        {/* Pulse dot when live */}
                        {isLive && (
                          <span className="relative flex size-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gain opacity-75" />
                            <span className="relative inline-flex rounded-full size-2 bg-gain" />
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">{m.name}</div>
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

                  {/* Animated price */}
                  <motion.div
                    key={m.price}
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                    className="font-mono-num text-2xl font-semibold mt-2"
                  >
                    {formatCurrency(m.price)}
                  </motion.div>

                  {/* Live high/low for crypto */}
                  {isLive && tickers[m.symbol] && (
                    <div className="flex gap-3 mt-1 text-xs text-muted-foreground font-mono-num">
                      <span>H: {formatCurrency(tickers[m.symbol].high24h * usdInr)}</span>
                      <span>L: {formatCurrency(tickers[m.symbol].low24h * usdInr)}</span>
                    </div>
                  )}

                  <div className="my-3 -mx-2">
                    <Sparkline
                      data={m.history ?? []}
                      positive={m.change24h >= 0}
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
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </AppShell>
  );
}
