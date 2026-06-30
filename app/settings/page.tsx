"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import {
    Card,
    Button,
    Input,
    Label,
    Tabs,
    Toggle,
    Modal,
    Select,
} from "@/components/ui_wealth";
import { useUserStore, useThemeStore } from "@/store";

function Row({
                 label,
                 children,
             }: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-sm">{label}</span>
            {children}
        </div>
    );
}

export default function SettingsPage() {
    const user = useUserStore();
    const { theme, setTheme } = useThemeStore();

    const [tab, setTab] = useState("Profile");
    const [confirm, setConfirm] = useState(false);

    return (
        <AppShell title="Settings">
            <Tabs
                value={tab}
                onChange={setTab}
                options={[
                    { value: "Profile", label: "Profile" },
                    { value: "Preferences", label: "Preferences" },
                    { value: "Notifications", label: "Notifications" },
                    { value: "Danger", label: "Danger Zone" },
                ]}
            />

            <div className="mt-6 max-w-2xl">
                {tab === "Profile" && (
                    <Card>
                        <h3 className="font-display font-semibold mb-4">Profile</h3>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="size-16 rounded-2xl bg-gradient-to-br from-primary to-accent2 grid place-items-center text-white text-xl font-bold">
                                {user.name
                                    .split(" ")
                                    .map((n: string) => n[0])
                                    .join("")}
                            </div>

                            <Button variant="outline" size="sm">
                                Upload Avatar
                            </Button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <Label>Name</Label>
                                <Input
                                    value={user.name}
                                    onChange={(e) =>
                                        user.setUser({ name: e.target.value })
                                    }
                                />
                            </div>

                            <div>
                                <Label>Email</Label>
                                <Input
                                    value={user.email}
                                    onChange={(e) =>
                                        user.setUser({ email: e.target.value })
                                    }
                                />
                            </div>

                            <div>
                                <Label>Monthly income</Label>
                                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    ₹
                  </span>
                                    <Input
                                        type="number"
                                        value={user.income}
                                        onChange={(e) =>
                                            user.setUser({
                                                income: Number(e.target.value),
                                            })
                                        }
                                        className="pl-7"
                                    />
                                </div>
                            </div>
                        </div>

                        <Button className="mt-6" onClick={() => user.saveUser()}>Save Changes</Button>
                    </Card>
                )}

                {tab === "Preferences" && (
                    <Card>
                        <h3 className="font-display font-semibold mb-4">
                            Preferences
                        </h3>

                        <div className="space-y-5">
                            <Row label="Currency">
                                <Select
                                    value={user.prefs.currency}
                                    onChange={(v) =>
                                        user.setUser({
                                            prefs: {
                                                ...user.prefs,
                                                currency: v as "INR" | "USD",
                                            },
                                        })
                                    }
                                    options={[
                                        { value: "INR", label: "INR (₹)" },
                                        { value: "USD", label: "USD ($)" },
                                    ]}
                                />
                            </Row>

                            <Row label="Default portfolio view">
                                <Select
                                    value={user.prefs.defaultView}
                                    onChange={(v) =>
                                        user.setUser({
                                            prefs: {
                                                ...user.prefs,
                                                defaultView: v as "table" | "grid",
                                            },
                                        })
                                    }
                                    options={[
                                        { value: "table", label: "Table" },
                                        { value: "grid", label: "Grid" },
                                    ]}
                                />
                            </Row>

                            <Row label="Theme">
                                <Select
                                    value={theme}
                                    onChange={(v) => setTheme(v as any)}
                                    options={[
                                        { value: "light", label: "Light" },
                                        { value: "dark", label: "Dark" },
                                        { value: "system", label: "System" },
                                    ]}
                                />
                            </Row>
                        </div>
                    </Card>
                )}

                {tab === "Notifications" && (
                    <Card>
                        <h3 className="font-display font-semibold mb-4">
                            Notifications
                        </h3>

                        <div className="space-y-5">
                            <Row label="Email alerts">
                                <Toggle
                                    checked={user.notifications.email}
                                    onChange={(v) =>
                                        user.setUser({
                                            notifications: {
                                                ...user.notifications,
                                                email: v,
                                            },
                                        })
                                    }
                                />
                            </Row>

                            <Row label="Price alerts">
                                <Toggle
                                    checked={user.notifications.priceAlerts}
                                    onChange={(v) =>
                                        user.setUser({
                                            notifications: {
                                                ...user.notifications,
                                                priceAlerts: v,
                                            },
                                        })
                                    }
                                />
                            </Row>

                            <Row label="Weekly summary">
                                <Toggle
                                    checked={user.notifications.weekly}
                                    onChange={(v) =>
                                        user.setUser({
                                            notifications: {
                                                ...user.notifications,
                                                weekly: v,
                                            },
                                        })
                                    }
                                />
                            </Row>
                        </div>
                    </Card>
                )}

                {tab === "Danger" && (
                    <Card className="border-loss/40">
                        <h3 className="font-display font-semibold mb-1 text-loss">
                            Danger Zone
                        </h3>

                        <p className="text-sm text-muted-foreground mb-5">
                            Permanent actions. Be careful.
                        </p>

                        <Button
                            variant="destructive"
                            onClick={() => setConfirm(true)}
                        >
                            Delete Account
                        </Button>
                    </Card>
                )}
            </div>

            <Modal
                open={confirm}
                onClose={() => setConfirm(false)}
                title="Delete account?"
            >
                <p className="text-sm text-muted-foreground mb-5">
                    This will permanently delete your WealthOS account and all
                    data. This cannot be undone.
                </p>

                <div className="flex gap-2 justify-end">
                    <Button
                        variant="outline"
                        onClick={() => setConfirm(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={() => setConfirm(false)}
                    >
                        Yes, delete
                    </Button>
                </div>
            </Modal>
        </AppShell>
    );
}