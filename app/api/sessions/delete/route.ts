import { NextResponse } from "next/server"
import { query } from "@/lib/postgres"

export async function POST(req: Request) {
  try {
    const { sessionId } = await req.json()
    if (!sessionId)
      return NextResponse.json({ success: false, message: "Missing sessionId" }, { status: 400 })

    const result = await query("DELETE FROM demo_sessions WHERE id=$1 RETURNING *", [sessionId])
    const deleted = result.rows[0] ? { ...result.rows[0] } : null

    return NextResponse.json({ success: true, session: deleted })
  } catch (error: any) {
    console.error("Error deleting demo session:", error)
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to delete session" },
      { status: 500 }
    )
  }
}
