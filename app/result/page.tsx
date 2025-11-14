"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle, XCircle } from "lucide-react"

interface Result {
  score: number
  totalQuestions: number
  percentage: number
  passed: boolean
}

export default function ResultPage() {
  const router = useRouter()
  const [result, setResult] = useState<Result | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    const lastScore = localStorage.getItem("lastScore")
    if (lastScore) {
      setResult(JSON.parse(lastScore))
    }
  }, [router])

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8">Loading result...</Card>
      </div>
    )
  }

  const Icon = result.passed ? CheckCircle : XCircle
  const statusColor = result.passed ? "text-green-600" : "text-destructive"
  const statusText = result.passed ? "Passed" : "Failed"

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 text-center space-y-6">
        <Icon className={`h-16 w-16 mx-auto ${statusColor}`} />

        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Test {statusText}!</h1>
          <p className="text-muted-foreground">Your test submission has been recorded</p>
        </div>

        <div className="bg-secondary/50 rounded-lg p-6 space-y-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary">{result.percentage.toFixed(1)}%</div>
            <p className="text-muted-foreground">Score</p>
          </div>

          <div className="text-center text-sm">
            <p className="text-muted-foreground">
              You answered <strong>{result.score}</strong> out of <strong>{result.totalQuestions}</strong> questions
              correctly
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Link href="/" className="flex-1">
            <Button variant="outline" className="w-full bg-transparent">
              Home
            </Button>
          </Link>
          <Link href="/leaderboard" className="flex-1">
            <Button className="w-full">Leaderboard</Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
