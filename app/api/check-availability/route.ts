import { NextResponse } from "next/server"
import { query } from "@/lib/postgres"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const date = searchParams.get("date")

    if (!date) {
      return NextResponse.json({ success: false, message: "Date is required" }, { status: 400 })
    }

    // Run both queries in parallel for better performance
  const [blockedResult, bookedResult] = await Promise.all([
  query(`SELECT time FROM blocked_slots WHERE date = $1`, [date]),
  query(
    `SELECT demo_time FROM demo_sessions WHERE demo_date = $1 AND status != 'cancelled'`,
    [date]
  ),
])

    const blockedSlots = blockedResult.rows.map((r) => `${date}_${r.time}`)
    const bookedSlots = bookedResult.rows.map((r) => `${date}_${r.demo_time}`)

    return NextResponse.json({
      success: true,
      blockedSlots,
      bookedSlots,
    })
  } catch (error: any) {
    console.error("Error checking availability:", error)
    return NextResponse.json(
      {
        success: false,
        message: `Failed to check availability: ${error.message || String(error)}`,
        blockedSlots: [],
        bookedSlots: [],
      },
      { status: 500 }
    )
  }
}
