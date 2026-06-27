import type { PriceAlert } from "@/types";
export const mockAlerts: PriceAlert[] = [
  { id: "a1", symbol: "BTC", condition: "above", targetPrice: 3200000, currentPrice: 3015000, status: "Active" },
  { id: "a2", symbol: "ETH", condition: "below", targetPrice: 200000, currentPrice: 218400, status: "Active" },
  { id: "a3", symbol: "RELIANCE", condition: "above", targetPrice: 3000, currentPrice: 2945, status: "Active" },
  { id: "a4", symbol: "SOL", condition: "above", targetPrice: 14000, currentPrice: 14820, status: "Triggered" },
];
