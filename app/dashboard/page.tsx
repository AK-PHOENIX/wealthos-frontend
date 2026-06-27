'use client'
import { useState } from "react"
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { AppShell } from "@/components/layout/AppShell"
import { Card, AnimatedNumber, Badge, Tabs } from "@/components/ui_wealth"
import { PortfolioAreaChart, AllocationPie } from "@/components/charts"
import { usePortfolioStats } from "@/hooks/usePortfolioStats"
import { usePortfolioStore, useBudgetStore } from "@/store"
import { formatCurrency, formatPercent } from "@/lib/utils"
import { mockMarket } from "@/lib/mockData/market"

export default function DashboardPage() {
    const stats = usePortfolioStats()
    const transactions = usePortfolioStore((s) => s.transactions)
    const budgets = useBudgetStore((s) => s.budgets)
    const [range, setRange] = useState<"1W" | "1M" | "3M" | "1Y" | "ALL">("1M")

    const days = stats.holdings[0]?.history?.length ?? 30
    const rangeDays: Record<string, number> = { "1W": 7, "1M": 30, "3M": 30, "1Y": 30, "ALL": 30 }
    const slice = Math.min(rangeDays[range], days)
    const chartData = Array.from({ length: slice }).map((_, idx) => {
        const i = days - slice + idx
        const date = stats.holdings[0]?.history[i]?.date ?? ""
        const value = stats.holdings.reduce((a, h) => a + (h.history[i]?.price ?? h.currentPrice) * h.quantity, 0)
        return { date, value }
    })

    const allocation = Object.entries(stats.byType).map(([name, value]) => ({ name, value }))
    const movers = [...mockMarket].sort((a, b) => Math.abs(b.change24h) - Math.abs(a.change24h)).slice(0, 4)

    return (
        <AppShell title="Dashboard">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard label="Total Portfolio Value" value={stats.totalValue} glass glow />
                <StatCard label="Today's Change" value={stats.todayChange} pct={stats.todayPct} glass glow />
                <StatCard label="Total P&L" value={stats.totalPL} pct={stats.totalPLPct} glass glow />
                <Card glass glow>
                    <div className="text-xs text-muted-foreground">Active Holdings</div>
                    <div className="text-3xl font-display font-bold mt-1 font-mono-num">{stats.count}</div>
                    <div className="text-xs text-muted-foreground mt-1">Across 3 asset classes</div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                <Card className="lg:col-span-3">
                    <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
                        <h3 className="font-display font-semibold text-sm">Portfolio Value</h3>
                        <div className="flex items-center gap-2">
                            <Tabs value={range} onChange={setRange} options={[
                                { value: "1W", label: "1W" },
                                { value: "1M", label: "1M" },
                                { value: "3M", label: "3M" },
                                { value: "1Y", label: "1Y" },
                                { value: "ALL", label: "ALL" },
                            ]} />
                            <Badge tone="gain">{formatPercent(stats.totalPLPct)}</Badge>
                        </div>
                    </div>
                    <PortfolioAreaChart data={chartData} />
                </Card>
                <Card className="lg:col-span-2">
                    <h3 className="font-display font-semibold text-sm mb-3">Asset Allocation</h3>
                    <AllocationPie data={allocation} />
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                    <h3 className="font-display font-semibold text-sm mb-3">Top Movers Today</h3>
                    <div className="space-y-2">
                        {movers.map((m) => (
                            <div key={m.symbol} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted transition">
                                <div className="flex items-center gap-3">
                                    <div className="size-9 rounded-lg bg-primary/15 text-primary grid place-items-center font-display font-bold text-xs">{m.symbol.slice(0,2)}</div>
                                    <div>
                                        <div className="font-medium text-sm">{m.symbol}</div>
                                        <div className="text-xs text-muted-foreground">{m.name}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-mono-num">{formatCurrency(m.price)}</span>
                                    <Badge tone={m.change24h >= 0 ? "gain" : "loss"}>
                                        {m.change24h >= 0 ? <ArrowUpRight className="size-3 inline" /> : <ArrowDownRight className="size-3 inline" />}
                                        {formatPercent(m.change24h)}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card>
                    <h3 className="font-display font-semibold text-sm mb-3">Recent Transactions</h3>
                    <div className="space-y-2">
                        {transactions.map((t) => (
                            <div key={t.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted transition">
                                <div className="flex items-center gap-3">
                                    <div className="size-9 rounded-lg bg-primary/15 text-primary grid place-items-center font-display font-bold text-xs">{t.symbol.slice(0,2)}</div>
                                    <div>
                                        <div className="text-sm font-medium">{t.symbol}</div>
                                        <div className="text-xs text-muted-foreground">{t.date}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge tone={t.type === "Buy" ? "primary" : "warning"}>{t.type}</Badge>
                                    <div className="text-right">
                                        <div className="text-sm font-mono-num">{t.quantity}</div>
                                        <div className="text-xs text-muted-foreground font-mono-num">{formatCurrency(t.price)}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            <Card>
                <h3 className="font-display font-semibold text-sm mb-3">Monthly Spend vs Budget</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                    {budgets.slice(0, 4).map((b) => {
                        const pct = Math.min(100, (b.spent / b.limit) * 100)
                        const tone = pct > 90 ? "bg-loss" : pct > 70 ? "bg-amber-500" : "bg-gain"
                        return (
                            <div key={b.id}>
                                <div className="flex justify-between text-xs mb-1.5">
                                    <span className="flex items-center gap-1.5"><span>{b.icon}</span>{b.category}</span>
                                    <span className="font-mono-num text-muted-foreground">{formatCurrency(b.spent)} / {formatCurrency(b.limit)}</span>
                                </div>
                                <div className="h-2 rounded-full bg-muted overflow-hidden">
                                    <div className={`h-full ${tone} transition-all`} style={{ width: pct + "%" }} />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </Card>
        </AppShell>
    )
}

function StatCard({ label, value, pct, glass, glow }: { label: string; value: number; pct?: number; glass?: boolean; glow?: boolean }) {
    const positive = value >= 0
    return (
        <Card glass={glass} glow={glow}>
            <div className="text-xs text-muted-foreground">{label}</div>
            <div className={`text-2xl md:text-3xl font-display font-bold mt-1 ${pct !== undefined ? (positive ? "text-gain" : "text-loss") : ""}`}>
                <AnimatedNumber value={value} format={(v) => formatCurrency(v, { signed: pct !== undefined })} />
            </div>
            {pct !== undefined && (
                <div className={`text-xs font-mono-num mt-1 ${positive ? "text-gain" : "text-loss"} flex items-center gap-1`}>
                    {positive ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}{formatPercent(pct)}
                </div>
            )}
        </Card>
    )
}