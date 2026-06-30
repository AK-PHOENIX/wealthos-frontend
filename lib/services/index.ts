import { usePortfolioStore, useExpenseStore, useBudgetStore, useAlertStore, useMarketStore } from "@/store";

export const portfolioService = {
  list: () => usePortfolioStore.getState().holdings,
  add: usePortfolioStore.getState().addHolding,
  remove: usePortfolioStore.getState().removeHolding,
  transactions: () => usePortfolioStore.getState().transactions,
};
export const expenseService = {
  list: () => useExpenseStore.getState().expenses,
  add: useExpenseStore.getState().addExpense,
  remove: useExpenseStore.getState().removeExpense,
};
export const budgetService = {
  list: () => useBudgetStore.getState().budgets,
  update: useBudgetStore.getState().updateBudget,
};
export const alertService = {
  list: () => useAlertStore.getState().alerts,
  add: useAlertStore.getState().addAlert,
  remove: useAlertStore.getState().removeAlert,
};
export const marketService = {
  list: () => useMarketStore.getState().marketData,
  bySymbol: (s: string) => useMarketStore.getState().marketData.find((m) => m.symbol === s),
};
