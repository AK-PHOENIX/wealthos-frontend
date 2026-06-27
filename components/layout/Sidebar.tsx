import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Wallet,
  LineChart,
  PiggyBank,
  Receipt,
  Sparkles,
  Bell,
  Settings as SettingsIcon,
  TrendingUp,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useUserStore, useUIStore } from "@/store";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portfolio", label: "Portfolio", icon: Wallet },
  { href: "/markets", label: "Markets", icon: LineChart },
  { href: "/budget", label: "Budget", icon: PiggyBank },
  { href: "/expenses", label: "Expenses", icon: Receipt },
  { href: "/ai", label: "AI Analyst", icon: Sparkles },
  { href: "/alerts", label: "Alerts", icon: Bell },
  { href: "/settings", label: "Settings", icon: SettingsIcon },
];

export function Sidebar() {
  const user = useUserStore();
  const pathname = usePathname();
  const collapsed = useUIStore((s) => s.sidebarCollapsed);
  const toggle = useUIStore((s) => s.toggleSidebar);

  return (
      <>
        {/* Desktop */}
        <aside
            className={cn(
                "hidden md:flex fixed inset-y-0 left-0 flex-col border-r border-border bg-background z-30 transition-[width] duration-[280ms]",
                collapsed ? "w-16" : "w-60"
            )}
        >
          <div
              className={cn(
                  "h-14 flex items-center gap-2 border-b border-border",
                  collapsed ? "justify-center px-2" : "px-5 justify-between"
              )}
          >
            {!collapsed && (
                <div className="flex items-center gap-2 min-w-0">
                  <div className="size-7 rounded-lg bg-primary grid place-items-center text-primary-foreground">
                    <TrendingUp className="size-4" />
                  </div>
                  <span className="font-semibold text-sm">WealthOS</span>
                </div>
            )}

            <button
                onClick={toggle}
                className="size-8 grid place-items-center rounded-lg hover:bg-muted"
            >
              {collapsed ? (
                  <PanelLeftOpen className="size-4" />
              ) : (
                  <PanelLeftClose className="size-4" />
              )}
            </button>
          </div>

          {/* NAV */}
          <nav className={cn("flex-1 py-3 space-y-0.5", collapsed ? "px-2" : "px-3")}>
            {items.map((item) => {
              const active = pathname.startsWith(item.href);

              return (
                  <Link
                      key={item.href}
                      href={item.href}
                      title={collapsed ? item.label : undefined}
                      className={cn(
                          "relative flex items-center gap-3 rounded-lg text-sm font-medium transition",
                          collapsed ? "justify-center py-2.5" : "px-3 py-2",
                          active
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                  >
                    {active && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 bg-primary rounded-r" />
                    )}
                    <item.icon className="size-4" />
                    {!collapsed && item.label}
                  </Link>
              );
            })}
          </nav>

          {/* USER */}
          <div className={cn("border-t border-border", collapsed ? "p-2" : "p-3")}>
            <div
                className={cn(
                    "flex items-center gap-3",
                    collapsed ? "justify-center" : "px-2 py-1"
                )}
            >
              <div className="size-9 rounded-full bg-muted border grid place-items-center text-sm font-medium">
                {user.name?.split(" ").map((n) => n[0]).join("")}
              </div>

              {!collapsed && (
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{user.name}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </div>
                  </div>
              )}
            </div>
          </div>
        </aside>

        {/* MOBILE */}
        <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 border-t bg-card grid grid-cols-5 px-2 py-2">
          {items.slice(0, 5).map((item) => {
            const active = pathname.startsWith(item.href);

            return (
                <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        "flex flex-col items-center gap-0.5 py-1.5 rounded-lg text-[10px]",
                        active ? "text-primary" : "text-muted-foreground"
                    )}
                >
                  <item.icon className="size-5" />
                  {item.label}
                </Link>
            );
          })}
        </nav>
      </>
  );
}