"use client"

import { useEffect } from "react"
import { CalendarView } from "@/components/dashboard/calendar-view"
import { useSubscriptionStore } from "@/lib/store/useSubscriptionStore"
import { useAnalyticsStore } from "@/lib/store/useAnalyticsStore"

export default function CalendarPage() {
  const { subscriptions, fetchSubscriptions } = useSubscriptionStore()
  const { fetchAnalytics } = useAnalyticsStore()

  useEffect(() => {
    fetchSubscriptions()
  }, [fetchSubscriptions])

  const handleRefresh = () => {
    fetchSubscriptions()
    fetchAnalytics()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Calendar</h1>
        <p className="text-gray-600">View all your subscription renewals in calendar format.</p>
      </div>
      <CalendarView subscriptions={subscriptions} onRefresh={handleRefresh} />
    </div>
  )
}
