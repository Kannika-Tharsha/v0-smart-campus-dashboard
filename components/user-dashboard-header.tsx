"use client"

import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function UserDashboardHeader() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
            E
          </div>
          <h1 className="text-2xl font-bold text-gray-900">EventHub</h1>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-700 hover:text-gray-900 font-medium">
            Events
          </Link>
          <Link href="/my-events" className="text-gray-700 hover:text-gray-900 font-medium">
            My Events
          </Link>
          <Link href="/profile" className="text-gray-700 hover:text-gray-900 font-medium">
            Profile
          </Link>

          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
