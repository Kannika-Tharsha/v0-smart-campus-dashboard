"use client"

import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function AdminHeader() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <header className="bg-gray-900 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-lg flex items-center justify-center font-bold">
            A
          </div>
          <h1 className="text-2xl font-bold">EventHub Admin</h1>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/admin" className="hover:text-blue-400 font-medium">
            Dashboard
          </Link>
          <Link href="/admin/events" className="hover:text-blue-400 font-medium">
            Events
          </Link>
          <Link href="/admin/users" className="hover:text-blue-400 font-medium">
            Users
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-gray-400">Administrator</p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-white hover:bg-gray-800">
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}
