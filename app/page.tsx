import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Code2, Zap, Trophy, Users } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border backdrop-blur-sm sticky top-0 z-50 animate-in fade-in slide-in-from-top duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/acm-logo.png" alt="ACM Chapter" className="w-32 h-32 object-contain transition-transform duration-300 hover:scale-110 hover:rotate-3" width={128} height={128} />
            <div>
              <p className="text-xs text-muted-foreground font-mono">Presented by</p>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                frostByte 2025
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            <Link href="/login">
              <Button variant="outline" className="border-border bg-transparent transition-all duration-300 hover:scale-105 hover:shadow-lg">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-primary text-primary-foreground transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/50">Register</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 animate-in fade-in zoom-in duration-500 delay-100">
            <Trophy className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm text-primary font-mono">ACM Chapter Coding Contest</span>
          </div>

          <div className="space-y-6 animate-in fade-in slide-in-from-bottom duration-700 delay-200">
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight font-mono animate-in fade-in slide-in-from-bottom duration-700 delay-300">
              frost
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-pulse">
                Byte
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
              Challenge your coding skills in our premier MCQ contest. Solve algorithmic problems, test your knowledge,
              and compete with fellow developers.
            </p>
          </div>

          <div className="flex gap-4 justify-center pt-6 animate-in fade-in slide-in-from-bottom duration-700 delay-500">
            <Link href="/register">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 font-mono transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-primary/50 group">
                Start Contest <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="border-border bg-transparent font-mono transition-all duration-300 hover:scale-110 hover:shadow-lg">
                I have an account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-border">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 rounded-lg border border-border bg-card/50 hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20 animate-in fade-in slide-in-from-left duration-500 delay-100">
            <Zap className="w-8 h-8 text-primary mb-4 transition-transform duration-300 hover:scale-125 hover:rotate-12" />
            <h3 className="text-lg font-semibold mb-2">Lightning Fast</h3>
            <p className="text-muted-foreground text-sm">Instant feedback on your answers with real-time scoring</p>
          </div>

          <div className="p-6 rounded-lg border border-border bg-card/50 hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20 animate-in fade-in slide-in-from-bottom duration-500 delay-200">
            <Users className="w-8 h-8 text-primary mb-4 transition-transform duration-300 hover:scale-125 hover:rotate-12" />
            <h3 className="text-lg font-semibold mb-2">Compete & Learn</h3>
            <p className="text-muted-foreground text-sm">Challenge yourself and compete on the global leaderboard</p>
          </div>

          <div className="p-6 rounded-lg border border-border bg-card/50 hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20 animate-in fade-in slide-in-from-right duration-500 delay-300">
            <Code2 className="w-8 h-8 text-primary mb-4 transition-transform duration-300 hover:scale-125 hover:rotate-12" />
            <h3 className="text-lg font-semibold mb-2">Expert Content</h3>
            <p className="text-muted-foreground text-sm">Curated questions from industry experts and professionals</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <img src="/acm-logo.png" alt="ACM Chapter" className="w-16 h-16 object-contain" width={64} height={64} />
              <span className="text-sm text-muted-foreground">Powered by ACM Chapter</span>
            </div>
            <p className="text-center text-muted-foreground text-sm">© 2025 frostByte Contest. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
