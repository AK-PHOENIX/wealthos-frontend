import { Bell, Search } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useUserStore, useAlertStore } from "@/store";

export function Navbar({ title }: { title: string }) {
  const user = useUserStore();
  const alertCount = useAlertStore((s) => s.alerts.filter((a) => a.status === "Active").length);
  return (
    <header className="sticky top-0 z-20 h-14 px-4 md:px-8 flex items-center justify-between border-b border-border bg-card">
      <h1 className="text-base md:text-lg font-display font-medium">{title}</h1>
      <div className="flex items-center gap-2">
        <button className="size-9 hidden sm:inline-flex items-center justify-center rounded-full border border-border bg-elevated hover:bg-muted transition-all duration-[280ms] active:opacity-75" aria-label="Search">
          <Search className="size-4" />
        </button>
        <button className="relative size-9 inline-flex items-center justify-center rounded-full border border-border bg-elevated hover:bg-muted transition-all duration-[280ms] active:opacity-75" aria-label="Notifications">
          <Bell className="size-4" />
          {alertCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full text-[10px] bg-loss text-white grid place-items-center font-medium">{alertCount}</span>
          )}
        </button>
        <ThemeToggle />
        <div className="size-9 rounded-full bg-elevated border border-border grid place-items-center text-foreground text-xs font-medium">
          {user.name.split(" ").map((n) => n[0]).join("")}
        </div>
      </div>
    </header>
  );
}
