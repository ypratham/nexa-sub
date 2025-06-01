import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import Subscription from "@/lib/models/Subscription"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const subscriptions = await Subscription.find({
      userId: session.user.id,
      isActive: true,
    }).sort({ renewalDate: 1 })

    return NextResponse.json(subscriptions)
  } catch (error) {
    console.error("Error fetching subscriptions:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { serviceName, cost, renewalDate, duration, customCycle, category } = await request.json()

    if (!serviceName || !cost || !renewalDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    await dbConnect()

    // Fetch logo from Clearbit API
    let logoUrl = ""
    try {
      const logoResponse = await fetch(`https://logo.clearbit.com/${serviceName.toLowerCase().replace(/\s+/g, "")}.com`)
      if (logoResponse.ok) {
        logoUrl = logoResponse.url
      }
    } catch (error) {
      console.log("Logo fetch failed, using default")
    }

    const subscriptionData: any = {
      userId: session.user.id,
      serviceName,
      cost,
      renewalDate: new Date(renewalDate),
      duration: duration || "monthly",
      logoUrl,
      category: category || "Other",
    }

    if (duration === "custom" && customCycle) {
      subscriptionData.customCycle = customCycle
    }

    const subscription = await Subscription.create(subscriptionData)

    return NextResponse.json(subscription, { status: 201 })
  } catch (error) {
    console.error("Error creating subscription:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
