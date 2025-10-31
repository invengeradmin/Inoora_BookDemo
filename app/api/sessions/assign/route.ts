// /app/api/sessions/assign/route.ts
import { NextResponse } from "next/server"
import { query } from "@/lib/postgres"

export async function GET() {
  try {
    const { rows } = await query(`
      SELECT 
        s.*, 
        json_build_object(
          'id', a.id,
          'name', a.name,
          'title', a.title,
          'email', a.email,
          'avatar_url', a.avatar_url
        ) AS agent
      FROM demo_sessions s
      LEFT JOIN agents a ON s.agent_id = a.id
      ORDER BY s.created_at DESC
    `)

    return NextResponse.json({ success: true, sessions: rows })
  } catch (error) {
    console.error("Error fetching sessions:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch sessions" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { sessionId, agentId } = await request.json()

    if (!sessionId || !agentId) {
      return NextResponse.json({ success: false, message: "Missing parameters" }, { status: 400 })
    }

    await query(`UPDATE demo_sessions SET agent_id = $1 WHERE id = $2`, [agentId, sessionId])

    const { rows } = await query(`
      SELECT 
        s.*, 
        json_build_object(
          'id', a.id,
          'name', a.name,
          'title', a.title,
          'email', a.email,
          'avatar_url', a.avatar_url
        ) AS agent
      FROM demo_sessions s
      LEFT JOIN agents a ON s.agent_id = a.id
      WHERE s.id = $1
      LIMIT 1
    `, [sessionId])

    if (!rows.length) {
      return NextResponse.json({ success: false, message: "Session not found" }, { status: 404 })
    }

    // Ensure it returns plain JSON (no prototypes)
    return NextResponse.json({
      success: true,
      session: JSON.parse(JSON.stringify(rows[0]))
    })
  } catch (error) {
    console.error("Error assigning agent:", error)
    return NextResponse.json({ success: false, message: "Assignment failed" }, { status: 500 })
  }
}
