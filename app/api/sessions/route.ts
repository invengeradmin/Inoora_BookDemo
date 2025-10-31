import { NextResponse } from "next/server"
import { query } from "@/lib/postgres"

export async function GET() {
  try {
    const { rows } = await query("SELECT * FROM demo_sessions ORDER BY demo_date DESC")
    return NextResponse.json(rows)
  } catch (error) {
    console.error("Error fetching sessions:", error)
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 })
  }
}
