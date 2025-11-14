import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    const results = await query("SELECT id, name, email, role FROM users WHERE email = ? AND password = ?", [
      email,
      password,
    ])

    const users = results as any[]
    if (users.length === 0) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
    }

    const user = users[0]
    const token = Buffer.from(JSON.stringify({ id: user.id, email: user.email, role: user.role })).toString("base64")

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
