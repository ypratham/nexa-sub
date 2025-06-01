"use client"

import Image from "next/image"
import { format } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useUserStore } from "@/lib/store/useUserStore"
import { formatCurrency } from "@/lib/utils/currency"

interface Subscription {
  _id: string
  serviceName: string
  cost: number
  renewalDate: string
  duration: string
  customCycle?: number
  logoUrl: string
  category: string
}

interface SubscriptionCardProps {
  subscription: Subscription
  onDelete: (id: string) => void
}

export function SubscriptionCard({ subscription, onDelete }: SubscriptionCardProps) {
  const { currency } = useUserStore()

  const getDurationText = () => {
    if (subscription.duration === "custom" && subscription.customCycle) {
      return `Every ${subscription.customCycle} month${subscription.customCycle > 1 ? "s" : ""}`
    }
    return subscription.duration.charAt(0).toUpperCase() + subscription.duration.slice(1)
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 relative">
              {subscription.logoUrl ? (
                <Image
                  src={subscription.logoUrl || "/placeholder.svg"}
                  alt={subscription.serviceName}
                  fill
                  className="rounded-lg object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = "/placeholder.svg?height=40&width=40"
                  }}
                />
              ) : (
                <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-xs font-medium">{subscription.serviceName.charAt(0).toUpperCase()}</span>
                </div>
              )}
            </div>
            <div>
              <h3 className="font-medium">{subscription.serviceName}</h3>
              <p className="text-sm text-gray-500">{subscription.category}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold">{formatCurrency(subscription.cost, currency)}</p>
            <p className="text-sm text-gray-500">{format(new Date(subscription.renewalDate), "MMM dd, yyyy")}</p>
            <p className="text-xs text-gray-400">{getDurationText()}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(subscription._id)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
