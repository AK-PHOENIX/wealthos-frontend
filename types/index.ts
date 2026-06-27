export interface User {
  id: number
  name: string
  email: string
  monthly_income: number
  currency: 'INR' | 'USD'
}

export interface Portfolio {
  id: number
  user_id: number
  name: string
  created_at: string
}

export interface Holding {
  id: number
  portfolio_id: number
  symbol: string
  asset_type: 'crypto' | 'stock' | 'mutual_fund'
  quantity: number
  buy_price: number
  buy_date: string
  current_price?: number
  pnl?: number
  pnl_percent?: number
}

export interface Transaction {
  id: number
  holding_id: number
  transaction_type: 'buy' | 'sell'
  quantity: number
  price: number
  transaction_date: string
}

export interface BudgetGoal {
  id: number
  user_id: number
  category: string
  monthly_limit: number
  month: number
  year: number
  spent?: number
}

export interface Expense {
  id: number
  user_id: number
  amount: number
  category: string
  description: string
  expense_date: string
  ai_categorized: boolean
}

export interface PriceCache {
  symbol: string
  price: number
  asset_type: 'crypto' | 'stock' | 'mutual_fund'
  updated_at: string
}

export interface Alert {
  id: number
  user_id: number
  symbol: string
  condition: 'above' | 'below'
  target_price: number
  triggered: boolean
  notified_at: string | null
}

export interface MarketData {
  symbol: string
  name: string
  price: number
  change_24h: number
  asset_type: 'crypto' | 'stock'
}

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface AuthResponse {
  token: string
  user: User
}