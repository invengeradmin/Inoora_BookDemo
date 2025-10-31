import { NextResponse } from "next/server"
import { updateDemoSession } from "@/lib/database"

export async function POST(request: Request) {
  try {
    const { sessionId, updates } = await request.json()
    const updated = await updateDemoSession(sessionId, updates)

    // Force plain JSON serialization for safety
    return NextResponse.json(JSON.parse(JSON.stringify(updated)))
  } catch (error: any) {
    console.error("Error in /api/sessions/update:", error)
    return NextResponse.json(
      { error: "Failed to update session", details: error?.message },
      { status: 500 }
    )
  }
}
