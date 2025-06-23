import { type NextRequest, NextResponse } from "next/server"
import { getUserByCredentials } from "@/lib/simple-db"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    const user = getUserByCredentials(email, password)

    if (user) {
      return NextResponse.json({
        success: true,
        user,
        message: "Login exitoso",
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Credenciales incorrectas",
        },
        { status: 401 },
      )
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error en el servidor",
      },
      { status: 500 },
    )
  }
}
