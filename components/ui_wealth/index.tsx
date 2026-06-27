import { ReactNode, HTMLAttributes, ButtonHTMLAttributes, InputHTMLAttributes, useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { X } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

export function Card({ className, glass, glow, children, ...p }: HTMLAttributes<HTMLDivElement> & { glass?: boolean; glow?: boolean }) {
  return (
    <div
      {...p}
      className={cn(
        "rounded-xl border border-border bg-card p-4 md:p-5 transition-all duration-[280ms] [transition-timing-function:cubic-bezier(0.25,0.1,0.25,1)] shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.25)]",
        className
      )}
    >
      {children}
    </div>
  );
}

type BtnVariant = "primary" | "ghost" | "outline" | "destructive";
type BtnSize = "sm" | "md" | "lg" | "icon";
export function Button({
  className, variant = "primary", size = "md", children, ...p
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: BtnVariant; size?: BtnSize }) {
  const variants: Record<BtnVariant, string> = {
    primary: "bg-primary text-primary-foreground hover:opacity-90",
    ghost: "bg-transparent text-foreground hover:bg-elevated border border-border",
    outline: "border border-border bg-transparent text-foreground hover:bg-elevated",
    destructive: "bg-loss/10 text-loss border border-loss/30 hover:bg-loss/15",
  };
  const sizes: Record<BtnSize, string> = {
    sm: "h-9 px-4 text-xs",
    md: "h-10 px-5 text-sm",
    lg: "h-11 px-6 text-sm",
    icon: "h-10 w-10",
  };
  return (
    <button
      {...p}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-[10px] font-medium transition-all duration-[280ms] [transition-timing-function:cubic-bezier(0.25,0.1,0.25,1)] active:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:opacity-50",
        variants[variant], sizes[size], className
      )}
    >
      {children}
    </button>
  );
}

export function Input({ className, ...p }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...p}
      className={cn(
        "h-10 w-full rounded-[10px] border border-input bg-elevated px-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 transition-all duration-[280ms]",
        className
      )}
    />
  );
}

export function Label({ className, children, ...p }: HTMLAttributes<HTMLLabelElement>) {
  return <label {...p} className={cn("text-xs font-normal tracking-[0.01em] text-muted-foreground mb-2 block", className)}>{children}</label>;
}

export function Badge({ children, tone = "neutral", className }: { children: ReactNode; tone?: "neutral" | "gain" | "loss" | "primary" | "warning"; className?: string }) {
  const tones = {
    neutral: "bg-muted text-muted-foreground",
    gain: "bg-gain/10 text-gain",
    loss: "bg-loss/10 text-loss",
    primary: "bg-primary/10 text-primary",
    warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  };
  return <span className={cn("inline-flex items-center px-2 py-[3px] rounded-md text-[11px] font-medium font-mono-num", tones[tone], className)}>{children}</span>;
}

export function Modal({ open, onClose, title, children, size = "md" }: { open: boolean; onClose: () => void; title: string; children: ReactNode; size?: "md" | "lg" }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-black/60 animate-in fade-in" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
        className={cn("relative bg-card border border-border rounded-2xl p-8 w-full", size === "lg" ? "max-w-2xl" : "max-w-md")}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display font-semibold">{title}</h2>
          <button onClick={onClose} className="size-8 grid place-items-center rounded-lg hover:bg-muted">
            <X className="size-4" />
          </button>
        </div>
        {children}
      </motion.div>
    </div>
  );
}

export function SlideOver({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/60" onClick={onClose}>
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        transition={{ duration: 0.38, ease: [0.25, 0.1, 0.25, 1] }}
        className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-card border-l border-border p-8 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-display font-semibold">{title}</h2>
          <button onClick={onClose} className="size-8 grid place-items-center rounded-lg hover:bg-muted">
            <X className="size-4" />
          </button>
        </div>
        {children}
      </motion.div>
    </div>
  );
}

export function AnimatedNumber({ value, format = (v) => formatCurrency(v), className }: { value: number; format?: (v: number) => string; className?: string }) {
  const mv = useMotionValue(0);
  const [display, setDisplay] = useState(format(0));
  useEffect(() => {
    const controls = animate(mv, value, { duration: 1.2, ease: "easeOut", onUpdate: (v) => setDisplay(format(v)) });
    return controls.stop;
  }, [value]);
  return <span className={cn("font-mono-num tabular-nums", className)}>{display}</span>;
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-lg bg-muted", className)} />;
}

export function EmptyState({ icon: Icon, title, subtitle, action }: { icon: any; title: string; subtitle: string; action?: ReactNode }) {
  return (
    <div className="text-center py-16">
      <div className="size-16 mx-auto rounded-2xl bg-primary/10 grid place-items-center mb-4">
        <Icon className="size-8 text-primary" />
      </div>
      <h3 className="font-display font-semibold text-lg">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1 mb-4">{subtitle}</p>
      {action}
    </div>
  );
}

export function Tabs<T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: { value: T; label: string }[] }) {
  return (
    <div className="inline-flex p-1 bg-elevated rounded-[10px] border border-border">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            "px-4 h-8 rounded-md text-xs font-medium transition-all duration-[280ms]",
            value === opt.value ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export function Select({ value, onChange, options, className }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; className?: string }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn("h-10 rounded-[10px] border border-input bg-elevated px-3 text-sm focus-visible:ring-2 focus-visible:ring-ring/50 outline-none", className)}
    >
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

export function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={cn("relative w-10 h-6 rounded-full transition-colors", checked ? "bg-primary" : "bg-muted")}
    >
      <span className={cn("absolute top-0.5 size-5 rounded-full bg-white shadow transition-transform", checked ? "translate-x-[18px]" : "translate-x-0.5")} />
    </button>
  );
}
