'use client'
import { Fragment, useState } from "react"
import { Plus, Trash2, Wallet, ChevronDown } from "lucide-react"
import { AppShell } from "@/components/layout/AppShell"
import { Button, Card, Badge, Input, Label, SlideOver, EmptyState, Select, Tabs } from "@/components/ui_wealth"
import { Sparkline, MiniAreaChart } from "@/components/charts"
import { usePortfolioStore } from "@/store"
import { usePortfolioStats } from "@/hooks/usePortfolioStats"
import { formatCurrency, formatPercent, cn } from "@/lib/utils"
import type { AssetType } from "@/types"

export default function PortfolioPage() {
    const stats = usePortfolioStats()
    const { addHolding, removeHolding } = usePortfolioStore()
    const [open, setOpen] = useState(false)
    const [expanded, setExpanded] = useState<string | null>(null)
    const [filter, setFilter] = useState<"All" | "Stock" | "Crypto" | "Mutual Fund">("All")
    const [form, setForm] = useState({ symbol: "", name: "", type: "Stock" as AssetType, quantity: "", buyPrice: "", currentPrice: "", buyDate: new Date().toISOString().slice(0,10) })
    const [err, setErr] = useState("")

    function submit(e: React.FormEvent) {
        e.preventDefault()
        if (!form.symbol || !form.quantity || !form.buyPrice || !form.currentPrice) { setErr("Fill all required fields"); return }
        addHolding({
            symbol: form.symbol.toUpperCase(), name: form.name || form.symbol.toUpperCase(), type: form.type,
            quantity: Number(form.quantity), buyPrice: Number(form.buyPrice), currentPrice: Number(form.currentPrice), buyDate: form.buyDate,
        })
        setOpen(false); setForm({ ...form, symbol: "", name: "", quantity: "", buyPrice: "", currentPrice: "" }); setErr("")
    }

    return (
        <AppShell title="Portfolio">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-xl font-display font-semibold">My Portfolio</h2>
                    <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm text-muted-foreground">Total value</span>
                        <span className="font-mono-num font-semibold">{formatCurrency(stats.totalValue)}</span>
                        <Badge tone={stats.totalPL >= 0 ? "gain" : "loss"}>{formatCurrency(stats.totalPL, { signed: true })} ({formatPercent(stats.totalPLPct)})</Badge>
                    </div>
                </div>
                <Button onClick={() => setOpen(true)}><Plus className="size-4" /> Add Holding</Button>
            </div>

            {stats.holdings.length === 0 ? (
                <EmptyState icon={Wallet} title="No holdings yet" subtitle="Add your first asset to start tracking." action={<Button onClick={() => setOpen(true)}><Plus className="size-4" />Add Holding</Button>} />
            ) : (
                <Card className="p-0 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                        <Tabs value={filter} onChange={setFilter} options={[
                            { value: "All", label: "All" },
                            { value: "Stock", label: "Stocks" },
                            { value: "Crypto", label: "Crypto" },
                            { value: "Mutual Fund", label: "Mutual Funds" },
                        ]} />
                        <span className="text-xs text-muted-foreground font-mono-num">{stats.holdings.filter((h) => filter === "All" || h.type === filter).length} holdings</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="sticky top-0 bg-card border-b border-border">
                            <tr className="text-left text-xs text-muted-foreground">
                                {["Asset","Type","Qty","Buy","Current","Value","P&L","7D",""].map((h) => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}
                            </tr>
                            </thead>
                            <tbody>
                            {stats.holdings.filter((h) => filter === "All" || h.type === filter).map((h, idx) => {
                                const value = h.quantity * h.currentPrice
                                const pl = (h.currentPrice - h.buyPrice) * h.quantity
                                const plPct = ((h.currentPrice - h.buyPrice) / h.buyPrice) * 100
                                const spark = h.history.slice(-7).map((p) => p.price)
                                return (
                                    <Fragment key={h.id}>
                                        <tr className={cn("border-b border-border hover:bg-muted/40 transition cursor-pointer", idx % 2 && "bg-muted/20")} onClick={() => setExpanded(expanded === h.id ? null : h.id)}>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-9 rounded-lg bg-primary/15 text-primary grid place-items-center font-display font-bold text-xs">{h.symbol.slice(0,2)}</div>
                                                    <div><div className="font-medium">{h.symbol}</div><div className="text-xs text-muted-foreground">{h.name}</div></div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3"><Badge tone="neutral">{h.type}</Badge></td>
                                            <td className="px-4 py-3 font-mono-num">{h.quantity}</td>
                                            <td className="px-4 py-3 font-mono-num text-muted-foreground">{formatCurrency(h.buyPrice)}</td>
                                            <td className="px-4 py-3 font-mono-num">{formatCurrency(h.currentPrice)}</td>
                                            <td className="px-4 py-3 font-mono-num font-medium">{formatCurrency(value)}</td>
                                            <td className="px-4 py-3">
                                                <div className={cn("text-xs font-mono-num", pl >= 0 ? "text-gain" : "text-loss")}>
                                                    {formatCurrency(pl, { signed: true })}
                                                    <div>{formatPercent(plPct)}</div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3"><Sparkline data={spark} positive={pl >= 0} /></td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <ChevronDown className={cn("size-4 text-muted-foreground transition", expanded === h.id && "rotate-180")} />
                                                    <button onClick={(e) => { e.stopPropagation(); removeHolding(h.id) }} className="size-7 grid place-items-center rounded hover:bg-loss/15 hover:text-loss"><Trash2 className="size-3.5" /></button>
                                                </div>
                                            </td>
                                        </tr>
                                        {expanded === h.id && (
                                            <tr><td colSpan={9} className="px-6 py-4 bg-muted/30 border-b border-border">
                                                <div className="text-xs text-muted-foreground mb-2">30-day price · {h.symbol}</div>
                                                <MiniAreaChart data={h.history} />
                                            </td></tr>
                                        )}
                                    </Fragment>
                                )
                            })}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}

            <SlideOver open={open} onClose={() => setOpen(false)} title="Add Holding">
                <form onSubmit={submit} className="space-y-4">
                    <div><Label>Symbol *</Label><Input value={form.symbol} onChange={(e) => setForm({ ...form, symbol: e.target.value })} placeholder="BTC, RELIANCE" /></div>
                    <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Bitcoin" /></div>
                    <div><Label>Asset Type *</Label>
                        <Select value={form.type} onChange={(v) => setForm({ ...form, type: v as AssetType })} options={[{value:"Crypto",label:"Crypto"},{value:"Stock",label:"Stock"},{value:"Mutual Fund",label:"Mutual Fund"}]} className="w-full" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div><Label>Quantity *</Label><Input type="number" step="any" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} /></div>
                        <div><Label>Buy date</Label><Input type="date" value={form.buyDate} onChange={(e) => setForm({ ...form, buyDate: e.target.value })} /></div>
                        <div><Label>Buy price *</Label><Input type="number" step="any" value={form.buyPrice} onChange={(e) => setForm({ ...form, buyPrice: e.target.value })} /></div>
                        <div><Label>Current price *</Label><Input type="number" step="any" value={form.currentPrice} onChange={(e) => setForm({ ...form, currentPrice: e.target.value })} /></div>
                    </div>
                    {err && <p className="text-xs text-destructive">{err}</p>}
                    <Button type="submit" className="w-full">Add to Portfolio</Button>
                </form>
            </SlideOver>
        </AppShell>
    )
}