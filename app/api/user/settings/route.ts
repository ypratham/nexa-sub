import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import User from "@/lib/models/User"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const user = await User.findById(session.user.id)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      currency: user.currency,
      monthlyBudget: user.monthlyBudget,
    })
  } catch (error) {
    console.error("Error fetching user settings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { currency, monthlyBudget } = await request.json()

    await dbConnect()

    const updateData: any = {}
    if (currency) updateData.currency = currency
    if (monthlyBudget !== undefined) updateData.monthlyBudget = monthlyBudget

    const user = await User.findByIdAndUpdate(session.user.id, updateData, { new: true })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      currency: user.currency,
      monthlyBudget: user.monthlyBudget,
    })
  } catch (error) {
    console.error("Error updating user settings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
