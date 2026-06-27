import { usePortfolioStore } from "@/store";

export function usePortfolioStats() {
  const holdings = usePortfolioStore((s) => s.holdings);
  const totalValue = holdings.reduce((a, h) => a + h.quantity * h.currentPrice, 0);
  const totalCost = holdings.reduce((a, h) => a + h.quantity * h.buyPrice, 0);
  const totalPL = totalValue - totalCost;
  const totalPLPct = totalCost ? (totalPL / totalCost) * 100 : 0;
  // today's change from history
  const todayChange = holdings.reduce((a, h) => {
    const hist = h.history;
    if (hist.length < 2) return a;
    const yest = hist[hist.length - 2].price;
    return a + (h.currentPrice - yest) * h.quantity;
  }, 0);
  const todayPct = totalValue ? (todayChange / (totalValue - todayChange)) * 100 : 0;
  const byType = holdings.reduce((acc, h) => {
    const v = h.quantity * h.currentPrice;
    acc[h.type] = (acc[h.type] ?? 0) + v;
    return acc;
  }, {} as Record<string, number>);
  return { holdings, totalValue, totalCost, totalPL, totalPLPct, todayChange, todayPct, byType, count: holdings.length };
}
