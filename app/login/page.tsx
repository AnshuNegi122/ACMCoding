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
import { AlertCircle } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || "Login failed")
        return
      }

      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))

      if (data.user.role === "admin") {
        router.push("/admin/dashboard")
      } else {
        router.push("/instructions")
      }
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 animate-in fade-in duration-500">
      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom duration-700">
        {/* Logo & Header */}
        <div className="text-center space-y-4 animate-in fade-in zoom-in duration-500">
          <div className="flex justify-center mb-4">
            <img src="/frostbyte-logo.png" alt="frostByte" className="w-32 h-32 object-contain transition-all duration-300 hover:scale-110 hover:rotate-6 animate-pulse" width={128} height={128} />
          </div>
          <div className="animate-in fade-in slide-in-from-bottom duration-500 delay-200">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              frostByte
            </h1>
            <p className="text-muted-foreground mt-2">Sign in to continue</p>
          </div>
        </div>

        <Card className="p-8 space-y-6 bg-card border-border animate-in fade-in slide-in-from-bottom duration-700 delay-300 transition-all duration-300 hover:shadow-xl">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
                className="bg-input border-border text-foreground placeholder:text-muted-foreground font-mono transition-all duration-300 focus:scale-105 focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="pt-4 border-t border-border space-y-3 text-center text-xs">
            <p className="text-muted-foreground">Demo Credentials:</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-2 rounded bg-secondary/10 border border-secondary">
                <p className="text-muted-foreground mb-1">Admin</p>
                <p className="font-mono text-primary text-xs">admin@test.com</p>
                <p className="font-mono text-primary text-xs">admin123</p>
              </div>
              <div className="p-2 rounded bg-accent/10 border border-accent">
                <p className="text-muted-foreground mb-1">User</p>
                <p className="font-mono text-accent text-xs">user@test.com</p>
                <p className="font-mono text-accent text-xs">user123</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Register Link */}
        <div className="text-center text-sm text-muted-foreground">
          New to frostByte?{" "}
          <Link href="/register" className="text-primary hover:underline font-semibold">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  )
}
