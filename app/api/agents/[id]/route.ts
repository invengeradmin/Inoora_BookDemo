import { NextResponse } from "next/server"
import { query } from "@/lib/postgres" // ✅ uses your central Postgres pool wrapper

// ---------------- PATCH: Update Agent ----------------
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const body = await request.json()
    const { name, title, timezone, role } = body

    const sql = `
      UPDATE agents
      SET name = $1, title = $2, timezone = $3, role = $4, updated_at = NOW()
      WHERE id = $5
      RETURNING *
    `
    const { rows } = await query(sql, [name, title, timezone, role, id])

    if (!rows.length)
      return NextResponse.json({ error: "Agent not found" }, { status: 404 })

    return NextResponse.json(rows[0])
  } catch (error: any) {
    console.error("Error updating agent:", error)
    return NextResponse.json(
      { error: error?.message || "Failed to update agent" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params

  try {
    // Step 1: Nullify agent_id in demo_sessions first
    await query("UPDATE demo_sessions SET agent_id = NULL WHERE agent_id = $1", [id])

    // Step 2: Delete the agent
    const { rows } = await query("DELETE FROM agents WHERE id = $1 RETURNING *", [id])

    if (!rows.length)
      return NextResponse.json({ error: "Agent not found" }, { status: 404 })

    return NextResponse.json({ success: true, deleted: rows[0] })
  } catch (error: any) {
    console.error("Error deleting agent:", error)
    return NextResponse.json(
      { error: error?.message || "Failed to delete agent" },
      { status: 500 }
    )
  }
}