"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, LogOut, Trophy } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

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

interface LeaderboardEntry {
  rank: number
  name: string
  email: string
  score: number
  percentage: number
  date: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [activeTab, setActiveTab] = useState<"questions" | "leaderboard">("questions")

  const [formData, setFormData] = useState({
    text: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctAnswer: "A",
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const user = localStorage.getItem("user")

    if (!token || !user) {
      router.push("/login")
      return
    }

    const userData = JSON.parse(user)
    if (userData.role !== "admin") {
      router.push("/test")
      return
    }

    fetchQuestions(token)
    fetchLeaderboard(token)
  }, [router])

  const fetchQuestions = async (token: string) => {
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

  const fetchLeaderboard = async (token: string) => {
    try {
      const response = await fetch("/api/leaderboard", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) throw new Error("Failed to fetch leaderboard")

      const data = await response.json()
      setLeaderboard(data)
    } catch (err) {
      console.error("Failed to load leaderboard")
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, correctAnswer: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setSubmitting(true)

    const token = localStorage.getItem("token")

    try {
      const response = await fetch("/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          text: formData.text,
          options: [formData.optionA, formData.optionB, formData.optionC, formData.optionD],
          correctAnswer: formData.correctAnswer,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to add question")
      }

      setSuccess("Question added successfully!")
      setFormData({
        text: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        correctAnswer: "A",
      })

      const fetchedToken = localStorage.getItem("token")
      if (fetchedToken) {
        await fetchQuestions(fetchedToken)
      }
    } catch (err: any) {
      setError(err?.message || "Failed to add question. Please check your database connection.")
      console.error("Add question error:", err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-accent/10 p-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 bg-transparent">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        <div className="flex gap-4 border-b border-border">
          <button
            onClick={() => setActiveTab("questions")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "questions"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Manage Questions
          </button>
          <button
            onClick={() => setActiveTab("leaderboard")}
            className={`px-4 py-2 font-medium transition-colors flex items-center gap-2 ${
              activeTab === "leaderboard"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Trophy className="h-4 w-4" />
            Leaderboard
          </button>
        </div>

        {activeTab === "questions" ? (
          <div className="grid gap-8 md:grid-cols-2">
            <Card className="p-6 space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Add New Question</h2>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">{success}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="text">Question Text</Label>
                  <Textarea
                    id="text"
                    name="text"
                    placeholder="Enter the question"
                    value={formData.text}
                    onChange={handleInputChange}
                    required
                    className="mt-1"
                  />
                </div>

                <div className="space-y-3">
                  {["A", "B", "C", "D"].map((letter) => (
                    <div key={letter}>
                      <Label htmlFor={`option${letter}`}>Option {letter}</Label>
                      <Input
                        id={`option${letter}`}
                        name={`option${letter}`}
                        placeholder={`Enter option ${letter}`}
                        value={formData[`option${letter}` as keyof typeof formData]}
                        onChange={handleInputChange}
                        required
                        className="mt-1"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <Label htmlFor="correctAnswer">Correct Answer</Label>
                  <select
                    id="correctAnswer"
                    value={formData.correctAnswer}
                    onChange={handleSelectChange}
                    className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>

                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? "Adding..." : "Add Question"}
                </Button>
              </form>
            </Card>

            <Card className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Questions List</h2>

              {loading ? (
                <p className="text-muted-foreground">Loading questions...</p>
              ) : questions.length === 0 ? (
                <p className="text-muted-foreground">No questions added yet</p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {questions.map((q, idx) => (
                    <div key={q.id} className="p-3 border border-border rounded-md text-sm">
                      <p className="font-semibold">
                        Q{idx + 1}: {q.text}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Correct: {q.correctAnswer}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        ) : (
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Trophy className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold">Participant Scores</h2>
              </div>

              {loading ? (
                <p className="text-muted-foreground">Loading leaderboard...</p>
              ) : leaderboard.length === 0 ? (
                <p className="text-muted-foreground">No submissions yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">Rank</TableHead>
                        <TableHead>Participant</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className="text-right">Score</TableHead>
                        <TableHead className="text-right">Percentage</TableHead>
                        <TableHead className="text-right">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leaderboard.map((entry) => (
                        <TableRow key={entry.rank}>
                          <TableCell className="font-bold">#{entry.rank}</TableCell>
                          <TableCell>{entry.name}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{entry.email}</TableCell>
                          <TableCell className="text-right font-semibold">
                            {entry.score}/{entry.score + (5 - entry.score)}
                          </TableCell>
                          <TableCell className="text-right font-semibold text-primary">
                            {entry.percentage.toFixed(1)}%
                          </TableCell>
                          <TableCell className="text-right text-sm">{entry.date}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </Card>
        )}

        <Link href="/">
          <Button variant="outline" className="w-full bg-transparent">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
