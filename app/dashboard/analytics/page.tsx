"use client"

import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SpendingChart } from "@/components/dashboard/spending-chart"
import { useAnalyticsStore } from "@/lib/store/useAnalyticsStore"
import { useUserStore } from "@/lib/store/useUserStore"
import { formatCurrency } from "@/lib/utils/currency"
import { DollarSign, CreditCard, TrendingUp, TrendingDown } from "lucide-react"

export default function AnalyticsPage() {
  const { analytics, fetchAnalytics, isLoading } = useAnalyticsStore()
  const { currency } = useUserStore()

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No analytics data available</p>
      </div>
    )
  }

  const budgetUsagePercentage = (analytics.totalMonthlySpending / analytics.monthlyBudget) * 100

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-gray-600">Detailed insights into your subscription spending patterns.</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Spending</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analytics.totalMonthlySpending, currency)}</div>
            <p className="text-xs text-muted-foreground">{budgetUsagePercentage.toFixed(1)}% of budget used</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining Budget</CardTitle>
            {analytics.remainingBudget >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${analytics.remainingBudget >= 0 ? "text-green-600" : "text-red-600"}`}>
              {formatCurrency(Math.abs(analytics.remainingBudget), currency)}
            </div>
            <p className="text-xs text-muted-foreground">
              {analytics.remainingBudget >= 0 ? "Under budget" : "Over budget"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalSubscriptions}</div>
            <p className="text-xs text-muted-foreground">
              Avg {formatCurrency(analytics.totalMonthlySpending / analytics.totalSubscriptions || 0, currency)} per
              subscription
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analytics.monthlyBudget, currency)}</div>
            <p className="text-xs text-muted-foreground">Set in settings</p>
          </CardContent>
        </Card>
      </div>

      {/* Budget Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Used: {formatCurrency(analytics.totalMonthlySpending, currency)}</span>
              <span>Budget: {formatCurrency(analytics.monthlyBudget, currency)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  budgetUsagePercentage > 100
                    ? "bg-red-600"
                    : budgetUsagePercentage > 80
                      ? "bg-yellow-600"
                      : "bg-green-600"
                }`}
                style={{ width: `${Math.min(budgetUsagePercentage, 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">{budgetUsagePercentage.toFixed(1)}% of monthly budget used</p>
          </div>
        </CardContent>
      </Card>

      {/* Spending Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpendingChart data={analytics.categorySpending} />

        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.categorySpending.map((category, index) => (
                <div key={category.category} className="flex justify-between items-center">
                  <span className="font-medium">{category.category}</span>
                  <span className="text-sm text-muted-foreground">{formatCurrency(category.amount, currency)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
