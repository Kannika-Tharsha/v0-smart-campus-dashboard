"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import ProtectedLayout from "@/components/protected-layout"
import AdminHeader from "@/components/admin-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, TrendingUp, AlertCircle } from "lucide-react"

export default function AdminDashboard() {
  const { token } = useAuth()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    totalRegistrations: 0,
    totalRevenue: 0,
  })
  const [recentEvents, setRecentEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) return

    const fetchStats = async () => {
      try {
        // Fetch users
        const usersRes = await fetch("/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const usersData = usersRes.ok ? await usersRes.json() : {}

        // Fetch events
        const eventsRes = await fetch("/api/events", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const eventsData = eventsRes.ok ? await eventsRes.json() : {}

        const users = usersData.users || []
        const events = eventsData.events || []

        // Calculate stats
        const totalRegistrations = events.reduce((sum, e) => sum + e.attendees, 0)
        const totalRevenue = events.reduce((sum, e) => sum + e.price * e.attendees, 0)

        setStats({
          totalUsers: users.length,
          totalEvents: events.length,
          totalRegistrations,
          totalRevenue,
        })

        setRecentEvents(events.slice(0, 5))
      } catch (err) {
        console.error("Failed to fetch stats:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [token])

  return (
    <ProtectedLayout requireAdmin>
      <AdminHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h2>
          <p className="text-gray-600">Overview of your event management platform</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading analytics...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="w-4 h-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                  <p className="text-xs text-gray-500">Registered users</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                  <Calendar className="w-4 h-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalEvents}</div>
                  <p className="text-xs text-gray-500">Active events</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Registrations</CardTitle>
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalRegistrations}</div>
                  <p className="text-xs text-gray-500">Total sign-ups</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                  <AlertCircle className="w-4 h-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</div>
                  <p className="text-xs text-gray-500">From paid events</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Events Table */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Events</CardTitle>
                <CardDescription>Latest events created on your platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Event</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Category</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Price</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Attendees</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentEvents.map((event: any) => (
                        <tr key={event.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium text-gray-900 max-w-xs truncate">{event.title}</td>
                          <td className="py-3 px-4 text-gray-600">{event.category}</td>
                          <td className="py-3 px-4 text-gray-600">₹{event.price}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                              {event.attendees}/{event.capacity}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-medium text-green-600">
                            ₹{(event.price * event.attendees).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </ProtectedLayout>
  )
}
