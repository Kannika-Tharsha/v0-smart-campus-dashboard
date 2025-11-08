const SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

interface TokenPayload {
  userId: string
  email: string
  role: string
}

export const generateToken = (payload: TokenPayload): string => {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }))
  const body = btoa(JSON.stringify(payload))
  const signature = btoa(JSON.stringify({ secret: SECRET }))
  return `${header}.${body}.${signature}`
}

export const verifyToken = (token: string): TokenPayload | null => {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) return null
    const payload = JSON.parse(atob(parts[1]))
    return payload as TokenPayload
  } catch {
    return null
  }
}

export const decodeToken = (token: string): TokenPayload | null => {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) return null
    return JSON.parse(atob(parts[1])) as TokenPayload
  } catch {
    return null
  }
}
