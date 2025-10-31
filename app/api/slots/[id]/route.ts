import { NextResponse } from "next/server"
import { query } from "@/lib/postgres"

export async function DELETE(_req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  try {
    await query("DELETE FROM blocked_slots WHERE id=$1", [id])
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting slot:", error)
    return NextResponse.json({ error: "Failed to delete slot" }, { status: 500 })
  }
}