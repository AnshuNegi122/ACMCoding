"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlertCircle, Clock, CheckCircle2 } from "lucide-react"

export default function InstructionsPage() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    const user = localStorage.getItem("user")

    if (!token || !user) {
      router.push("/login")
      return
    }

    const userData = JSON.parse(user)
    if (userData.role !== "participant") {
      router.push("/test")
      return
    }
  }, [router])

  const handleStartTest = () => {
    localStorage.setItem("testStartTime", new Date().getTime().toString())
    router.push("/test")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-accent/10 p-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card className="p-8 space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Test Instructions</h1>
            <p className="text-muted-foreground">Please read carefully before starting the test</p>
          </div>

          <div className="space-y-4">
            <div className="flex gap-4 p-4 bg-secondary/50 rounded-lg">
              <Clock className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Test Duration: 1 Hour</p>
                <p className="text-sm text-muted-foreground">
                  You will have 60 minutes to complete the test. The timer will start when you click "Start Test".
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-secondary/50 rounded-lg">
              <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Answer All Questions</p>
                <p className="text-sm text-muted-foreground">
                  You must answer all questions before submitting. Use the Previous/Next buttons to navigate.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-secondary/50 rounded-lg">
              <AlertCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Final Submission</p>
                <p className="text-sm text-muted-foreground">
                  Once submitted, you cannot change your answers. Review carefully before submitting.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="font-semibold text-yellow-900">Important Notes:</p>
            <ul className="space-y-2 text-sm text-yellow-900">
              <li>• Do not refresh or close the browser during the test</li>
              <li>• All answers must be submitted before time expires</li>
              <li>• If time expires, your current answers will be submitted automatically</li>
              <li>• Ensure stable internet connection throughout the test</li>
            </ul>
          </div>

          <div className="flex gap-4">
            <Button variant="outline" onClick={() => router.push("/")} className="flex-1 bg-transparent">
              Go Back
            </Button>
            <Button onClick={handleStartTest} className="flex-1">
              Start Test
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
