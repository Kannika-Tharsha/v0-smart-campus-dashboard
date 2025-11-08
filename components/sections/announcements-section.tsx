"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const announcements = [
  {
    id: 1,
    title: "Campus Closed for Maintenance",
    date: "Dec 10",
    priority: "high",
    type: "Notice",
  },
  {
    id: 2,
    title: "New Library Wing Opening",
    date: "Dec 8",
    priority: "normal",
    type: "Update",
  },
  {
    id: 3,
    title: "Scholarship Application Deadline",
    date: "Dec 5",
    priority: "high",
    type: "Alert",
  },
  {
    id: 4,
    title: "Career Fair - Register Now",
    date: "Dec 3",
    priority: "normal",
    type: "Opportunity",
  },
]

export default function AnnouncementsSection() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">🔔 Announcements</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {announcements.map((announcement) => (
            <div
              key={announcement.id}
              className={`p-4 rounded-lg border transition-colors ${
                announcement.priority === "high"
                  ? "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800"
                  : "bg-secondary/50 border-border"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0 mt-0.5">{announcement.priority === "high" ? "⚠️" : "⏰"}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm text-foreground truncate">{announcement.title}</h4>
                    <Badge variant="outline" className="text-xs flex-shrink-0">
                      {announcement.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{announcement.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
