import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Holding, Expense, BudgetGoal, PriceAlert, MarketAsset } from "@/types";
import api from "@/lib/api";

const generateSparkHistory = (price: number) => {
  const arr = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const variation = 1 + Math.sin(i) * 0.05;
    arr.push(Number((price * variation).toFixed(2)));
  }
  return arr;
};

const mapBackendHoldingToFrontend = (h: any): Holding => {
  const assetTypeMap: Record<string, string> = {
    crypto: "Crypto",
    stock: "Stock",
    mutual_fund: "Mutual Fund"
  };
  const type = assetTypeMap[h.assetType] || assetTypeMap[h.asset_type] || "Stock";
  const price = Number(h.currentPrice || h.current_price || h.price || h.buyPrice || h.buy_price || 0);

  return {
    id: h.id,
    portfolioId: h.portfolioId || h.portfolio_id,
    symbol: h.symbol,
    name: h.name || h.symbol,
    type: type,
    quantity: Number(h.quantity),
    buyPrice: Number(h.buyPrice || h.buy_price || 0),
    buyDate: h.buyDate || h.buy_date || new Date().toISOString().slice(0, 10),
    currentPrice: price,
    pnl: Number(h.pnl || 0),
    pnlPercent: Number(h.pnlPercent || h.pnl_percent || 0),
    history: generateSparkHistory(price).map((p, idx) => {
      const d = new Date();
      d.setDate(d.getDate() - (29 - idx));
      return { date: d.toISOString().slice(0, 10), price: p };
    })
  };
};

interface PortfolioState {
  holdings: Holding[];
  transactions: any[];
  activePortfolioId: number | null;
  fetchHoldings: () => Promise<void>;
  addHolding: (h: Omit<Holding, "id" | "history">) => Promise<void>;
  removeHolding: (id: string) => Promise<void>;
  updateHolding: (id: string, patch: Partial<Holding>) => Promise<void>;
}
export const usePortfolioStore = create<PortfolioState>()((set) => ({
  holdings: [],
  transactions: [],
  activePortfolioId: null,
  fetchHoldings: async () => {
    try {
      const portfoliosRes = await api.get("/portfolio/portfolios");
      const portfolios = portfoliosRes.data;
      if (!portfolios || portfolios.length === 0) return;
      const firstPortfolio = portfolios[0];
      const activeId = firstPortfolio.id;
      set({ activePortfolioId: activeId });

      const detailsRes = await api.get(`/portfolio/portfolios/${activeId}`);
      const holdings = (detailsRes.data.holdings || []).map(mapBackendHoldingToFrontend);
      const transactions = detailsRes.data.transactions || [];
      set({ holdings, transactions });
    } catch (e) {
      console.error("fetchHoldings error:", e);
    }
  },
  addHolding: async (h) => {
    const activeId = usePortfolioStore.getState().activePortfolioId;
    if (!activeId) return;
    const typeMapping: Record<string, string> = {
      "Stock": "stock",
      "Crypto": "crypto",
      "Mutual Fund": "mutual_fund"
    };
    const assetType = typeMapping[h.type] || "stock";
    await api.post(`/portfolio/portfolios/${activeId}/holdings`, {
      symbol: h.symbol,
      assetType,
      quantity: h.quantity,
      buyPrice: h.buyPrice,
      buyDate: h.buyDate
    });
    await usePortfolioStore.getState().fetchHoldings();
  },
  removeHolding: async (id) => {
    const activeId = usePortfolioStore.getState().activePortfolioId;
    if (!activeId) return;
    await api.delete(`/portfolio/portfolios/${activeId}/holdings/${id}`);
    await usePortfolioStore.getState().fetchHoldings();
  },
  updateHolding: async (id, patch) => {
    // Basic local state update or add API call if required
    set((s) => ({ holdings: s.holdings.map((h) => h.id === id ? { ...h, ...patch } : h) }));
  }
}));

interface ExpenseState {
  expenses: Expense[];
  isLoading: boolean;
  fetchExpenses: () => Promise<void>;
  addExpense: (e: Omit<Expense, "id">) => Promise<void>;
  removeExpense: (id: string) => Promise<void>;
}
export const useExpenseStore = create<ExpenseState>()((set) => ({
  expenses: [],
  isLoading: false,
  fetchExpenses: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get("/users/expenses");
      const expenses = (res.data || []).map((e: any) => ({
        ...e,
        date: e.date || e.expenseDate || e.expense_date
      }));
      set({ expenses, isLoading: false });
    } catch (e) {
      console.error(e);
      set({ isLoading: false });
    }
  },
  addExpense: async (e) => {
    await api.post("/users/expenses", {
      amount: e.amount,
      description: e.description,
      date: e.date,
      category: e.category,
      aiCategorize: true
    });
    await useExpenseStore.getState().fetchExpenses();
  },
  removeExpense: async (id) => {
    await api.delete(`/users/expenses/${id}`);
    await useExpenseStore.getState().fetchExpenses();
  }
}));

interface BudgetState {
  budgets: BudgetGoal[];
  isLoading: boolean;
  fetchBudgets: () => Promise<void>;
  updateBudget: (id: string, limit: number) => Promise<void>;
  addBudget: (b: Omit<BudgetGoal, "id" | "spent">) => Promise<void>;
}
export const useBudgetStore = create<BudgetState>()((set) => ({
  budgets: [],
  isLoading: false,
  fetchBudgets: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get("/users/budgets");
      set({ budgets: res.data || [], isLoading: false });
    } catch (e) {
      console.error(e);
      set({ isLoading: false });
    }
  },
  updateBudget: async (id, limit) => {
    await api.put(`/users/budgets/${id}`, { limit });
    await useBudgetStore.getState().fetchBudgets();
  },
  addBudget: async (b) => {
    await api.post("/users/budgets", {
      category: b.category,
      limit: b.limit,
      month: b.month,
      year: b.year
    });
    await useBudgetStore.getState().fetchBudgets();
  }
}));

interface AlertState {
  alerts: PriceAlert[];
  isLoading: boolean;
  fetchAlerts: () => Promise<void>;
  addAlert: (a: Omit<PriceAlert, "id" | "status" | "currentPrice">) => Promise<void>;
  removeAlert: (id: string) => Promise<void>;
}
export const useAlertStore = create<AlertState>()((set) => ({
  alerts: [],
  isLoading: false,
  fetchAlerts: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get("/users/alerts");
      set({ alerts: res.data || [], isLoading: false });
    } catch (e) {
      console.error(e);
      set({ isLoading: false });
    }
  },
  addAlert: async (a) => {
    await api.post("/users/alerts", {
      symbol: a.symbol,
      condition: a.condition,
      targetPrice: a.targetPrice
    });
    await useAlertStore.getState().fetchAlerts();
  },
  removeAlert: async (id) => {
    await api.delete(`/users/alerts/${id}`);
    await useAlertStore.getState().fetchAlerts();
  }
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
  id: number | null;
  name: string;
  email: string;
  income: number;
  prefs: { currency: "INR" | "USD"; defaultView: "table" | "grid" };
  notifications: { email: boolean; priceAlerts: boolean; weekly: boolean };
  setUser: (p: Partial<UserState>) => void;
  fetchUser: () => Promise<void>;
  saveUser: () => Promise<void>;
}
export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      id: null,
      name: "",
      email: "",
      income: 0,
      prefs: { currency: "INR", defaultView: "table" },
      notifications: { email: true, priceAlerts: true, weekly: false },
      setUser: (p) => set((s) => ({ ...s, ...p })),
      fetchUser: async () => {
        try {
          const res = await api.get("/users/me");
          set({
            id: res.data.id,
            name: res.data.name,
            email: res.data.email,
            income: res.data.monthlyIncome || res.data.monthly_income || 0,
            prefs: {
              currency: res.data.currency || "INR",
              defaultView: get().prefs.defaultView || "table"
            }
          });
        } catch (e) {
          console.error("fetchUser error:", e);
        }
      },
      saveUser: async () => {
        try {
          const state = get();
          await api.put("/users/me", {
            name: state.name,
            email: state.email,
            monthlyIncome: state.income,
            currency: state.prefs.currency
          });
        } catch (e) {
          console.error("saveUser error:", e);
        }
      }
    }),
    { name: "wealthos-user" }
  )
);

interface MarketState {
  marketData: MarketAsset[];
  isLoading: boolean;
  fetchMarketData: () => Promise<void>;
}
export const useMarketStore = create<MarketState>()((set) => ({
  marketData: [],
  isLoading: false,
  fetchMarketData: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get("/market/markets");
      const data = (res.data || []).map((item: any) => ({
        ...item,
        history: generateSparkHistory(item.price)
      }));
      set({ marketData: data, isLoading: false });
    } catch (e) {
      console.error(e);
      set({ isLoading: false });
    }
  }
}));
