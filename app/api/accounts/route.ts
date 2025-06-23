import { type NextRequest, NextResponse } from "next/server"
import { getAllAccounts, createAccount } from "@/lib/accounts"

export async function GET() {
  try {
    const accounts = await getAllAccounts()
    return NextResponse.json(accounts)
  } catch (error) {
    console.error("Error fetching accounts:", error)
    return NextResponse.json({ error: "Failed to fetch accounts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const accountData = await request.json()
    const newAccount = await createAccount(accountData)
    return NextResponse.json(newAccount)
  } catch (error) {
    console.error("Error creating account:", error)
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 })
  }
}
