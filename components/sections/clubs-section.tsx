"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const clubs = [
  {
    id: 1,
    name: "Tech Enthusiasts Club",
    members: 245,
    category: "Technology",
    image: "/tech-club.jpg",
    description: "Exploring latest technologies and innovations",
  },
  {
    id: 2,
    name: "Environmental Warriors",
    members: 187,
    category: "Environment",
    image: "/environmental-club.jpg",
    description: "Sustainability and green initiatives",
  },
  {
    id: 3,
    name: "Debate & Forensics",
    members: 156,
    category: "Academic",
    image: "/debate-club.jpg",
    description: "Competitive debate and public speaking",
  },
  {
    id: 4,
    name: "Creative Arts",
    members: 198,
    category: "Arts",
    image: "/art-club.png",
    description: "Visual arts, music, and creative expression",
  },
  {
    id: 5,
    name: "Entrepreneurship Hub",
    members: 132,
    category: "Business",
    image: "/business-club.jpg",
    description: "Startup ideas and business development",
  },
  {
    id: 6,
    name: "Sports & Fitness",
    members: 312,
    category: "Sports",
    image: "/vibrant-sports-club.png",
    description: "Athletic activities and wellness programs",
  },
]

export default function ClubsSection() {
  const [selectedClub, setSelectedClub] = useState(null)
  const [formData, setFormData] = useState({ name: "", email: "" })
  const [successMessage, setSuccessMessage] = useState("")

  const handleJoinClub = (e) => {
    e.preventDefault()

    if (!formData.name.trim() || !formData.email.trim()) {
      alert("Please fill in all fields")
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email address")
      return
    }

    setSuccessMessage(`Successfully joined ${selectedClub.name}! Welcome to our community.`)
    setFormData({ name: "", email: "" })

    // Reset everything after 2 seconds
    setTimeout(() => {
      setSelectedClub(null)
      setSuccessMessage("")
    }, 2000)
  }

  return (
    <div>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">👥 Student Clubs</CardTitle>
      </CardHeader>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clubs.map((club) => (
          <Card key={club.id} className="overflow-hidden group hover:shadow-lg transition-all">
            <div className="w-full h-40 bg-secondary/30 overflow-hidden">
              <img
                src={club.image || "/placeholder.svg"}
                alt={club.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <CardContent className="pt-6">
              <Badge variant="outline" className="mb-2">
                {club.category}
              </Badge>
              <h3 className="font-semibold text-foreground mb-1">{club.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{club.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">👥 {club.members} members</div>
                <button className="p-2 hover:bg-secondary rounded-lg transition-colors">❤️</button>
              </div>
              <button
                onClick={() => {
                  setSelectedClub(club)
                  setSuccessMessage("")
                }}
                className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
              >
                Join Club →
              </button>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedClub && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-sm">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div className="flex-1">
                <CardTitle className="text-lg">Join {selectedClub.name}</CardTitle>
              </div>
              <button
                onClick={() => {
                  setSelectedClub(null)
                  setSuccessMessage("")
                }}
                className="p-1 hover:bg-secondary rounded-lg transition-colors"
              >
                ✕
              </button>
            </CardHeader>
            <CardContent>
              {successMessage ? (
                <div className="space-y-4">
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <p className="text-green-800 dark:text-green-200 font-medium text-center">✓ {successMessage}</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedClub(null)
                      setSuccessMessage("")
                    }}
                    className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleJoinClub} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your full name"
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Enter your email"
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                  >
                    Confirm Joining
                  </button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
