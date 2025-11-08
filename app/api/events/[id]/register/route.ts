import { type NextRequest, NextResponse } from "next/server"
import { eventDB, attendanceDB, activityDB } from "@/lib/db"
import { decodeToken } from "@/lib/jwt"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payload = decodeToken(token)
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const event = eventDB.findById(params.id)
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    const existing = attendanceDB.findByUserAndEvent(payload.userId, params.id)
    if (existing) {
      return NextResponse.json({ error: "Already registered for this event" }, { status: 409 })
    }

    if (event.attendees >= event.capacity) {
      return NextResponse.json({ error: "Event is full" }, { status: 400 })
    }

    const attendance = attendanceDB.create({
      userId: payload.userId,
      eventId: params.id,
      registeredAt: new Date(),
    })

    eventDB.update(params.id, {
      attendees: event.attendees + 1,
    })

    activityDB.create({
      userId: payload.userId,
      action: "registered",
      description: `Registered for event: ${event.title}`,
    })

    return NextResponse.json({ message: "Successfully registered for event", attendance }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
