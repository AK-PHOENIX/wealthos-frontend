import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { motion } from "framer-motion";
import { useUIStore } from "@/store";
import { cn } from "@/lib/utils";

export function AppShell({ children, title }: { children: ReactNode; title: string }) {
  const collapsed = useUIStore((s) => s.sidebarCollapsed);
  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className={cn("transition-[padding] duration-[280ms] [transition-timing-function:cubic-bezier(0.25,0.1,0.25,1)]", collapsed ? "md:pl-16" : "md:pl-60")}>
        <Navbar title={title} />
        <motion.main
          key={title}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, ease: [0.25, 0.1, 0.25, 1] }}
          className="p-4 md:p-6 pb-24 md:pb-6 space-y-4"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
