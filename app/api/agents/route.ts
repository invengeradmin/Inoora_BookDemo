import { NextResponse } from "next/server"
import { query } from "@/lib/postgres"
import bcrypt from "bcryptjs"

// GET all agents
export async function GET() {
  try {
    const { rows } = await query("SELECT * FROM agents ORDER BY name ASC")
    return NextResponse.json(rows)
  } catch (error) {
    console.error("Error fetching agents:", error)
    return NextResponse.json({ error: "Failed to fetch agents" }, { status: 500 })
  }
}

// POST new agent
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, name, title, timezone, role, password } = body

    if (!email || !name || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const hashed = await bcrypt.hash(password, 10)

    const insertQuery = `
      INSERT INTO agents (email, name, title, timezone, role, password_hash, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, true)
      RETURNING *
    `
    const { rows } = await query(insertQuery, [email, name, title, timezone, role, hashed])
    return NextResponse.json(rows[0])
  } catch (error) {
    console.error("Error creating agent:", error)
    return NextResponse.json({ error: "Failed to create agent" }, { status: 500 })
  }
}
