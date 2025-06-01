import { create } from "zustand"

export interface Subscription {
  _id: string
  serviceName: string
  cost: number
  renewalDate: string
  duration: string
  customCycle?: number
  logoUrl: string
  category: string
  isActive: boolean
}

interface SubscriptionState {
  subscriptions: Subscription[]
  isLoading: boolean
  error: string | null
  fetchSubscriptions: () => Promise<void>
  addSubscription: (subscription: Omit<Subscription, "_id" | "isActive">) => Promise<boolean>
  deleteSubscription: (id: string) => Promise<boolean>
}

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  subscriptions: [],
  isLoading: false,
  error: null,

  fetchSubscriptions: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch("/api/subscriptions")
      if (!response.ok) {
        throw new Error("Failed to fetch subscriptions")
      }
      const data = await response.json()
      set({ subscriptions: data, isLoading: false })
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
    }
  },

  addSubscription: async (subscription) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch("/api/subscriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subscription),
      })

      if (!response.ok) {
        throw new Error("Failed to add subscription")
      }

      const newSubscription = await response.json()
      set((state) => ({
        subscriptions: [...state.subscriptions, newSubscription],
        isLoading: false,
      }))
      return true
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
      return false
    }
  },

  deleteSubscription: async (id) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`/api/subscriptions/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete subscription")
      }

      set((state) => ({
        subscriptions: state.subscriptions.filter((sub) => sub._id !== id),
        isLoading: false,
      }))
      return true
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
      return false
    }
  },
}))
