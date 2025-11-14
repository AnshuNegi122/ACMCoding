import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

const optionKeys = ["A", "B", "C", "D"]

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1]

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const results = await query(
      "SELECT id, text, option_a as optionA, option_b as optionB, option_c as optionC, option_d as optionD, correct_answer as correctAnswer FROM questions",
    )

    const questions = (results as any[]).map((q) => ({
      id: q.id.toString(),
      text: q.text,
      options: optionKeys.map((key, index) => ({
        key,
        value: q[`option${key}` as "optionA" | "optionB" | "optionC" | "optionD"],
      })),
      correctAnswer: q.correctAnswer,
    }))

    return NextResponse.json(questions)
  } catch (error: any) {
    console.error("[v0] Questions error:", error)
    const errorMessage = error?.message || "Internal server error"
    return NextResponse.json({ message: errorMessage, error: String(error) }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1]

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    let isAdmin = false
    try {
      const decodedToken = JSON.parse(Buffer.from(token, "base64").toString("utf-8"))
      isAdmin = decodedToken.role === "admin"
    } catch (e) {
      // Token decode failed
    }

    if (!isAdmin) {
      return NextResponse.json({ message: "Forbidden: Admin access required" }, { status: 403 })
    }

    const body = await request.json()
    const { text, options, correctAnswer } = body

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json({ message: "Question text is required" }, { status: 400 })
    }

    if (!Array.isArray(options) || options.length !== 4) {
      return NextResponse.json({ message: "Exactly four options are required" }, { status: 400 })
    }

    if (options.some((opt: any) => !opt || typeof opt !== "string" || opt.trim().length === 0)) {
      return NextResponse.json({ message: "All options must be non-empty strings" }, { status: 400 })
    }

    if (!correctAnswer || !optionKeys.includes(correctAnswer)) {
      return NextResponse.json({ message: "Correct answer must be one of A, B, C, or D" }, { status: 400 })
    }

    const trimmedText = text.trim()
    const [optionA, optionB, optionC, optionD] = options.map((opt: string) => opt.trim())

    const result: any = await query(
      "INSERT INTO questions (text, option_a, option_b, option_c, option_d, correct_answer) VALUES (?, ?, ?, ?, ?, ?)",
      [trimmedText, optionA, optionB, optionC, optionD, correctAnswer],
    )

    // mysql2 returns ResultSetHeader with insertId property
    const insertId = result?.insertId || result?.[0]?.insertId

    if (!insertId) {
      throw new Error("Failed to get insert ID from database")
    }

    const insertedQuestion = {
      id: insertId.toString(),
      text: trimmedText,
      options: optionKeys.map((key, index) => ({
        key,
        value: options[index].trim(),
      })),
      correctAnswer,
    }

    return NextResponse.json(insertedQuestion)
  } catch (error: any) {
    console.error("[v0] Add question error:", error)
    const errorMessage = error?.message || "Internal server error"
    return NextResponse.json({ message: errorMessage, error: String(error) }, { status: 500 })
  }
}
