"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push("/dashboard")
    }
  }, [user, router])

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl text-center space-y-8">
        {/* Hero */}
        <div className="space-y-4">
          <div className="text-6xl font-bold">
            <span className="text-primary">🎓</span> Smart Campus
          </div>
          <h1 className="text-4xl font-bold text-foreground">Dashboard</h1>
          <p className="text-xl text-muted-foreground">
            Manage events, track achievements, and connect with campus clubs all in one place.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link href="/login">
            <Button className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90">Sign In</Button>
          </Link>
          <Link href="/signup">
            <Button variant="outline" className="w-full sm:w-auto bg-transparent">
              Create Account
            </Button>
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
          {[
            { icon: "📅", title: "Events", desc: "Discover and join campus events" },
            { icon: "🏆", title: "Achievements", desc: "Track your campus milestones" },
            { icon: "👥", title: "Clubs", desc: "Connect with student organizations" },
          ].map((feature, idx) => (
            <div key={idx} className="p-4 rounded-lg border border-border bg-card hover:shadow-md transition-shadow">
              <div className="text-3xl mb-2">{feature.icon}</div>
              <h3 className="font-semibold text-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
