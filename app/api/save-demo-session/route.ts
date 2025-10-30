import { NextResponse } from "next/server"
import { saveDemoSession } from "@/lib/database"

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const saved = await saveDemoSession(data)
    return NextResponse.json({
      success: true,
      data: JSON.parse(JSON.stringify(saved)), // ✅ make serializable
    })
  } catch (error: any) {
    console.error("API save-demo-session error:", error)
    return NextResponse.json({ success: false, message: String(error) }, { status: 500 })
  }
}
