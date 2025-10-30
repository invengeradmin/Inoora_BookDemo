import { NextResponse } from "next/server"
import { query } from "@/lib/postgres"
import bcrypt from "bcryptjs"

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 })
    }

    const hashed = await bcrypt.hash(password, 10)
    await query("UPDATE agents SET password_hash = $1 WHERE id = $2", [hashed, id])
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating password:", error)
    return NextResponse.json({ error: "Failed to update password" }, { status: 500 })
  }
}
