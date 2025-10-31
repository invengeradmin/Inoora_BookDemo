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

    return NextResponse.json(rows)
  } catch (error) {
    console.error("Error fetching sessions:", error)
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 })
  }
}
export async function POST(request: Request) {
  try {
    const { sessionId, agentId } = await request.json()

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

    return NextResponse.json({ success: true, session: rows[0] })
  } catch (error) {
    console.error("Error assigning agent:", error)
    return NextResponse.json({ success: false, message: "Assignment failed" }, { status: 500 })
  }
}