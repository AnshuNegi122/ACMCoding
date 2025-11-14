import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ message: "Name, email and password are required" }, { status: 400 })
    }

    const existingUser = await query("SELECT id FROM users WHERE email = ?", [email])
    const users = existingUser as any[]

    if (users.length > 0) {
      return NextResponse.json({ message: "Email already registered" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ message: "Password must be at least 6 characters" }, { status: 400 })
    }

    const normalizedRole = role === "admin" ? "admin" : "participant"

    await query("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)", [name, email, password, normalizedRole])

    return NextResponse.json({ message: "Registration successful", role: normalizedRole })
  } catch (error) {
    console.error("[v0] Register error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
