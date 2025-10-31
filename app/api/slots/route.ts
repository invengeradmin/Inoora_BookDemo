import { NextResponse } from "next/server"
import { query } from "@/lib/postgres"

export async function GET() {
  try {
    const res = await query("SELECT * FROM blocked_slots ORDER BY date, time")
    return NextResponse.json(res.rows)
  } catch (error) {
    console.error("Error fetching slots:", error)
    return NextResponse.json({ error: "Failed to fetch slots" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { date, time, reason } = await req.json()
    const res = await query(
      "INSERT INTO blocked_slots (date, time, reason) VALUES ($1, $2, $3) RETURNING *",
      [date, time, reason]
    )
    return NextResponse.json(res.rows[0])
  } catch (error) {
    console.error("Error inserting slot:", error)
    return NextResponse.json({ error: "Failed to insert slot" }, { status: 500 })
  }
}
