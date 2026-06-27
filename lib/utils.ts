import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, opts?: { compact?: boolean; signed?: boolean }) {
  const sign = opts?.signed && value > 0 ? "+" : "";
  if (opts?.compact && Math.abs(value) >= 10000000) {
    return `${sign}₹${(value / 10000000).toFixed(2)}Cr`;
  }
  if (opts?.compact && Math.abs(value) >= 100000) {
    return `${sign}₹${(value / 100000).toFixed(2)}L`;
  }
  const fmt = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${sign}₹${fmt.format(Math.abs(value) === value ? value : value)}`;
}

export function formatPercent(value: number, digits = 2) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(digits)}%`;
}

export function formatNumber(value: number, digits = 2) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: digits }).format(value);
}

export function classifyExpense(description: string): string {
  const d = description.toLowerCase();
  if (/zomato|swiggy|restaurant|cafe|food|coffee|pizza|biryani|lunch|dinner|breakfast/.test(d)) return "Food";
  if (/uber|ola|metro|petrol|fuel|train|bus|flight/.test(d)) return "Transport";
  if (/emi|loan|rent|mortgage/.test(d)) return "EMI";
  if (/netflix|spotify|movie|prime|hotstar|concert/.test(d)) return "Entertainment";
  if (/hospital|pharmacy|medicine|doctor|clinic/.test(d)) return "Healthcare";
  if (/amazon|flipkart|myntra|shopping|mall|zara|h&m/.test(d)) return "Shopping";
  return "Other";
}
