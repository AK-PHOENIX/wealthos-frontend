"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, Button, Modal, Input, Label } from "@/components/ui_wealth";
import { useBudgetStore } from "@/store";
import { formatCurrency } from "@/lib/utils";

export default function Budget() {
    const { budgets, updateBudget } = useBudgetStore();
    const [editing, setEditing] = useState<string | null>(null);
    const [limit, setLimit] = useState("");

    const totalLimit = budgets.reduce((a, b) => a + b.limit, 0);
    const totalSpent = budgets.reduce((a, b) => a + b.spent, 0);
    const remaining = totalLimit - totalSpent;
    const editingBudget = budgets.find((b) => b.id === editing);

    const month = new Date().toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric",
    });

    return (
        <AppShell title="Budget">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-display font-bold">Monthly Budget</h2>
                    <p className="text-sm text-muted-foreground">{month}</p>
                </div>

                <Button
                    onClick={() => {
                        setEditing(budgets[0]?.id ?? null);
                        setLimit(String(budgets[0]?.limit ?? ""));
                    }}
                >
                    <Plus className="size-4" /> Set Budgets
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <Card>
                    <div className="text-xs text-muted-foreground">Total Budget</div>
                    <div className="text-2xl font-mono-num font-bold mt-1">
                        {formatCurrency(totalLimit)}
                    </div>
                </Card>

                <Card>
                    <div className="text-xs text-muted-foreground">Total Spent</div>
                    <div className="text-2xl font-mono-num font-bold mt-1 text-primary">
                        {formatCurrency(totalSpent)}
                    </div>
                </Card>

                <Card>
                    <div className="text-xs text-muted-foreground">Remaining</div>
                    <div
                        className={`text-2xl font-mono-num font-bold mt-1 ${
                            remaining >= 0 ? "text-gain" : "text-loss"
                        }`}
                    >
                        {formatCurrency(remaining, { signed: true })}
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {budgets.map((b) => {
                    const pct = Math.min(100, (b.spent / b.limit) * 100);
                    const tone =
                        pct > 90 ? "bg-loss" : pct > 70 ? "bg-amber-500" : "bg-gain";

                    return (
                        <Card
                            key={b.id}
                            className="cursor-pointer hover:scale-[1.005]"
                            onClick={() => {
                                setEditing(b.id);
                                setLimit(String(b.limit));
                            }}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="text-2xl">{b.icon}</div>
                                    <div>
                                        <div className="font-medium">{b.category}</div>
                                        <div className="text-xs text-muted-foreground font-mono-num">
                                            {formatCurrency(b.spent)} / {formatCurrency(b.limit)}
                                        </div>
                                    </div>
                                </div>

                                <div className="font-mono-num font-semibold text-sm">
                                    {pct.toFixed(0)}%
                                </div>
                            </div>

                            <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                                <div
                                    className={`h-full ${tone}`}
                                    style={{ width: pct + "%" }}
                                />
                            </div>
                        </Card>
                    );
                })}
            </div>

            <Modal
                open={!!editing}
                onClose={() => setEditing(null)}
                title={`Edit ${editingBudget?.category ?? ""} Budget`}
            >
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (editing && limit) {
                            updateBudget(editing, Number(limit));
                            setEditing(null);
                        }
                    }}
                    className="space-y-4"
                >
                    <div>
                        <Label>Monthly limit</Label>
                        <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                ₹
              </span>
                            <Input
                                type="number"
                                value={limit}
                                onChange={(e) => setLimit(e.target.value)}
                                className="pl-7"
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full">
                        Save
                    </Button>
                </form>
            </Modal>
        </AppShell>
    );
}