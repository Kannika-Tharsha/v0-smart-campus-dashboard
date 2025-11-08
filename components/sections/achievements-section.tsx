"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const achievements = [
  {
    id: 1,
    student: "Aisha Kumar",
    title: "National Science Olympiad Gold",
    date: "Nov 2024",
    category: "Academic",
    points: 500,
  },
  {
    id: 2,
    student: "Raj Patel",
    title: "Campus Coding Championship Winner",
    date: "Nov 2024",
    category: "Competition",
    points: 400,
  },
  {
    id: 3,
    student: "Emma Johnson",
    title: "Community Service Excellence",
    date: "Oct 2024",
    category: "Service",
    points: 300,
  },
  {
    id: 4,
    student: "Marcus Chen",
    title: "Sports Excellence - Basketball",
    date: "Oct 2024",
    category: "Sports",
    points: 350,
  },
]

const categoryColors: Record<string, string> = {
  Academic: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  Competition: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  Service: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  Sports: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
}

export default function AchievementsSection() {
  return (
    <div>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">🏆 Recent Achievements</CardTitle>
      </CardHeader>
      <div className="space-y-3">
        {achievements.map((achievement) => (
          <Card key={achievement.id} className="hover:shadow-md transition-all">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    ⭐
                    <Badge variant="secondary" className={categoryColors[achievement.category]}>
                      {achievement.category}
                    </Badge>
                  </div>
                  <p className="font-semibold text-foreground">{achievement.student}</p>
                  <p className="text-sm text-muted-foreground">{achievement.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{achievement.date}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{achievement.points}</div>
                  <p className="text-xs text-muted-foreground">Points</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
