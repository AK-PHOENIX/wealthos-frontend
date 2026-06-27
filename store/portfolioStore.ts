import { create } from 'zustand'
import type { Portfolio, Holding } from '@/types'

interface PortfolioState {
    portfolios: Portfolio[]
    activePortfolio: Portfolio | null
    holdings: Holding[]
    isLoading: boolean
    setPortfolios: (portfolios: Portfolio[]) => void
    setActivePortfolio: (portfolio: Portfolio) => void
    setHoldings: (holdings: Holding[]) => void
    setLoading: (loading: boolean) => void
    addHolding: (holding: Holding) => void
    removeHolding: (id: number) => void
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
    portfolios: [],
    activePortfolio: null,
    holdings: [],
    isLoading: false,

    setPortfolios: (portfolios) => set({ portfolios }),
    setActivePortfolio: (portfolio) => set({ activePortfolio: portfolio }),
    setHoldings: (holdings) => set({ holdings }),
    setLoading: (loading) => set({ isLoading: loading }),
    addHolding: (holding) =>
        set((state) => ({ holdings: [...state.holdings, holding] })),
    removeHolding: (id) =>
        set((state) => ({ holdings: state.holdings.filter((h) => h.id !== id) })),
}))