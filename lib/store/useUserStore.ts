import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Session } from "next-auth"

interface UserState {
  user: Session["user"] | null
  currency: string
  isLoading: boolean
  error: string | null
  setUser: (user: Session["user"] | null) => void
  setCurrency: (currency: string) => Promise<boolean>
  fetchUserSettings: () => Promise<void>
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      currency: "USD",
      isLoading: false,
      error: null,

      setUser: (user) => {
        set({ user })
      },

      setCurrency: async (currency: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await fetch("/api/user/settings", {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ currency }),
          })

          if (!response.ok) {
            throw new Error("Failed to update currency")
          }

          set({ currency, isLoading: false })
          return true
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false })
          return false
        }
      },

      fetchUserSettings: async () => {
        set({ isLoading: true, error: null })
        try {
          const response = await fetch("/api/user/settings")
          if (!response.ok) {
            throw new Error("Failed to fetch user settings")
          }
          const data = await response.json()
          set({ currency: data.currency || "USD", isLoading: false })
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false })
        }
      },
    }),
    {
      name: "user-settings",
      partialize: (state) => ({ currency: state.currency }),
    },
  ),
)
