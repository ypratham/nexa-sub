"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubscriptionCard } from "@/components/dashboard/subscription-card";
import { AddSubscriptionDialog } from "@/components/dashboard/add-subscription-dialog";
import { useSubscriptionStore } from "@/lib/store/useSubscriptionStore";
import { useAnalyticsStore } from "@/lib/store/useAnalyticsStore";
import { Search, Filter } from "lucide-react";

export default function SubscriptionsPage() {
  const { subscriptions, fetchSubscriptions, deleteSubscription } =
    useSubscriptionStore();
  const { fetchAnalytics } = useAnalyticsStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  const handleDeleteSubscription = async (id: string) => {
    const success = await deleteSubscription(id);
    if (success) {
      fetchAnalytics();
    }
  };

  const handleAddSubscription = () => {
    fetchSubscriptions();
    fetchAnalytics();
  };

  // Filter and sort subscriptions
  const filteredSubscriptions = subscriptions
    .filter((sub) => {
      const matchesSearch = sub.serviceName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || sub.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.serviceName.localeCompare(b.serviceName);
        case "cost":
          return b.cost - a.cost;
        case "date":
          return (
            new Date(a.renewalDate).getTime() -
            new Date(b.renewalDate).getTime()
          );
        default:
          return 0;
      }
    });

  const categories = Array.from(
    new Set(subscriptions.map((sub) => sub.category))
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Subscriptions</h1>
          <p className="text-gray-600">Manage all your active subscriptions.</p>
        </div>
        <AddSubscriptionDialog onAdd={handleAddSubscription} />
      </div>

      {/* Summary */}
      {filteredSubscriptions.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">
                  {filteredSubscriptions.length}
                </p>
                <p className="text-sm text-gray-500">Active Subscriptions</p>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  $
                  {filteredSubscriptions
                    .reduce((sum, sub) => sum + sub.cost, 0)
                    .toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">Total Monthly Cost</p>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  $
                  {(
                    filteredSubscriptions.reduce(
                      (sum, sub) => sum + sub.cost,
                      0
                    ) / filteredSubscriptions.length
                  ).toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">Average Cost</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search subscriptions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="cost">Cost</SelectItem>
                  <SelectItem value="date">Renewal Date</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscriptions List */}
      <div className="space-y-4">
        {filteredSubscriptions.map((subscription) => (
          <SubscriptionCard
            key={subscription._id}
            subscription={subscription}
            onDelete={handleDeleteSubscription}
          />
        ))}
        {filteredSubscriptions.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">
                {searchTerm || categoryFilter !== "all"
                  ? "No subscriptions match your filters"
                  : "No subscriptions yet. Add your first subscription!"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
