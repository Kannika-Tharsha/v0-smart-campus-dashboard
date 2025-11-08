"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import TeamRegistrationModal from "@/components/team-registration-modal"

const events = [
  {
    id: 1,
    title: "Annual Tech Summit 2025",
    date: "Dec 15",
    time: "2:00 PM",
    location: "Main Auditorium",
    attendees: 450,
    category: "Conference",
    image: "/tech-summit-conference.jpg",
    description:
      "Join us for an exciting day of tech talks, networking, and product launches. Learn from industry leaders about the latest trends in AI, cloud computing, and web development.",
    members: 450,
    price: 499,
  },
  {
    id: 2,
    title: "Sports Day Finals",
    date: "Dec 18",
    time: "10:00 AM",
    location: "Sports Complex",
    attendees: 800,
    category: "Sports",
    image: "/sports-day-event.jpg",
    description:
      "Witness the most competitive sports events of the season. Watch our athletes compete in various sports including basketball, volleyball, badminton, and track & field. Cheer for your house!",
    members: 800,
    price: 299,
  },
  {
    id: 3,
    title: "Cultural Night",
    date: "Dec 20",
    time: "6:00 PM",
    location: "Open Amphitheatre",
    attendees: 600,
    category: "Cultural",
    image: "/cultural-night-event.jpg",
    description:
      "Experience the vibrant campus culture through music, dance, drama, and fashion show. Featuring performances from student clubs and international cultural groups.",
    members: 600,
    price: 199,
  },
]

export default function EventsSection() {
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [registeredEvents, setRegisteredEvents] = useState<number[]>([])
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showRegistrationModal, setShowRegistrationModal] = useState(false)

  const handleRegistrationSuccess = () => {
    if (selectedEvent) {
      setRegisteredEvents([...registeredEvents, (selectedEvent as any).id])
      setShowRegistrationModal(false)
    }
  }

  return (
    <div>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">📅 Upcoming Events</CardTitle>
      </CardHeader>
      <div className="space-y-4">
        {events.map((event) => (
          <Card
            key={event.id}
            className={`overflow-hidden hover:shadow-lg transition-all ${
              registeredEvents.includes(event.id) ? "border-green-500/50 bg-green-50/5" : ""
            }`}
          >
            <div className="flex flex-col sm:flex-row">
              <div className="w-full sm:w-32 h-32 bg-secondary/30 flex-shrink-0 overflow-hidden">
                <img
                  src={event.image || "/placeholder.svg"}
                  alt={event.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              </div>
              <CardContent className="flex-1 pt-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{event.category}</Badge>
                      {registeredEvents.includes(event.id) && (
                        <Badge className="bg-green-500/80 text-white">Registered ✓</Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{event.title}</h3>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        📅 {event.date} at {event.time}
                      </div>
                      <div className="flex items-center gap-2">📍 {event.location}</div>
                      <div className="flex items-center gap-2">👥 {event.attendees} expected attendees</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedEvent(event)
                      setShowDetailModal(true)
                    }}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium whitespace-nowrap"
                  >
                    Learn More
                  </button>
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>

      {/* Event Details Modal */}
      {showDetailModal && selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div className="flex-1">
                <CardTitle>{(selectedEvent as any).title}</CardTitle>
              </div>
              <button
                onClick={() => {
                  setShowDetailModal(false)
                  setSelectedEvent(null)
                }}
                className="p-1 hover:bg-secondary rounded-lg transition-colors"
              >
                ✕
              </button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="w-full h-48 bg-secondary/30 rounded-lg overflow-hidden">
                <img
                  src={(selectedEvent as any).image || "/placeholder.svg"}
                  alt={(selectedEvent as any).title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Event Details</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    📅{" "}
                    <span>
                      {(selectedEvent as any).date} at {(selectedEvent as any).time}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    📍 <span>{(selectedEvent as any).location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    👥 <span>{(selectedEvent as any).members} members attending</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">About Event</h4>
                <p className="text-sm text-muted-foreground">{(selectedEvent as any).description}</p>
              </div>
              <div className="bg-secondary/50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">Entry Fee</span>
                  <span className="text-lg font-bold text-primary">₹{(selectedEvent as any).price}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowDetailModal(false)
                  setShowRegistrationModal(true)
                }}
                disabled={registeredEvents.includes((selectedEvent as any).id)}
                className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                  registeredEvents.includes((selectedEvent as any).id)
                    ? "bg-green-500/20 text-green-700 cursor-not-allowed"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
              >
                {registeredEvents.includes((selectedEvent as any).id) ? "Already Registered ✓" : "Register Now"}
              </button>
            </CardContent>
          </Card>
        </div>
      )}

      <TeamRegistrationModal
        event={selectedEvent}
        isOpen={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
        onSuccess={handleRegistrationSuccess}
      />
    </div>
  )
}
