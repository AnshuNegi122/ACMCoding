import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import User from "@/models/User"

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const { email, password } = await request.json()

    const user = await User.findOne({ email, password }).select("_id name email role")

    if (!user) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
    }

    const token = Buffer.from(JSON.stringify({ id: user._id.toString(), email: user.email, role: user.role })).toString("base64")

    return NextResponse.json({
      token,
      user: {
        id: user._id.toString(),
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
