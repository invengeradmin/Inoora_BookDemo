import { NextResponse } from "next/server"
import { query } from "@/lib/postgres"

export async function GET(request: Request) {
  try {
    const email = request.headers.get("x-agent-email")
    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 })
    }

    const { rows } = await query(
      "SELECT id, email, name, role, is_active FROM agents WHERE email = $1 AND is_active = true LIMIT 1",
      [email]
    )

    if (!rows.length) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 })
    }

    return NextResponse.json(rows[0])
  } catch (error) {
    console.error("Error fetching current agent:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
