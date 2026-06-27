"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2, Sparkles } from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { Card, Button, Modal, Input, Label, Badge, Select } from "@/components/ui_wealth";
import { SimpleBarChart } from "@/components/charts";
import { useExpenseStore } from "@/store";
import { formatCurrency, classifyExpense, cn } from "@/lib/utils";

const CATEGORIES = ["Food","Transport","EMI","Entertainment","Healthcare","Shopping","Other"];

export default function ExpensesPage() {
  const { expenses, addExpense, removeExpense } = useExpenseStore();

  const [filter, setFilter] = useState("All");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    amount: "",
    description: "",
    date: new Date().toISOString().slice(0,10),
    category: "Other",
    auto: true
  });

  const [err, setErr] = useState("");

  const filtered = useMemo(
      () => filter === "All" ? expenses : expenses.filter((e) => e.category === filter),
      [expenses, filter]
  );

  const total = filtered.reduce((a, e) => a + e.amount, 0);

  const grouped = useMemo(() => {
    const m = new Map<string, typeof expenses>();
    filtered.forEach((e) => {
      const arr = m.get(e.date) ?? [];
      arr.push(e);
      m.set(e.date, arr);
    });
    return [...m.entries()].sort((a, b) => b[0].localeCompare(a[0]));
  }, [filtered]);

  const byCat = CATEGORIES.map((c) => ({
    name: c,
    value: expenses.filter((e) => e.category === c).reduce((a, e) => a + e.amount, 0)
  })).filter((x) => x.value > 0);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.amount || !form.description) {
      setErr("Amount and description required");
      return;
    }

    const cat = form.auto
        ? classifyExpense(form.description)
        : form.category;

    addExpense({
      amount: Number(form.amount),
      description: form.description,
      date: form.date,
      category: cat
    });

    setOpen(false);
    setForm({
      amount: "",
      description: "",
      date: new Date().toISOString().slice(0,10),
      category: "Other",
      auto: true
    });
    setErr("");
  }

  function dateLabel(d: string) {
    const today = new Date().toISOString().slice(0,10);
    const yest = new Date(Date.now() - 86400000).toISOString().slice(0,10);

    if (d === today) return "Today";
    if (d === yest) return "Yesterday";

    return new Date(d).toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short"
    });
  }

  return (
      <AppShell title="Expenses">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-display font-bold">
              {formatCurrency(total)}
              <span className="text-sm text-muted-foreground font-normal ml-2">
              this month
            </span>
            </h2>
          </div>

          <Button onClick={() => setOpen(true)}>
            <Plus className="size-4" /> Add Expense
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {["All", ...CATEGORIES].map((c) => (
              <button
                  key={c}
                  onClick={() => setFilter(c)}
                  className={cn(
                      "px-3 h-8 rounded-full text-xs",
                      filter === c
                          ? "bg-primary text-white"
                          : "bg-muted text-muted-foreground"
                  )}
              >
                {c}
              </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          <Card className="lg:col-span-2 p-0">
            <div className="divide-y">
              {grouped.map(([date, items]) => (
                  <div key={date} className="p-4">
                    <div className="text-xs mb-2">{dateLabel(date)}</div>

                    {items.map((e) => (
                        <div key={e.id} className="flex justify-between p-2">
                          <div>{e.description}</div>
                          <div>{formatCurrency(e.amount)}</div>
                          <button onClick={() => removeExpense(e.id)}>
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                    ))}
                  </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3>Spending by Category</h3>
            <SimpleBarChart data={byCat} />
          </Card>

        </div>

        <Modal open={open} onClose={() => setOpen(false)} title="Add Expense">
          <form onSubmit={submit} className="space-y-4">

            <Input
                type="number"
                placeholder="Amount"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />

            <Input
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
            />

            <Input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
            />

            <Select
                value={form.category}
                onChange={(v) => setForm({ ...form, category: v })}
                options={CATEGORIES.map((c) => ({ value: c, label: c }))}
            />

            {err && <p className="text-red-500 text-xs">{err}</p>}

            <Button type="submit" className="w-full">
              Add Expense
            </Button>

          </form>
        </Modal>

      </AppShell>
  );
}