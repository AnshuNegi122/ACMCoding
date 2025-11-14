import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1]

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    let userId = 0
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

    // Convert question IDs to integers for database query
    const questionIds = answeredQuestionIds
      .map((id) => {
        const numId = parseInt(id, 10)
        return isNaN(numId) ? null : numId
      })
      .filter((id) => id !== null) as number[]

    if (questionIds.length === 0) {
      return NextResponse.json({ message: "Invalid question IDs" }, { status: 400 })
    }

    // Only fetch the questions that were actually answered
    const placeholders = questionIds.map(() => "?").join(",")
    const questionsResult = await query(
      `SELECT id, correct_answer FROM questions WHERE id IN (${placeholders})`,
      questionIds
    )
    const questions = questionsResult as any[]

    if (questions.length === 0) {
      return NextResponse.json({ message: "No valid questions found" }, { status: 400 })
    }

    // Create a map for quick lookup (convert id to string for matching)
    const questionsMap = new Map<string, string>()
    questions.forEach((q) => {
      questionsMap.set(String(q.id), String(q.correct_answer).toUpperCase().trim())
    })

    // Calculate score based only on answered questions
    let score = 0
    let totalAnswered = 0
    
    Object.entries(answers).forEach(([questionId, selectedOption]) => {
      // Skip empty answers
      if (!selectedOption || (typeof selectedOption === "string" && selectedOption.trim() === "")) {
        return
      }

      totalAnswered++
      const correctAnswer = questionsMap.get(questionId)
      const userAnswer = String(selectedOption).toUpperCase().trim()
      
      if (correctAnswer && correctAnswer === userAnswer) {
        score++
      }
    })

    // Use the number of questions actually answered, not all questions in DB
    const totalQuestions = totalAnswered > 0 ? totalAnswered : answeredQuestionIds.length
    const percentage = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0

    await query(
      "INSERT INTO submissions (user_id, email, score, total_questions, percentage, passed, answers) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [userId, userEmail, score, totalQuestions, percentage, percentage >= 50, JSON.stringify(answers)],
    )

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
