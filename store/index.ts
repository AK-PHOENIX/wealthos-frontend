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

const STALE_MS = 2 * 60 * 1000; // 2 minutes — data fresher than this won't be re-fetched
const isStale = (ts: number | null) => ts === null || Date.now() - ts > STALE_MS;

interface PortfolioState {
  holdings: Holding[];
  transactions: any[];
  activePortfolioId: number | null;
  lastFetchedAt: number | null;
  isFetching: boolean;
  fetchHoldings: (force?: boolean) => Promise<void>;
  addHolding: (h: Omit<Holding, "id" | "history">) => Promise<void>;
  removeHolding: (id: string) => Promise<void>;
  updateHolding: (id: string, patch: Partial<Holding>) => Promise<void>;
}
export const usePortfolioStore = create<PortfolioState>()((set, get) => ({
  holdings: [],
  transactions: [],
  activePortfolioId: null,
  lastFetchedAt: null,
  isFetching: false,
  fetchHoldings: async (force = false) => {
    const s = get();
    if (!force && (s.isFetching || !isStale(s.lastFetchedAt))) return;
    set({ isFetching: true });
    try {
      const portfoliosRes = await api.get("/portfolio/portfolios");
      const portfolios = portfoliosRes.data;
      if (!portfolios || portfolios.length === 0) { set({ isFetching: false, lastFetchedAt: Date.now() }); return; }
      const firstPortfolio = portfolios[0];
      const activeId = firstPortfolio.id;
      set({ activePortfolioId: activeId });

      const detailsRes = await api.get(`/portfolio/portfolios/${activeId}`);
      const holdings = (detailsRes.data.holdings || []).map(mapBackendHoldingToFrontend);
      const transactions = detailsRes.data.transactions || [];
      set({ holdings, transactions, lastFetchedAt: Date.now(), isFetching: false });
    } catch (e) {
      console.error("fetchHoldings error:", e);
      set({ isFetching: false });
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
    await usePortfolioStore.getState().fetchHoldings(true); // force refresh after mutation
  },
  removeHolding: async (id) => {
    const activeId = usePortfolioStore.getState().activePortfolioId;
    if (!activeId) return;
    await api.delete(`/portfolio/portfolios/${activeId}/holdings/${id}`);
    await usePortfolioStore.getState().fetchHoldings(true);
  },
  updateHolding: async (id, patch) => {
    set((s) => ({ holdings: s.holdings.map((h) => h.id === id ? { ...h, ...patch } : h) }));
  }
}));

interface ExpenseState {
  expenses: Expense[];
  isLoading: boolean;
  lastFetchedAt: number | null;
  isFetching: boolean;
  fetchExpenses: (force?: boolean) => Promise<void>;
  addExpense: (e: Omit<Expense, "id">) => Promise<void>;
  removeExpense: (id: string) => Promise<void>;
}
export const useExpenseStore = create<ExpenseState>()((set, get) => ({
  expenses: [],
  isLoading: false,
  lastFetchedAt: null,
  isFetching: false,
  fetchExpenses: async (force = false) => {
    const s = get();
    if (!force && (s.isFetching || !isStale(s.lastFetchedAt))) return;
    set({ isLoading: true, isFetching: true });
    try {
      const res = await api.get("/users/expenses");
      const expenses = (res.data || []).map((e: any) => ({
        ...e,
        date: e.date || e.expenseDate || e.expense_date
      }));
      set({ expenses, isLoading: false, lastFetchedAt: Date.now(), isFetching: false });
    } catch (e) {
      console.error(e);
      set({ isLoading: false, isFetching: false });
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
    await useExpenseStore.getState().fetchExpenses(true);
  },
  removeExpense: async (id) => {
    await api.delete(`/users/expenses/${id}`);
    await useExpenseStore.getState().fetchExpenses(true);
  }
}));

interface BudgetState {
  budgets: BudgetGoal[];
  isLoading: boolean;
  lastFetchedAt: number | null;
  isFetching: boolean;
  fetchBudgets: (force?: boolean) => Promise<void>;
  updateBudget: (id: string, limit: number) => Promise<void>;
  addBudget: (b: Omit<BudgetGoal, "id" | "spent">) => Promise<void>;
}
export const useBudgetStore = create<BudgetState>()((set, get) => ({
  budgets: [],
  isLoading: false,
  lastFetchedAt: null,
  isFetching: false,
  fetchBudgets: async (force = false) => {
    const s = get();
    if (!force && (s.isFetching || !isStale(s.lastFetchedAt))) return;
    set({ isLoading: true, isFetching: true });
    try {
      const res = await api.get("/users/budgets");
      set({ budgets: res.data || [], isLoading: false, lastFetchedAt: Date.now(), isFetching: false });
    } catch (e) {
      console.error(e);
      set({ isLoading: false, isFetching: false });
    }
  },
  updateBudget: async (id, limit) => {
    await api.put(`/users/budgets/${id}`, { limit });
    await useBudgetStore.getState().fetchBudgets(true);
  },
  addBudget: async (b) => {
    await api.post("/users/budgets", {
      category: b.category,
      limit: b.limit,
      month: b.month,
      year: b.year
    });
    await useBudgetStore.getState().fetchBudgets(true);
  }
}));

interface AlertState {
  alerts: PriceAlert[];
  isLoading: boolean;
  lastFetchedAt: number | null;
  isFetching: boolean;
  fetchAlerts: (force?: boolean) => Promise<void>;
  addAlert: (a: Omit<PriceAlert, "id" | "status" | "currentPrice">) => Promise<void>;
  removeAlert: (id: string) => Promise<void>;
}
export const useAlertStore = create<AlertState>()((set, get) => ({
  alerts: [],
  isLoading: false,
  lastFetchedAt: null,
  isFetching: false,
  fetchAlerts: async (force = false) => {
    const s = get();
    if (!force && (s.isFetching || !isStale(s.lastFetchedAt))) return;
    set({ isLoading: true, isFetching: true });
    try {
      const res = await api.get("/users/alerts");
      set({ alerts: res.data || [], isLoading: false, lastFetchedAt: Date.now(), isFetching: false });
    } catch (e) {
      console.error(e);
      set({ isLoading: false, isFetching: false });
    }
  },
  addAlert: async (a) => {
    await api.post("/users/alerts", {
      symbol: a.symbol,
      condition: a.condition,
      targetPrice: a.targetPrice
    });
    await useAlertStore.getState().fetchAlerts(true);
  },
  removeAlert: async (id) => {
    await api.delete(`/users/alerts/${id}`);
    await useAlertStore.getState().fetchAlerts(true);
  }
}));

type Theme = "light" | "dark" | "system";
interface ThemeState { theme: Theme; setTheme: (t: Theme) => void; }
export const useThemeStore = create<ThemeState>()(
  persist((set) => ({ theme: "dark", setTheme: (t) => set({ theme: t }) }), { name: "wealthos-theme" })
);

interface UIState { sidebarCollapsed: boolean; toggleSidebar: () => void; setSidebarCollapsed: (v: boolean) => void; mobileDrawerOpen: boolean; toggleMobileDrawer: () => void; setMobileDrawerOpen: (v: boolean) => void; }
export const useUIStore = create<UIState>()(
  persist((set) => ({
    sidebarCollapsed: false,
    toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
    setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
    mobileDrawerOpen: false,
    toggleMobileDrawer: () => set((s) => ({ mobileDrawerOpen: !s.mobileDrawerOpen })),
    setMobileDrawerOpen: (v) => set({ mobileDrawerOpen: v }),
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
  lastFetchedAt: number | null;
  isFetching: boolean;
  fetchUser: (force?: boolean) => Promise<void>;
  saveUser: () => Promise<void>;
  logout: () => void;
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
      lastFetchedAt: null,
      isFetching: false,
      setUser: (p) => set((s) => ({ ...s, ...p })),
      fetchUser: async (force = false) => {
        const s = get();
        // Use a longer stale time for user data (e.g., 5 mins) or just the standard 2 mins
        if (!force && (s.isFetching || !isStale(s.lastFetchedAt))) return;
        set({ isFetching: true });
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
            },
            lastFetchedAt: Date.now(),
            isFetching: false
          });
        } catch (e) {
          console.error("fetchUser error:", e);
          set({ isFetching: false });
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
      },
      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("wealthos_token");
        }
        set({
          id: null,
          name: "",
          email: "",
          income: 0,
          prefs: { currency: "INR", defaultView: "table" },
          notifications: { email: true, priceAlerts: true, weekly: false },
        });
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
    }),
    { name: "wealthos-user" }
  )
);

interface MarketState {
  marketData: MarketAsset[];
  isLoading: boolean;
  lastFetchedAt: number | null;
  isFetching: boolean;
  fetchMarketData: (force?: boolean) => Promise<void>;
}
export const useMarketStore = create<MarketState>()((set, get) => ({
  marketData: [],
  isLoading: false,
  lastFetchedAt: null,
  isFetching: false,
  fetchMarketData: async (force = false) => {
    const s = get();
    // Markets use a 5-minute stale window (prices cached on backend anyway)
    const MARKET_STALE_MS = 5 * 60 * 1000;
    const marketStale = s.lastFetchedAt === null || Date.now() - s.lastFetchedAt > MARKET_STALE_MS;
    if (!force && (s.isFetching || !marketStale)) return;
    set({ isLoading: true, isFetching: true });
    try {
      const res = await api.get("/market/markets");
      const data = (res.data || []).map((item: any) => ({
        ...item,
        history: generateSparkHistory(item.price)
      }));
      set({ marketData: data, isLoading: false, lastFetchedAt: Date.now(), isFetching: false });
    } catch (e) {
      console.error(e);
      set({ isLoading: false, isFetching: false });
    }
  }
}));

interface DashboardState {
  isFetching: boolean;
  fetchDashboardData: (force?: boolean) => Promise<void>;
}
export const useDashboardStore = create<DashboardState>()((set, get) => ({
  isFetching: false,
  fetchDashboardData: async (force = false) => {
    const s = get();
    const pState = usePortfolioStore.getState();
    const bState = useBudgetStore.getState();
    
    // Check if either holdings or budgets need fetching
    if (!force && (s.isFetching || (!isStale(pState.lastFetchedAt) && !isStale(bState.lastFetchedAt)))) return;
    
    set({ isFetching: true });
    try {
      const res = await api.get("/admin/dashboard");
      
      // Hydrate the existing stores with the consolidated data
      const holdings = (res.data.holdings || []).map(mapBackendHoldingToFrontend);
      
      usePortfolioStore.setState({
        holdings: holdings,
        transactions: res.data.transactions,
        lastFetchedAt: Date.now(),
        isFetching: false
      });
      
      useBudgetStore.setState({
        budgets: res.data.budgets,
        lastFetchedAt: Date.now(),
        isFetching: false
      });
      
      set({ isFetching: false });
    } catch (e) {
      console.error("fetchDashboardData error:", e);
      set({ isFetching: false });
    }
  }
}));

// Live price updater — call this from portfolio page with Binance tickers
export function applyLivePrices(
  holdings: any[],
  tickers: Record<string, any>,
  usdInr: number
) {
  return holdings.map(h => {
    if (h.type === 'Crypto' && tickers[h.symbol]) {
      const livePrice = tickers[h.symbol].price * usdInr;
      const pnl = (livePrice - h.buyPrice) * h.quantity;
      const pnlPercent = h.buyPrice > 0 ? ((livePrice - h.buyPrice) / h.buyPrice) * 100 : 0;
      
      // Update history's latest data point to reflect live price
      const updatedHistory = [...h.history];
      if (updatedHistory.length > 0) {
        updatedHistory[updatedHistory.length - 1] = {
          ...updatedHistory[updatedHistory.length - 1],
          price: livePrice
        };
      }
      
      return { ...h, currentPrice: livePrice, pnl, pnlPercent, history: updatedHistory };
    }
    return h;
  });
}
