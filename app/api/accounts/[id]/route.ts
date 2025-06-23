import { type NextRequest, NextResponse } from "next/server"
import { updateAccount, deleteAccount } from "@/lib/accounts"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const accountData = await request.json()
    await updateAccount(accountData)
    return NextResponse.json({ message: "Account updated successfully" })
  } catch (error) {
    console.error("Error updating account:", error)
    return NextResponse.json({ error: "Failed to update account" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await deleteAccount(params.id)
    return NextResponse.json({ message: "Account deleted successfully" })
  } catch (error) {
    console.error("Error deleting account:", error)
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 })
  }
}
