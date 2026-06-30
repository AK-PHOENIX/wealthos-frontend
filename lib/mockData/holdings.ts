import type { Holding, Transaction } from "@/types";

function genHistory(end: number, days = 30, volatility = 0.03): { date: string; price: number }[] {
  const out: { date: string; price: number }[] = [];
  let p = end * (1 - (Math.random() * 0.2 - 0.05));
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    p = p * (1 + (Math.random() - 0.48) * volatility);
    out.push({ date: d.toISOString().slice(0, 10), price: +p.toFixed(2) });
  }
  out[out.length - 1].price = end;
  return out;
}

export const mockHoldings: Holding[] = [
  { id: "h1", symbol: "BTC", name: "Bitcoin", type: "Crypto", quantity: 0.15, buyPrice: 2450000, currentPrice: 3015000, buyDate: "2024-02-15", history: genHistory(3015000, 30, 0.035) },
  { id: "h2", symbol: "ETH", name: "Ethereum", type: "Crypto", quantity: 2.5, buyPrice: 185000, currentPrice: 218400, buyDate: "2024-04-10", history: genHistory(218400, 30, 0.04) },
  { id: "h3", symbol: "SOL", name: "Solana", type: "Crypto", quantity: 18, buyPrice: 12500, currentPrice: 14820, buyDate: "2024-05-22", history: genHistory(14820, 30, 0.05) },
  { id: "h4", symbol: "RELIANCE", name: "Reliance Industries", type: "Stock", quantity: 25, buyPrice: 2680, currentPrice: 2945, buyDate: "2023-11-08", history: genHistory(2945, 30, 0.015) },
  { id: "h5", symbol: "INFY", name: "Infosys", type: "Stock", quantity: 40, buyPrice: 1490, currentPrice: 1572, buyDate: "2024-01-20", history: genHistory(1572, 30, 0.018) },
  { id: "h6", symbol: "HDFCBANK", name: "HDFC Bank", type: "Stock", quantity: 30, buyPrice: 1610, currentPrice: 1684, buyDate: "2024-03-05", history: genHistory(1684, 30, 0.012) },
  { id: "h7", symbol: "TCS", name: "Tata Consultancy", type: "Stock", quantity: 12, buyPrice: 3850, currentPrice: 4120, buyDate: "2024-02-28", history: genHistory(4120, 30, 0.014) },
  { id: "h8", symbol: "MIRAE-LC", name: "Mirae Asset Large Cap", type: "Mutual Fund", quantity: 1250, buyPrice: 92.4, currentPrice: 104.8, buyDate: "2023-09-12", history: genHistory(104.8, 30, 0.008) },
];

export const mockTransactions: Transaction[] = [
  { id: "t1", symbol: "BTC", type: "Buy", quantity: 0.05, price: 3010000, date: "2025-06-20" },
  { id: "t2", symbol: "INFY", type: "Buy", quantity: 10, price: 1570, date: "2025-06-18" },
  { id: "t3", symbol: "SOL", type: "Sell", quantity: 5, price: 14900, date: "2025-06-15" },
  { id: "t4", symbol: "ETH", type: "Buy", quantity: 0.5, price: 217000, date: "2025-06-12" },
  { id: "t5", symbol: "RELIANCE", type: "Buy", quantity: 5, price: 2940, date: "2025-06-08" },
];
