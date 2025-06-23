import { type NextRequest, NextResponse } from "next/server"
import { getAccountByCredentials } from "@/lib/accounts"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    const user = await getAccountByCredentials(email, password)

    if (user) {
      return NextResponse.json({ user })
    } else {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
