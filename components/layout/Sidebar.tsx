import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Wallet,
  LineChart,
  PiggyBank,
  Receipt,
  Bell,
  Settings as SettingsIcon,
  TrendingUp,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
  X,
  Sparkles,
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

// Bottom nav shows 5 items: Dashboard, Portfolio, Markets, AI Analyst, Expenses
const bottomNavItems = [
  items[0], // Dashboard
  items[1], // Portfolio
  items[2], // Markets
  items[5], // AI Analyst
  items[4], // Expenses
];

export function Sidebar() {
  const user = useUserStore();
  const pathname = usePathname();
  const collapsed = useUIStore((s) => s.sidebarCollapsed);
  const toggle = useUIStore((s) => s.toggleSidebar);
  const mobileDrawerOpen = useUIStore((s) => s.mobileDrawerOpen);
  const setMobileDrawerOpen = useUIStore((s) => s.setMobileDrawerOpen);

  // Close drawer on route change
  useEffect(() => {
    setMobileDrawerOpen(false);
  }, [pathname, setMobileDrawerOpen]);

  // Close drawer on Escape key
  useEffect(() => {
    if (!mobileDrawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileDrawerOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileDrawerOpen, setMobileDrawerOpen]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (mobileDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileDrawerOpen]);

  return (
      <>
        {/* ─── Desktop Sidebar ─── */}
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
                    collapsed ? "justify-center flex-col" : "px-2 py-1"
                )}
            >
              <div className="size-9 rounded-full bg-muted border grid place-items-center text-sm font-medium flex-shrink-0">
                {user.name?.split(" ").map((n) => n[0]).join("")}
              </div>

              {!collapsed && (
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium truncate">{user.name}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </div>
                  </div>
              )}

              <button
                  onClick={() => user.logout()}
                  title="Log out"
                  className={cn(
                      "flex-shrink-0 rounded-lg hover:bg-loss/10 hover:text-loss text-muted-foreground transition-colors duration-200",
                      collapsed ? "size-8 grid place-items-center" : "size-8 grid place-items-center"
                  )}
              >
                <LogOut className="size-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* ─── Mobile Drawer ─── */}
        <AnimatePresence>
          {mobileDrawerOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                    key="drawer-backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px]"
                    onClick={() => setMobileDrawerOpen(false)}
                />

                {/* Drawer Panel */}
                <motion.aside
                    key="drawer-panel"
                    initial={{ x: "-100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "-100%" }}
                    transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                    className="md:hidden fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] flex flex-col bg-card border-r border-border shadow-2xl pl-[env(safe-area-inset-left)]"
                >
                  {/* Drawer Header */}
                  <div className="h-14 flex items-center justify-between px-5 border-b border-border">
                    <div className="flex items-center gap-2">
                      <div className="size-7 rounded-lg bg-primary grid place-items-center text-primary-foreground">
                        <TrendingUp className="size-4" />
                      </div>
                      <span className="font-semibold text-sm font-display">WealthOS</span>
                    </div>
                    <button
                        onClick={() => setMobileDrawerOpen(false)}
                        className="size-8 grid place-items-center rounded-lg hover:bg-muted text-muted-foreground"
                        aria-label="Close menu"
                    >
                      <X className="size-4" />
                    </button>
                  </div>

                  {/* Drawer Nav */}
                  <nav className="flex-1 py-3 px-3 space-y-0.5 overflow-y-auto">
                    {items.map((item) => {
                      const active = pathname.startsWith(item.href);

                      return (
                          <Link
                              key={item.href}
                              href={item.href}
                              className={cn(
                                  "relative flex items-center gap-3 rounded-lg text-sm font-medium transition px-3 py-2.5",
                                  active
                                      ? "bg-primary/10 text-primary"
                                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                              )}
                          >
                            {active && (
                                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 bg-primary rounded-r" />
                            )}
                            <item.icon className="size-5" />
                            {item.label}
                          </Link>
                      );
                    })}
                  </nav>

                  {/* Drawer User Section */}
                  <div className="border-t border-border p-3">
                    <div className="flex items-center gap-3 px-2 py-2">
                      <div className="size-10 rounded-full bg-gradient-to-br from-primary to-accent2 grid place-items-center text-white text-sm font-bold flex-shrink-0">
                        {user.name?.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium truncate">{user.name}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </div>
                      </div>
                    </div>
                    <button
                        onClick={() => user.logout()}
                        className="mt-2 w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-loss hover:bg-loss/10 transition-colors"
                    >
                      <LogOut className="size-5" />
                      Log Out
                    </button>
                  </div>
                </motion.aside>
              </>
          )}
        </AnimatePresence>

        {/* ─── Mobile Bottom Nav ─── */}
        <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 border-t bg-card grid grid-cols-5 px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          {bottomNavItems.map((item) => {
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