import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Question from "@/models/Question"

const optionKeys = ["A", "B", "C", "D"]

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1]

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const questions = await Question.find().select("_id text optionA optionB optionC optionD correctAnswer")

    const formattedQuestions = questions.map((q) => ({
      id: q._id.toString(),
      text: q.text,
      options: optionKeys.map((key) => ({
        key,
        value: q[`option${key}` as "optionA" | "optionB" | "optionC" | "optionD"],
      })),
      correctAnswer: q.correctAnswer,
    }))

    return NextResponse.json(formattedQuestions)
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

    await connectDB()
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

    const insertedQuestion = await Question.create({
      text: trimmedText,
      optionA,
      optionB,
      optionC,
      optionD,
      correctAnswer,
    })

    return NextResponse.json({
      id: insertedQuestion._id.toString(),
      text: trimmedText,
      options: optionKeys.map((key, index) => ({
        key,
        value: options[index].trim(),
      })),
      correctAnswer,
    })
  } catch (error: any) {
    console.error("[v0] Add question error:", error)
    const errorMessage = error?.message || "Internal server error"
    return NextResponse.json({ message: errorMessage, error: String(error) }, { status: 500 })
  }
}
