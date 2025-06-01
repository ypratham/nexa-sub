"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SubscriptionCard } from "@/components/dashboard/subscription-card";
import { AddSubscriptionDialog } from "@/components/dashboard/add-subscription-dialog";
import { SpendingChart } from "@/components/dashboard/spending-chart";
import { CalendarView } from "@/components/dashboard/calendar-view";
import { DollarSign, CreditCard, TrendingUp } from "lucide-react";
import { useSubscriptionStore } from "@/lib/store/useSubscriptionStore";
import { useAnalyticsStore } from "@/lib/store/useAnalyticsStore";
import { useUserStore } from "@/lib/store/useUserStore";
import { formatCurrency } from "@/lib/utils/currency";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Zustand stores
  const {
    subscriptions,
    isLoading: subsLoading,
    fetchSubscriptions,
    deleteSubscription,
  } = useSubscriptionStore();
  const {
    analytics,
    isLoading: analyticsLoading,
    fetchAnalytics,
  } = useAnalyticsStore();
  const { setUser, currency, fetchUserSettings } = useUserStore();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }

    if (session?.user) {
      setUser(session.user);
    }
  }, [status, router, session, setUser]);

  useEffect(() => {
    if (session) {
      fetchSubscriptions();
      fetchAnalytics();
      fetchUserSettings();
    }
  }, [session, fetchSubscriptions, fetchAnalytics, fetchUserSettings]);

  const handleDeleteSubscription = async (id: string) => {
    const success = await deleteSubscription(id);
    if (success) {
      fetchAnalytics(); // Refresh analytics after deletion
    }
  };

  const handleAddSubscription = () => {
    fetchSubscriptions();
    fetchAnalytics();
  };

  if (status === "loading" || subsLoading || analyticsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold">
          Welcome back, {session.user?.name}!
        </h1>
        <p className="text-gray-600">
          Here's an overview of your subscriptions and spending.
        </p>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Monthly Spending
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(analytics.totalMonthlySpending, currency)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Remaining Budget
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(analytics.remainingBudget, currency)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Subscriptions
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics.totalSubscriptions}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Monthly Budget
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(analytics.monthlyBudget, currency)}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Subscriptions */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Recent Subscriptions</h2>
            <AddSubscriptionDialog onAdd={handleAddSubscription} />
          </div>
          <div className="space-y-4">
            {subscriptions.slice(0, 3).map((subscription) => (
              <SubscriptionCard
                key={subscription._id}
                subscription={subscription}
                onDelete={handleDeleteSubscription}
              />
            ))}
            {subscriptions.length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-500">
                    No subscriptions yet. Add your first subscription!
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Spending Chart */}
        <div>
          {analytics && analytics.categorySpending.length > 0 && (
            <SpendingChart data={analytics.categorySpending} />
          )}
        </div>
      </div>

      {/* Calendar View */}
      <div>
        <h2 className="text-xl font-semibold mb-6">Upcoming Renewals</h2>
        <CalendarView
          subscriptions={subscriptions}
          onRefresh={handleAddSubscription}
        />
      </div>
    </div>
  );
}
