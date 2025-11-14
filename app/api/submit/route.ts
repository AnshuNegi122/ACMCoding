import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Question from "@/models/Question"
import Submission from "@/models/Submission"
import mongoose from "mongoose"

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const token = request.headers.get("Authorization")?.split(" ")[1]

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    let userId: string = ""
    let userEmail = "unknown"
    try {
      const decodedToken = JSON.parse(Buffer.from(token, "base64").toString("utf-8"))
      userId = decodedToken.id
      userEmail = decodedToken.email
    } catch (e) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    const { answers } = await request.json()

    // Validate answers object
    if (!answers || typeof answers !== "object") {
      return NextResponse.json({ message: "Invalid answers format" }, { status: 400 })
    }

    // Get the question IDs that were actually answered (filter out empty/null values)
    const answeredQuestionIds = Object.keys(answers).filter(
      (id) => {
        const answer = answers[id]
        return answer !== null && answer !== undefined && answer !== "" && String(answer).trim() !== ""
      }
    )
    
    if (answeredQuestionIds.length === 0) {
      return NextResponse.json({ message: "No answers provided" }, { status: 400 })
    }

    // Convert question IDs to MongoDB ObjectIds
    const questionIds = answeredQuestionIds
      .map((id) => {
        if (mongoose.Types.ObjectId.isValid(id)) {
          return new mongoose.Types.ObjectId(id)
        }
        return null
      })
      .filter((id) => id !== null) as mongoose.Types.ObjectId[]

    if (questionIds.length === 0) {
      return NextResponse.json({ message: "Invalid question IDs" }, { status: 400 })
    }

    // Only fetch the questions that were actually answered
    const questions = await Question.find({
      _id: { $in: questionIds },
    }).select("_id correctAnswer")

    if (questions.length === 0) {
      return NextResponse.json({ message: "No valid questions found" }, { status: 400 })
    }

    // Create a map for quick lookup (convert id to string for matching)
    const questionsMap = new Map<string, string>()
    questions.forEach((q) => {
      questionsMap.set(q._id.toString(), String(q.correctAnswer).toUpperCase().trim())
    })

    // Get total number of questions in the database, or use answers length as fallback
    let totalQuestions = await Question.countDocuments()
    
    // Fallback: if count is 0 or unavailable, use the number of questions in answers
    if (totalQuestions === 0 && answers && typeof answers === "object") {
      totalQuestions = Object.keys(answers).length
    }
    
    if (totalQuestions === 0) {
      return NextResponse.json({ message: "No questions found in database" }, { status: 400 })
    }

    // Calculate score based on correct answers
    let score = 0
    
    Object.entries(answers).forEach(([questionId, selectedOption]) => {
      // Skip empty answers
      if (!selectedOption || (typeof selectedOption === "string" && selectedOption.trim() === "")) {
        return
      }

      const correctAnswer = questionsMap.get(questionId)
      const userAnswer = String(selectedOption).toUpperCase().trim()
      
      if (correctAnswer && correctAnswer === userAnswer) {
        score++
      }
    })

    // Calculate percentage based on total questions in DB
    const percentage = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0

    await Submission.create({
      userId: new mongoose.Types.ObjectId(userId),
      email: userEmail,
      score,
      totalQuestions,
      percentage,
      passed: percentage >= 50,
      answers,
    })

    return NextResponse.json({
      score,
      totalQuestions,
      percentage,
      passed: percentage >= 50,
    })
  } catch (error) {
    console.error("[v0] Submit error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
