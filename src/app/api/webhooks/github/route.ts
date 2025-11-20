import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const eventType = request.headers.get("x-github-event")

    console.log("Received GitHub Webhook:", eventType)
    console.log("Payload:", JSON.stringify(body, null, 2))

    return NextResponse.json({ message: "Webhook received" }, { status: 200 })
  } catch (error) {
    console.error("Error processing webhook:", error)
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
