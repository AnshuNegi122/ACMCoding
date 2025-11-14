import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import User from "@/models/User"

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const { name, email, password, role } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ message: "Name, email and password are required" }, { status: 400 })
    }

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return NextResponse.json({ message: "Email already registered" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ message: "Password must be at least 6 characters" }, { status: 400 })
    }

    const normalizedRole = role === "admin" ? "admin" : "participant"

    await User.create({ name, email, password, role: normalizedRole })

    return NextResponse.json({ message: "Registration successful", role: normalizedRole })
  } catch (error: any) {
    console.error("[v0] Register error:", error)
    if (error.code === 11000) {
      return NextResponse.json({ message: "Email already registered" }, { status: 400 })
    }
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
