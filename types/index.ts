export interface User {
  id: number
  name: string
  email: string
  income?: number
  monthlyIncome?: number
  monthly_income?: number
  currency: 'INR' | 'USD'
}

export interface Portfolio {
  id: number
  userId?: number
  user_id?: number
  name: string
  createdAt?: string
  created_at?: string
}

export interface Holding {
  id: any
  portfolioId?: number
  portfolio_id?: number
  symbol: string
  name?: string
  assetType?: 'crypto' | 'stock' | 'mutual_fund'
  asset_type?: 'crypto' | 'stock' | 'mutual_fund'
  type: string
  quantity: number
  buyPrice: number
  buy_price?: number
  buyDate: string
  buy_date?: string
  currentPrice: number
  current_price?: number
  pnl?: number
  pnl_percent?: number
  pnlPercent?: number
  history: { date: string; price: number }[]
}

export interface Transaction {
  id: any
  holdingId?: number
  holding_id?: number
  symbol: string
  type: 'Buy' | 'Sell'
  transactionType?: 'buy' | 'sell'
  transaction_type?: 'buy' | 'sell'
  quantity: number
  price: number
  date: string
  transactionDate?: string
  transaction_date?: string
}

export interface BudgetGoal {
  id: any
  userId?: number
  user_id?: number
  category: string
  icon?: string
  limit: number
  monthlyLimit?: number
  monthly_limit?: number
  month?: number
  year?: number
  spent: number
}

export interface Expense {
  id: any
  userId?: number
  user_id?: number
  amount: number
  category: string
  description: string
  date: string
  expenseDate?: string
  expense_date?: string
  aiCategorized?: boolean
  ai_categorized?: boolean
}

export interface PriceCache {
  symbol: string
  price: number
  assetType?: 'crypto' | 'stock' | 'mutual_fund'
  asset_type?: 'crypto' | 'stock' | 'mutual_fund'
  updatedAt?: string
  updated_at?: string
}

export interface Alert {
  id: any
  userId?: number
  user_id?: number
  symbol: string
  condition: 'Above' | 'Below' | 'above' | 'below'
  targetPrice: number
  target_price?: number
  triggered?: boolean
  status?: string
  currentPrice?: number
  notifiedAt?: string | null
  notified_at?: string | null
}

export type PriceAlert = Alert;

export interface MarketData {
  symbol: string
  name: string
  price: number
  change24h: number
  change_24h?: number
  assetType?: 'crypto' | 'stock'
  asset_type?: 'crypto' | 'stock'
}

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface AuthResponse {
  token: string
  user: User
}

export type AssetType = 'Crypto' | 'Stock' | 'Mutual Fund'

export interface MarketAsset {
  symbol: string
  name: string
  type: string
  price: number
  change24h: number
  history?: number[]
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
}