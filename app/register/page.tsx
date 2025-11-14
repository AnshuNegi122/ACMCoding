"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("participant")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || "Registration failed")
        return
      }

      setSuccess("Registration successful! Redirecting to login...")
      setTimeout(() => {
        router.push("/login")
      }, 2000)
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 animate-in fade-in duration-500">
      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom duration-700">
        <div className="text-center space-y-4 animate-in fade-in zoom-in duration-500">
          <div className="flex justify-center mb-4">
            <img src="/frostbyte-logo.png" alt="frostByte" className="w-32 h-32 object-contain transition-all duration-300 hover:scale-110 hover:rotate-6 animate-pulse" width={128} height={128} />
          </div>
          <div className="animate-in fade-in slide-in-from-bottom duration-500 delay-200">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              frostByte
            </h1>
            <p className="text-muted-foreground mt-2">Join the challenge</p>
          </div>
        </div>

        <Card className="p-8 space-y-6 bg-card border-border animate-in fade-in slide-in-from-bottom duration-700 delay-300 transition-all duration-300 hover:shadow-xl">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-950 border-green-800">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <AlertDescription className="text-green-300">{success}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground font-mono text-sm">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="John Developer"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-input border-border text-foreground placeholder:text-muted-foreground font-mono transition-all duration-300 focus:scale-105 focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-mono text-sm">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="dev@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-input border-border text-foreground placeholder:text-muted-foreground font-mono transition-all duration-300 focus:scale-105 focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-mono text-sm">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="bg-input border-border text-foreground placeholder:text-muted-foreground font-mono transition-all duration-300 focus:scale-105 focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-foreground font-mono text-sm">
                Registering as
              </Label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-input border border-border rounded-md px-3 py-2 text-foreground font-mono transition-all duration-300 focus:scale-105 focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="participant">Participant</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline font-semibold">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
