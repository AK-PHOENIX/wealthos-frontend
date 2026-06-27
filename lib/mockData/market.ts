import type { MarketAsset } from "@/types";

function spark(seed: number): number[] {
  const arr: number[] = [];
  let v = seed;
  for (let i = 0; i < 24; i++) {
    v = v * (1 + (Math.random() - 0.5) * 0.04);
    arr.push(+v.toFixed(2));
  }
  return arr;
}

export const mockMarket: MarketAsset[] = [
  { symbol: "BTC", name: "Bitcoin", type: "Crypto", price: 3015000, change24h: 2.34, history: spark(3015000) },
  { symbol: "ETH", name: "Ethereum", type: "Crypto", price: 218400, change24h: 1.85, history: spark(218400) },
  { symbol: "SOL", name: "Solana", type: "Crypto", price: 14820, change24h: -2.1, history: spark(14820) },
  { symbol: "BNB", name: "BNB", type: "Crypto", price: 52400, change24h: 0.72, history: spark(52400) },
  { symbol: "XRP", name: "XRP", type: "Crypto", price: 48.5, change24h: -1.2, history: spark(48.5) },
  { symbol: "ADA", name: "Cardano", type: "Crypto", price: 38.4, change24h: 3.4, history: spark(38.4) },
  { symbol: "DOGE", name: "Dogecoin", type: "Crypto", price: 12.5, change24h: -0.8, history: spark(12.5) },
  { symbol: "DOT", name: "Polkadot", type: "Crypto", price: 620, change24h: 1.1, history: spark(620) },
  { symbol: "AVAX", name: "Avalanche", type: "Crypto", price: 2840, change24h: 4.5, history: spark(2840) },
  { symbol: "MATIC", name: "Polygon", type: "Crypto", price: 68.2, change24h: -1.6, history: spark(68.2) },
  { symbol: "LINK", name: "Chainlink", type: "Crypto", price: 1240, change24h: 2.9, history: spark(1240) },
  { symbol: "LTC", name: "Litecoin", type: "Crypto", price: 7820, change24h: 0.4, history: spark(7820) },
  { symbol: "RELIANCE", name: "Reliance Industries", type: "Stock", price: 2945, change24h: 1.15, history: spark(2945) },
  { symbol: "INFY", name: "Infosys", type: "Stock", price: 1572, change24h: -0.35, history: spark(1572) },
  { symbol: "HDFCBANK", name: "HDFC Bank", type: "Stock", price: 1684, change24h: 0.84, history: spark(1684) },
  { symbol: "TCS", name: "Tata Consultancy", type: "Stock", price: 4120, change24h: 1.42, history: spark(4120) },
  { symbol: "ICICIBANK", name: "ICICI Bank", type: "Stock", price: 1248, change24h: -0.6, history: spark(1248) },
  { symbol: "SBIN", name: "State Bank of India", type: "Stock", price: 824, change24h: 2.1, history: spark(824) },
  { symbol: "WIPRO", name: "Wipro", type: "Stock", price: 542, change24h: -1.4, history: spark(542) },
  { symbol: "BHARTIARTL", name: "Bharti Airtel", type: "Stock", price: 1485, change24h: 0.92, history: spark(1485) },
];
