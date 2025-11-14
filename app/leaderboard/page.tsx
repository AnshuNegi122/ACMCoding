"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trophy } from "lucide-react"

interface LeaderboardEntry {
  rank: number
  name: string
  score: number
  percentage: number
  date: string
}

export default function LeaderboardPage() {
  const router = useRouter()
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    const fetchLeaderboard = async () => {
      try {
        const response = await fetch("/api/leaderboard", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!response.ok) throw new Error("Failed to fetch leaderboard")

        const data = await response.json()
        setEntries(data)
      } catch (err) {
        console.error("Failed to load leaderboard")
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-accent/10 p-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Leaderboard</h1>
          </div>
          <Link href="/">
            <Button variant="outline">Home</Button>
          </Link>
        </div>

        <Card className="p-6">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading leaderboard...</div>
          ) : entries.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No scores yet</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Rank</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                  <TableHead className="text-right">Percentage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => (
                  <TableRow key={entry.rank}>
                    <TableCell className="font-bold">#{entry.rank}</TableCell>
                    <TableCell>{entry.name}</TableCell>
                    <TableCell className="text-right">{entry.score}</TableCell>
                    <TableCell className="text-right font-semibold text-primary">
                      {entry.percentage.toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>
    </div>
  )
}
