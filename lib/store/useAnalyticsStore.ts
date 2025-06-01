import { create } from "zustand"

export interface CategorySpending {
  category: string
  amount: number
}

export interface Analytics {
  totalMonthlySpending: number
  remainingBudget: number
  monthlyBudget: number
  categorySpending: CategorySpending[]
  totalSubscriptions: number
}

interface AnalyticsState {
  analytics: Analytics | null
  isLoading: boolean
  error: string | null
  fetchAnalytics: () => Promise<void>
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  analytics: null,
  isLoading: false,
  error: null,

  fetchAnalytics: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch("/api/analytics")
      if (!response.ok) {
        throw new Error("Failed to fetch analytics")
      }
      const data = await response.json()
      set({ analytics: data, isLoading: false })
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
    }
  },
}))
