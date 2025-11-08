export interface User {
  id: string
  name: string
  email: string
  phone?: string
  password: string
  role: "user" | "admin"
  profilePicture?: string
  bio?: string
  createdAt: Date
  updatedAt: Date
}

export interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  category: string
  price: number
  capacity: number
  attendees: number
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface EventAttendance {
  id: string
  userId: string
  eventId: string
  registeredAt: Date
}

export interface ActivityLog {
  id: string
  userId: string
  action: string
  description: string
  timestamp: Date
}

// In-memory storage
const users: User[] = []
let events: Event[] = []
let eventAttendances: EventAttendance[] = []
const activityLogs: ActivityLog[] = []

export const userDB = {
  create: (user: Omit<User, "id" | "createdAt" | "updatedAt">) => {
    const newUser: User = {
      ...user,
      id: Math.random().toString(36).substring(7),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    users.push(newUser)
    return newUser
  },
  findByEmail: (email: string) => users.find((u) => u.email === email),
  findById: (id: string) => users.find((u) => u.id === id),
  update: (id: string, data: Partial<User>) => {
    const user = users.find((u) => u.id === id)
    if (user) {
      Object.assign(user, data, { updatedAt: new Date() })
      return user
    }
    return null
  },
  getAll: () => users,
}

export const eventDB = {
  create: (event: Omit<Event, "id" | "createdAt" | "updatedAt">) => {
    const newEvent: Event = {
      ...event,
      id: Math.random().toString(36).substring(7),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    events.push(newEvent)
    return newEvent
  },
  findById: (id: string) => events.find((e) => e.id === id),
  getAll: () => events,
  update: (id: string, data: Partial<Event>) => {
    const event = events.find((e) => e.id === id)
    if (event) {
      Object.assign(event, data, { updatedAt: new Date() })
      return event
    }
    return null
  },
  delete: (id: string) => {
    events = events.filter((e) => e.id !== id)
  },
}

export const attendanceDB = {
  create: (attendance: Omit<EventAttendance, "id">) => {
    const newAttendance: EventAttendance = {
      ...attendance,
      id: Math.random().toString(36).substring(7),
    }
    eventAttendances.push(newAttendance)
    return newAttendance
  },
  findByUserAndEvent: (userId: string, eventId: string) =>
    eventAttendances.find((a) => a.userId === userId && a.eventId === eventId),
  getByUserId: (userId: string) => eventAttendances.filter((a) => a.userId === userId),
  getByEventId: (eventId: string) => eventAttendances.filter((a) => a.eventId === eventId),
  delete: (id: string) => {
    eventAttendances = eventAttendances.filter((a) => a.id !== id)
  },
}

export const activityDB = {
  create: (log: Omit<ActivityLog, "id" | "timestamp">) => {
    const newLog: ActivityLog = {
      ...log,
      id: Math.random().toString(36).substring(7),
      timestamp: new Date(),
    }
    activityLogs.push(newLog)
    return newLog
  },
  getByUserId: (userId: string) => activityLogs.filter((a) => a.userId === userId).slice(-10),
}
