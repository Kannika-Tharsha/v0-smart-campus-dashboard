"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import EventsSection from "./sections/events-section"
import AchievementsSection from "./sections/achievements-section"
import ClubsSection from "./sections/clubs-section"
import AnnouncementsSection from "./sections/announcements-section"
import ThemeSwitcher from "./theme-switcher"

interface CampusDashboardProps {
  theme: string
  setTheme: (theme: string) => void
  user?: { name: string; email: string; phone: string }
  onLogout?: () => void
}

export default function CampusDashboard({ theme, setTheme, user, onLogout }: CampusDashboardProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "events" | "achievements" | "clubs">("overview")

  const tabs = [
    { id: "overview", label: "Overview", icon: "📋" },
    { id: "events", label: "Events", icon: "📅" },
    { id: "achievements", label: "Achievements", icon: "🏆" },
    { id: "clubs", label: "Clubs", icon: "👥" },
  ] as const

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/95">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">SC</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Smart Campus</h1>
                <p className="text-sm text-muted-foreground">Digital Hub</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 bg-secondary/50 rounded-lg px-3 py-2">
                <span className="text-muted-foreground">🔍</span>
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent border-none outline-none text-sm text-foreground placeholder-muted-foreground w-32"
                />
              </div>
              <Button variant="ghost" size="icon">
                🔔
              </Button>
              <ThemeSwitcher currentTheme={theme} setTheme={setTheme} />

              {user && (
                <div className="flex items-center gap-3 pl-3 border-l border-border">
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-medium text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-sm font-semibold">
                    {user.name.charAt(0)}
                  </div>
                  <Button variant="ghost" size="icon" onClick={onLogout} title="Logout">
                    🚪
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-1 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all text-sm font-medium ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary/50"
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: "Active Events", value: "12", icon: "📅", color: "from-blue-500 to-blue-600" },
                { label: "Student Clubs", value: "28", icon: "👥", color: "from-purple-500 to-purple-600" },
                { label: "Achievements", value: "156", icon: "🏆", color: "from-amber-500 to-amber-600" },
                { label: "Announcements", value: "8", icon: "🔔", color: "from-pink-500 to-pink-600" },
              ].map((stat, i) => (
                <Card key={i} className="group hover:shadow-lg transition-all">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                        <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                      </div>
                      <div
                        className={`bg-gradient-to-br ${stat.color} p-3 rounded-lg group-hover:scale-110 transition-transform text-2xl`}
                      >
                        {stat.icon}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <EventsSection />
                <AchievementsSection />
              </div>
              <div>
                <AnnouncementsSection />
              </div>
            </div>
          </div>
        )}

        {activeTab === "events" && <EventsSection />}
        {activeTab === "achievements" && <AchievementsSection />}
        {activeTab === "clubs" && <ClubsSection />}
      </main>
    </div>
  )
}
