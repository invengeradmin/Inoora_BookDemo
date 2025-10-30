import { NextResponse } from "next/server"
import { getEmailConfig, saveEmailConfig } from "@/lib/database"

export async function GET() {
  try {
    const config = await getEmailConfig()
    return NextResponse.json({ success: true, data: config })
  } catch (error: any) {
    console.error("Error fetching email config:", error)
    return NextResponse.json(
      { success: false, message: error.message || "Failed to load configuration" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const saved = await saveEmailConfig(body)
    return NextResponse.json({ success: true, data: saved })
  } catch (error: any) {
    console.error("Error saving email config:", error)
    return NextResponse.json(
      { success: false, message: error.message || "Failed to save configuration" },
      { status: 500 }
    )
  }
}
