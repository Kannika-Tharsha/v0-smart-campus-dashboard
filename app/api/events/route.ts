import { type NextRequest, NextResponse } from "next/server"
import { eventDB } from "@/lib/db"
import { decodeToken } from "@/lib/jwt"

export async function GET() {
  try {
    const events = eventDB.getAll()
    return NextResponse.json({ events })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payload = decodeToken(token)
    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 })
    }

    const { title, description, date, time, location, category, price, capacity } = await req.json()

    const event = eventDB.create({
      title,
      description,
      date,
      time,
      location,
      category,
      price,
      capacity,
      attendees: 0,
      createdBy: payload.userId,
    })

    return NextResponse.json({ event }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
