"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Clock } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface QuestionOption {
  key: string
  value: string
}

interface Question {
  id: string
  text: string
  options: QuestionOption[]
  correctAnswer: string
}

export default function TestPage() {
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(3600)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    const fetchQuestions = async () => {
      try {
        const response = await fetch("/api/questions", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!response.ok) throw new Error("Failed to fetch questions")

        const data = await response.json()
        setQuestions(data)
      } catch (err) {
        setError("Failed to load questions")
      } finally {
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [router])

  useEffect(() => {
    if (loading || submitted) return

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [loading, submitted])

  const handleAnswer = (value: string) => {
    setAnswers({
      ...answers,
      [questions[currentIndex].id]: value,
    })
  }

  const handleSubmit = async () => {
    const token = localStorage.getItem("token")
    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ answers }),
      })

      if (!response.ok) throw new Error("Submission failed")

      const data = await response.json()
      localStorage.setItem("lastScore", JSON.stringify(data))
      setSubmitted(true)
      router.push("/thank-you")
    } catch (err) {
      setError("Failed to submit test")
    }
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const isTimeWarning = timeRemaining < 300

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8">Loading questions...</Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No questions available yet</p>
        </Card>
      </div>
    )
  }

  const question = questions[currentIndex]
  const progress = ((currentIndex + 1) / questions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-accent/10 p-4 py-8">
      <Card className="max-w-2xl mx-auto p-8 space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Test</h1>
            <div
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-semibold ${isTimeWarning ? "bg-red-100 text-red-700" : "bg-secondary/50"}`}
            >
              <Clock className="h-4 w-4" />
              <span>{formatTime(timeRemaining)}</span>
            </div>
          </div>
          <div className="flex justify-between items-center text-sm text-muted-foreground mb-2">
            <span>
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span>
              Answered: {Object.keys(answers).length} / {questions.length}
            </span>
          </div>
          <div className="w-full bg-border rounded-full h-2">
            <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">{question.text}</h2>
            <RadioGroup value={answers[question.id] || ""} onValueChange={handleAnswer}>
              <div className="space-y-3">
                {question.options.map((option) => {
                  const optionId = `option-${question.id}-${option.key}`
                  return (
                    <div key={option.key} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.key} id={optionId} />
                      <Label htmlFor={optionId} className="cursor-pointer flex-1">
                        <span className="font-semibold mr-2">{option.key}.</span>
                        {option.value}
                    </Label>
                    </div>
                  )
                })}
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="flex gap-4 justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
          >
            Previous
          </Button>

          {currentIndex === questions.length - 1 ? (
            <Button onClick={handleSubmit} disabled={Object.keys(answers).length !== questions.length}>
              Submit Test
            </Button>
          ) : (
            <Button onClick={() => setCurrentIndex(currentIndex + 1)}>Next</Button>
          )}
        </div>
      </Card>
    </div>
  )
}
