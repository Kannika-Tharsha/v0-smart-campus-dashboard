"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import ProtectedLayout from "@/components/protected-layout"
import UserDashboardHeader from "@/components/user-dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle } from "lucide-react"

interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string
  bio?: string
  profilePicture?: string
  createdAt: string
}

interface Activity {
  id: string
  action: string
  description: string
  timestamp: string
}

export default function ProfilePage() {
  const { user, token } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    phone: "",
    profilePicture: "",
  })

  useEffect(() => {
    if (!user || !token) return

    const fetchProfile = async () => {
      try {
        // Fetch user profile
        const profileRes = await fetch(`/api/users/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!profileRes.ok) throw new Error("Failed to fetch profile")
        const { user: userProfile } = await profileRes.json()
        setProfile(userProfile)
        setFormData({
          name: userProfile.name,
          bio: userProfile.bio || "",
          phone: userProfile.phone || "",
          profilePicture: userProfile.profilePicture || "",
        })

        // Fetch activity history
        const activityRes = await fetch(`/api/users/${user.id}/activity`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (activityRes.ok) {
          const { activities } = await activityRes.json()
          setActivities(activities)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user, token])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target?.result as string
      setFormData({ ...formData, profilePicture: base64 })
    }
    reader.readAsDataURL(file)
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token || !user) return

    try {
      setError("")
      setSuccess("")

      const res = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error("Failed to update profile")

      const { user: updated } = await res.json()
      setProfile(updated)
      setSuccess("Profile updated successfully!")
      setEditing(false)
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile")
    }
  }

  return (
    <ProtectedLayout>
      <UserDashboardHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="lg:col-span-1">
            {loading ? (
              <Card>
                <CardContent className="pt-6 text-center py-12">
                  <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading profile...</p>
                </CardContent>
              </Card>
            ) : profile ? (
              <Card>
                <CardHeader className="text-center">
                  <div className="mb-4 flex justify-center">
                    {formData.profilePicture ? (
                      <img
                        src={formData.profilePicture || "/placeholder.svg"}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover border-4 border-blue-200"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold">
                        {profile.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <CardTitle>{profile.name}</CardTitle>
                  <CardDescription className="capitalize">{profile.email}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm">
                    <p className="text-gray-500">Phone</p>
                    <p className="font-medium">{profile.phone || "Not provided"}</p>
                  </div>
                  <div className="text-sm">
                    <p className="text-gray-500">Bio</p>
                    <p className="font-medium">{profile.bio || "No bio added"}</p>
                  </div>
                  <div className="text-sm">
                    <p className="text-gray-500">Member Since</p>
                    <p className="font-medium">{new Date(profile.createdAt).toLocaleDateString()}</p>
                  </div>
                  <Button onClick={() => setEditing(!editing)} className="w-full mt-4">
                    {editing ? "Cancel" : "Edit Profile"}
                  </Button>
                </CardContent>
              </Card>
            ) : null}
          </div>

          {/* Edit Form and Activity */}
          <div className="lg:col-span-2 space-y-8">
            {editing && (
              <Card>
                <CardHeader>
                  <CardTitle>Edit Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    {success && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3 text-green-700">
                        <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <span>{success}</span>
                      </div>
                    )}

                    {error && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3 text-red-700">
                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <span>{error}</span>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        rows={3}
                        placeholder="Tell us about yourself..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="profile-pic">Profile Picture</Label>
                      <Input id="profile-pic" type="file" accept="image/*" onChange={handleFileUpload} />
                      {formData.profilePicture && (
                        <p className="text-sm text-green-600">Image selected and ready to upload</p>
                      )}
                    </div>

                    <Button type="submit" className="w-full">
                      Save Changes
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Activity History */}
            <Card>
              <CardHeader>
                <CardTitle>Activity History</CardTitle>
                <CardDescription>Your recent actions on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                {activities.length === 0 ? (
                  <p className="text-center py-6 text-gray-600">No activities yet</p>
                ) : (
                  <div className="space-y-4">
                    {activities.map((activity) => (
                      <div key={activity.id} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 capitalize">{activity.action}</p>
                          <p className="text-sm text-gray-600">{activity.description}</p>
                          <p className="text-xs text-gray-500 mt-1">{new Date(activity.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </ProtectedLayout>
  )
}
