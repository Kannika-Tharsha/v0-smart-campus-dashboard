import { type NextRequest, NextResponse } from "next/server"
import { userDB } from "@/lib/db"
import { hashPassword } from "@/lib/password"
import { generateToken } from "@/lib/jwt"
import { validateEmail, validatePassword } from "@/lib/validation"

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, password, confirmPassword } = await req.json()

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!validateEmail(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    const pwValidation = validatePassword(password)
    if (!pwValidation.valid) {
      return NextResponse.json({ error: "Password validation failed", details: pwValidation.errors }, { status: 400 })
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match" }, { status: 400 })
    }

    // Check if user exists
    if (userDB.findByEmail(email)) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 })
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password)
    const user = userDB.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "user",
    })

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
