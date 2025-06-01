import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import Subscription from "@/lib/models/Subscription"
import User from "@/lib/models/User"
import { startOfMonth, endOfMonth } from "date-fns"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const user = await User.findById(session.user.id)
    const subscriptions = await Subscription.find({
      userId: session.user.id,
      isActive: true,
    })

    const currentDate = new Date()
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)

    // Calculate monthly spending
    let monthlySpending = 0
    subscriptions.forEach((sub) => {
      if (sub.duration === "monthly") {
        monthlySpending += sub.cost
      } else if (sub.duration === "quarterly") {
        monthlySpending += sub.cost / 3
      } else if (sub.duration === "annually") {
        monthlySpending += sub.cost / 12
      }
    })

    // Calculate spending by category
    const categorySpending = subscriptions.reduce(
      (acc, sub) => {
        const monthlyCost =
          sub.duration === "monthly" ? sub.cost : sub.duration === "quarterly" ? sub.cost / 3 : sub.cost / 12

        acc[sub.category] = (acc[sub.category] || 0) + monthlyCost
        return acc
      },
      {} as Record<string, number>,
    )

    const analytics = {
      totalMonthlySpending: monthlySpending,
      remainingBudget: user.monthlyBudget - monthlySpending,
      monthlyBudget: user.monthlyBudget,
      categorySpending: Object.entries(categorySpending).map(([category, amount]) => ({
        category,
        amount: Math.round(amount * 100) / 100,
      })),
      totalSubscriptions: subscriptions.length,
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
