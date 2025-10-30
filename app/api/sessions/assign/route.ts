import { NextResponse } from "next/server"
import { assignAgentToSession } from "@/lib/database"

export async function POST(req: Request) {
  try {
    const { sessionId, agentId } = await req.json()
    if (!sessionId || !agentId)
      return NextResponse.json({ success: false, message: "Missing parameters" }, { status: 400 })

    const result = await assignAgentToSession(sessionId, agentId)
    return NextResponse.json({ success: true, data: result })
  } catch (err) {
    console.error("assign agent API error:", err)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}
