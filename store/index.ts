import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Holding, Expense, BudgetGoal, PriceAlert } from "@/types";
import { mockHoldings, mockTransactions } from "@/lib/mockData/holdings";
import { mockExpenses, mockBudgets } from "@/lib/mockData/expenses";
import { mockAlerts } from "@/lib/mockData/alerts";

interface PortfolioState {
  holdings: Holding[];
  transactions: typeof mockTransactions;
  addHolding: (h: Omit<Holding, "id" | "history">) => void;
  removeHolding: (id: string) => void;
  updateHolding: (id: string, patch: Partial<Holding>) => void;
}
export const usePortfolioStore = create<PortfolioState>()((set) => ({
  holdings: mockHoldings,
  transactions: mockTransactions,
  addHolding: (h) => set((s) => ({
    holdings: [...s.holdings, { ...h, id: crypto.randomUUID(), history: [{ date: new Date().toISOString().slice(0,10), price: h.currentPrice }] }],
  })),
  removeHolding: (id) => set((s) => ({ holdings: s.holdings.filter((x) => x.id !== id) })),
  updateHolding: (id, patch) => set((s) => ({ holdings: s.holdings.map((h) => h.id === id ? { ...h, ...patch } : h) })),
}));

interface ExpenseState {
  expenses: Expense[];
  addExpense: (e: Omit<Expense, "id">) => void;
  removeExpense: (id: string) => void;
}
export const useExpenseStore = create<ExpenseState>()((set) => ({
  expenses: mockExpenses,
  addExpense: (e) => set((s) => ({ expenses: [{ ...e, id: crypto.randomUUID() }, ...s.expenses] })),
  removeExpense: (id) => set((s) => ({ expenses: s.expenses.filter((x) => x.id !== id) })),
}));

interface BudgetState {
  budgets: BudgetGoal[];
  updateBudget: (id: string, limit: number) => void;
  addBudget: (b: Omit<BudgetGoal, "id" | "spent">) => void;
}
export const useBudgetStore = create<BudgetState>()((set) => ({
  budgets: mockBudgets,
  updateBudget: (id, limit) => set((s) => ({ budgets: s.budgets.map((b) => b.id === id ? { ...b, limit } : b) })),
  addBudget: (b) => set((s) => ({ budgets: [...s.budgets, { ...b, id: crypto.randomUUID(), spent: 0 }] })),
}));

interface AlertState {
  alerts: PriceAlert[];
  addAlert: (a: Omit<PriceAlert, "id" | "status" | "currentPrice">) => void;
  removeAlert: (id: string) => void;
}
export const useAlertStore = create<AlertState>()((set) => ({
  alerts: mockAlerts,
  addAlert: (a) => set((s) => ({ alerts: [...s.alerts, { ...a, id: crypto.randomUUID(), status: "Active", currentPrice: 0 }] })),
  removeAlert: (id) => set((s) => ({ alerts: s.alerts.filter((x) => x.id !== id) })),
}));

type Theme = "light" | "dark" | "system";
interface ThemeState { theme: Theme; setTheme: (t: Theme) => void; }
export const useThemeStore = create<ThemeState>()(
  persist((set) => ({ theme: "dark", setTheme: (t) => set({ theme: t }) }), { name: "wealthos-theme" })
);

interface UIState { sidebarCollapsed: boolean; toggleSidebar: () => void; setSidebarCollapsed: (v: boolean) => void; }
export const useUIStore = create<UIState>()(
  persist((set) => ({
    sidebarCollapsed: false,
    toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
    setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
  }), { name: "wealthos-ui" })
);

interface UserState {
  name: string; email: string; income: number;
  prefs: { currency: "INR" | "USD"; defaultView: "table" | "grid" };
  notifications: { email: boolean; priceAlerts: boolean; weekly: boolean };
  setUser: (p: Partial<UserState>) => void;
}
export const useUserStore = create<UserState>()(
  persist((set) => ({
    name: "Arjun Mehta",
    email: "arjun@wealthos.app",
    income: 185000,
    prefs: { currency: "INR", defaultView: "table" },
    notifications: { email: true, priceAlerts: true, weekly: false },
    setUser: (p) => set((s) => ({ ...s, ...p })),
  }), { name: "wealthos-user" })
);
