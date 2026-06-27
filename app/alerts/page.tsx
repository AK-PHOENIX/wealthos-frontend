"use client";

import { useState } from "react";
import { Plus, Bell, Trash2 } from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import {
  Card,
  Button,
  Modal,
  Input,
  Label,
  Badge,
  Select,
  EmptyState,
} from "@/components/ui_wealth";

import { useAlertStore } from "@/store";
import { marketService } from "@/lib/services";
import { formatCurrency, cn } from "@/lib/utils";

export default function AlertsPage() {
  const { alerts, addAlert, removeAlert } = useAlertStore();

  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    symbol: "BTC",
    condition: "above" as "above" | "below",
    targetPrice: "",
  });

  const [err, setErr] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.symbol || !form.targetPrice) {
      setErr("All fields required");
      return;
    }

    addAlert({
      symbol: form.symbol.toUpperCase(),
      condition: form.condition,
      targetPrice: Number(form.targetPrice),
    });

    setOpen(false);
    setForm({ symbol: "BTC", condition: "above", targetPrice: "" });
    setErr("");
  }

  return (
      <AppShell title="Alerts">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-display font-bold">
              Price Alerts
            </h2>
            <p className="text-sm text-muted-foreground">
              Get notified when assets hit your target.
            </p>
          </div>

          <Button onClick={() => setOpen(true)}>
            <Plus className="size-4" />
            Create Alert
          </Button>
        </div>

        {alerts.length === 0 ? (
            <EmptyState
                icon={Bell}
                title="No alerts yet"
                subtitle="Create your first price alert."
                action={
                  <Button onClick={() => setOpen(true)}>
                    <Plus className="size-4" />
                    Create Alert
                  </Button>
                }
            />
        ) : (
            <Card className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-border">
                  <tr className="text-left text-xs text-muted-foreground">
                    {[
                      "Asset",
                      "Condition",
                      "Target",
                      "Current",
                      "Status",
                      "",
                    ].map((h) => (
                        <th
                            key={h}
                            className="px-4 py-3 font-medium"
                        >
                          {h}
                        </th>
                    ))}
                  </tr>
                  </thead>

                  <tbody>
                  {alerts.map((a) => {
                    const m = marketService.bySymbol(a.symbol);
                    const cur = m?.price ?? a.currentPrice;

                    return (
                        <tr
                            key={a.id}
                            className="border-b border-border hover:bg-muted/40"
                        >
                          <td className="px-4 py-3 font-medium">
                            {a.symbol}
                          </td>

                          <td className="px-4 py-3 text-muted-foreground">
                            Goes {a.condition}{" "}
                            <span className="font-mono-num text-foreground">
                          {formatCurrency(a.targetPrice)}
                        </span>
                          </td>

                          <td className="px-4 py-3 font-mono-num">
                            {formatCurrency(a.targetPrice)}
                          </td>

                          <td className="px-4 py-3 font-mono-num">
                            {formatCurrency(cur)}
                          </td>

                          <td className="px-4 py-3">
                            <Badge
                                tone={
                                  a.status === "Active"
                                      ? "primary"
                                      : a.status === "Triggered"
                                          ? "gain"
                                          : "neutral"
                                }
                            >
                              {a.status === "Triggered" && (
                                  <Bell
                                      className={cn(
                                          "size-3 mr-1 inline",
                                          "animate-pulse"
                                      )}
                                  />
                              )}
                              {a.status}
                            </Badge>
                          </td>

                          <td className="px-4 py-3 text-right">
                            <button
                                onClick={() => removeAlert(a.id)}
                                className="size-7 grid place-items-center rounded hover:bg-loss/15 hover:text-loss ml-auto"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </td>
                        </tr>
                    );
                  })}
                  </tbody>
                </table>
              </div>
            </Card>
        )}

        <Modal
            open={open}
            onClose={() => setOpen(false)}
            title="Create Price Alert"
        >
          <form onSubmit={submit} className="space-y-4">
            <div>
              <Label>Symbol</Label>
              <Input
                  value={form.symbol}
                  onChange={(e) =>
                      setForm({ ...form, symbol: e.target.value })
                  }
                  placeholder="BTC"
              />
            </div>

            <div>
              <Label>Condition</Label>
              <Select
                  value={form.condition}
                  onChange={(v) =>
                      setForm({
                        ...form,
                        condition: v as "above" | "below",
                      })
                  }
                  options={[
                    { value: "above", label: "Price goes above" },
                    { value: "below", label: "Price goes below" },
                  ]}
                  className="w-full"
              />
            </div>

            <div>
              <Label>Target price</Label>
              <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                ₹
              </span>

                <Input
                    type="number"
                    value={form.targetPrice}
                    onChange={(e) =>
                        setForm({
                          ...form,
                          targetPrice: e.target.value,
                        })
                    }
                    className="pl-7"
                />
              </div>
            </div>

            {err && (
                <p className="text-xs text-destructive">{err}</p>
            )}

            <Button type="submit" className="w-full">
              Create Alert
            </Button>
          </form>
        </Modal>
      </AppShell>
  );
}