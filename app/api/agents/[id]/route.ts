import { NextResponse } from "next/server"
import { query } from "@/lib/postgres"

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()
    const { name, title, timezone, role } = body

    const updateQuery = `
      UPDATE agents
      SET name = $1, title = $2, timezone = $3, role = $4
      WHERE id = $5
      RETURNING *
    `
    const { rows } = await query(updateQuery, [name, title, timezone, role, id])
    return NextResponse.json(rows[0])
  } catch (error) {
    console.error("Error updating agent:", error)
    return NextResponse.json({ error: "Failed to update agent" }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    await query("DELETE FROM agents WHERE id = $1", [id])
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting agent:", error)
    return NextResponse.json({ error: "Failed to delete agent" }, { status: 500 })
  }
}
