// /app/api/auth/login/route.ts
import { signInAgent } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { email, password } = await req.json()
  try {
    const result = await signInAgent(email, password)
    return NextResponse.json(result)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 401 })
  }
}
