"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import CampusDashboard from "@/components/campus-dashboard"

export default function DashboardPage() {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark" | "vibrant" | "professional">("light")

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-primary text-4xl">⏳</div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <ThemeProvider theme={currentTheme} setTheme={setCurrentTheme}>
      <CampusDashboard theme={currentTheme} setTheme={setCurrentTheme} user={user} onLogout={logout} />
    </ThemeProvider>
  )
}
