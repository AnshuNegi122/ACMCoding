"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export default function ThankYouPage() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 text-center space-y-6">
        <CheckCircle className="h-16 w-16 mx-auto text-green-600" />

        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Thank You!</h1>
          <p className="text-muted-foreground">Your test submission has been recorded successfully</p>
        </div>

        <div className="bg-secondary/50 rounded-lg p-6 space-y-4">
          <div className="text-center">
            <p className="text-muted-foreground mb-2">Your test has been submitted</p>
            <p className="text-lg font-semibold">Admin will review and publish your results shortly</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Link href="/" className="w-full">
            <Button className="w-full">Go to Home</Button>
          </Link>
          <Link href="/leaderboard" className="w-full">
            <Button variant="outline" className="w-full bg-transparent">
              View Leaderboard
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
