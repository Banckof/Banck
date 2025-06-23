"use client"

import { useState, useEffect } from "react"
import LoginForm from "@/components/login-form"
import AdminDashboard from "@/components/admin-dashboard"
import UserDashboard from "@/components/user-dashboard"
import type { User, Account } from "@/types/bank"

export default function BankOfAmericaApp() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)

  // Inicializar base de datos //
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Inicializar base de datos
        await fetch("/api/init-db")

        // Cargar cuentas
        await loadAccounts()
      } catch (error) {
        console.error("Error initializing app:", error)
      } finally {
        setLoading(false)
      }
    }

    initializeApp()
  }, [])

  const loadAccounts = async () => {
    try {
      const response = await fetch("/api/accounts")
      if (response.ok) {
        const accountsData = await response.json()
        setAccounts(accountsData)
      }
    } catch (error) {
      console.error("Error loading accounts:", error)
    }
  }

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const { user } = await response.json()
        setCurrentUser(user)
        return true
      }
      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const handleLogout = () => {
    setCurrentUser(null)
  }

  const updateAccounts = async (newAccounts: Account[]) => {
    setAccounts(newAccounts)
    // Recargar desde la base de datos para mantener sincronización
    await loadAccounts()

    // Actualizar usuario actual si fue modificado
    if (currentUser) {
      const updatedCurrentUser = newAccounts.find((acc) => acc.id === currentUser.id)
      if (updatedCurrentUser) {
        setCurrentUser(updatedCurrentUser)
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando Bank of America...</p>
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return <LoginForm onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {currentUser.role === "admin" ? (
        <AdminDashboard
          currentUser={currentUser}
          accounts={accounts}
          onUpdateAccounts={updateAccounts}
          onLogout={handleLogout}
        />
      ) : (
        <UserDashboard
          currentUser={currentUser}
          accounts={accounts}
          onUpdateAccounts={updateAccounts}
          onLogout={handleLogout}
        />
      )}
    </div>
  )
}
