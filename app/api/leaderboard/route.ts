import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1]

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const results = await query(
      `SELECT s.email, s.score, s.percentage, s.created_at 
       FROM submissions s 
       ORDER BY s.percentage DESC, s.score DESC`,
    )

    const leaderboard = (results as any[]).map((submission, index) => ({
      rank: index + 1,
      name: submission.email.split("@")[0],
      email: submission.email,
      score: submission.score,
      percentage: submission.percentage,
      date: new Date(submission.created_at).toLocaleDateString(),
    }))

    return NextResponse.json(leaderboard)
  } catch (error) {
    console.error("[v0] Leaderboard error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
