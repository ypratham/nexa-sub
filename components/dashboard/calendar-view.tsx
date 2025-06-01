"use client";

import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isToday,
} from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { AddSubscriptionDialog } from "./add-subscription-dialog";
import type { Subscription } from "@/lib/store/useSubscriptionStore";
import { useUserStore } from "@/lib/store/useUserStore";
import { formatCurrency } from "@/lib/utils/currency";

interface CalendarViewProps {
  subscriptions: Subscription[];
  onRefresh: () => void;
}

export function CalendarView({ subscriptions, onRefresh }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const { currency } = useUserStore();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getSubscriptionsForDay = (day: Date) => {
    return subscriptions.filter((sub) => {
      const renewalDate = new Date(sub.renewalDate);

      // For one-time subscriptions, just check the exact date
      if (sub.duration === "one-time") {
        return isSameDay(renewalDate, day);
      }

      // For recurring subscriptions
      const monthsDiff =
        (day.getFullYear() - renewalDate.getFullYear()) * 12 +
        (day.getMonth() - renewalDate.getMonth());

      const cycleMonths =
        sub.duration === "monthly"
          ? 1
          : sub.duration === "quarterly"
          ? 3
          : sub.duration === "yearly"
          ? 12
          : sub.customCycle || 1;

      // Check if the day matches the renewal pattern
      return (
        monthsDiff >= 0 &&
        monthsDiff % cycleMonths === 0 &&
        day.getDate() === renewalDate.getDate()
      );
    });
  };

  const previousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const handleAddSubscription = (date: string) => {
    setSelectedDate(date);
    setDialogOpen(true);
  };

  const getDurationText = (subscription: Subscription) => {
    if (subscription.duration === "custom" && subscription.customCycle) {
      return `Every ${subscription.customCycle} month${
        subscription.customCycle > 1 ? "s" : ""
      }`;
    }
    return (
      subscription.duration.charAt(0).toUpperCase() +
      subscription.duration.slice(1)
    );
  };

  const getRenewalDatesInMonth = (sub: Subscription, targetDate: Date) => {
    const renewalDate = new Date(sub.renewalDate);
    const monthStart = startOfMonth(targetDate);
    const monthEnd = endOfMonth(targetDate);
    const dates: Date[] = [];

    // For one-time subscriptions
    if (sub.duration === "one-time") {
      if (renewalDate >= monthStart && renewalDate <= monthEnd) {
        dates.push(renewalDate);
      }
      return dates;
    }

    // For recurring subscriptions
    const cycleMonths =
      sub.duration === "monthly"
        ? 1
        : sub.duration === "quarterly"
        ? 3
        : sub.duration === "yearly"
        ? 12
        : sub.customCycle || 1;

    let currentDate = new Date(renewalDate);
    while (currentDate <= monthEnd) {
      if (currentDate >= monthStart && currentDate <= monthEnd) {
        dates.push(new Date(currentDate));
      }
      currentDate.setMonth(currentDate.getMonth() + cycleMonths);
    }

    return dates;
  };

  const remainingAmount = subscriptions.reduce((acc, sub) => {
    const now = new Date();
    const renewalDates = getRenewalDatesInMonth(sub, currentDate);

    return (
      acc +
      renewalDates.reduce((dateAcc, renewalDate) => {
        // Only include if date is in future for current month, or any date for other months
        if (
          currentDate.getMonth() !== now.getMonth() ||
          currentDate.getFullYear() !== now.getFullYear() ||
          renewalDate.getDate() > now.getDate()
        ) {
          return dateAcc + sub.cost;
        }
        return dateAcc;
      }, 0)
    );
  }, 0);

  // Update the display text based on whether we're viewing current month or future/past months
  const remainingText =
    currentDate.getMonth() === new Date().getMonth() &&
    currentDate.getFullYear() === new Date().getFullYear()
      ? "Remaining This Month"
      : "Total for Month";

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <CardTitle>Subscription Calendar</CardTitle>
              {remainingAmount > 0 && (
                <div className="opacity-80">
                  <p className="text-xl font-bold">
                    {formatCurrency(remainingAmount, currency)}
                  </p>
                  <p className="text-sm text-gray-500">Remaining This Month</p>
                </div>
              )}
            </div>

            <AddSubscriptionDialog
              onAdd={onRefresh}
              prefilledDate={selectedDate}
              open={dialogOpen}
              onOpenChange={setDialogOpen}
            />
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={previousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="font-medium">
                {format(currentDate, "MMMM yyyy")}
              </span>
              <Button variant="outline" size="sm" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2 mb-4">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center font-medium text-sm text-gray-500 p-2"
              >
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {days.map((day) => {
              const daySubscriptions = getSubscriptionsForDay(day);
              const isCurrentDay = isToday(day);
              const dateString = format(day, "yyyy-MM-dd");

              return (
                <ContextMenu key={day.toISOString()}>
                  <ContextMenuTrigger>
                    <div
                      className={`min-h-[80px] p-2 border rounded-lg cursor-pointer hover:bg-gray-100 ${
                        isCurrentDay
                          ? "bg-blue-50 border-blue-200"
                          : "bg-gray-50"
                      }`}
                    >
                      <div
                        className={`text-sm font-medium ${
                          isCurrentDay ? "text-blue-600" : ""
                        }`}
                      >
                        {format(day, "d")}
                      </div>
                      {daySubscriptions.map((sub) => (
                        <div
                          key={sub._id}
                          className="text-xs bg-blue-100 text-blue-800 rounded px-1 py-0.5 mt-1 truncate"
                          title={`${sub.serviceName} - ${formatCurrency(
                            sub.cost,
                            currency
                          )} - ${getDurationText(sub)}`}
                        >
                          {sub.serviceName}
                        </div>
                      ))}
                    </div>
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuItem
                      onClick={() => handleAddSubscription(dateString)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Subscription
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
