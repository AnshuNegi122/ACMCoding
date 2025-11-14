import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Submission from "@/models/Submission"

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1]

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const submissions = await Submission.find()
      .select("email score totalQuestions percentage createdAt")
      .sort({ percentage: -1, score: -1 })

    const leaderboard = submissions.map((submission, index) => ({
      rank: index + 1,
      name: submission.email.split("@")[0],
      email: submission.email,
      score: submission.score,
      totalQuestions: submission.totalQuestions,
      percentage: submission.percentage,
      date: new Date(submission.createdAt).toLocaleDateString(),
    }))

    return NextResponse.json(leaderboard)
  } catch (error) {
    console.error("[v0] Leaderboard error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
