"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft } from "lucide-react"
import type { Account } from "@/types/bank"

interface CreateAccountFormProps {
  onCreateAccount: (account: Account) => void
  onCancel: () => void
  existingAccounts: Account[]
}

export default function CreateAccountForm({ onCreateAccount, onCancel, existingAccounts }: CreateAccountFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    initialBalance: "0",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const generateAccountNumber = () => {
    const prefix = "4001"
    const random = Math.floor(Math.random() * 100000000)
      .toString()
      .padStart(8, "0")
    return `${prefix}-${random.slice(0, 4)}-${random.slice(4)}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Validaciones
    if (existingAccounts.some((acc) => acc.email === formData.email)) {
      setError("Ya existe una cuenta con este email")
      setLoading(false)
      return
    }

    const newAccount: Account = {
      id: Date.now().toString(),
      accountNumber: generateAccountNumber(),
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
      role: "user",
      balance: Number.parseFloat(formData.initialBalance),
      movements:
        formData.initialBalance !== "0"
          ? [
              {
                id: "1",
                type: "deposit",
                amount: Number.parseFloat(formData.initialBalance),
                description: "Depósito inicial",
                date: new Date().toISOString(),
                balance: Number.parseFloat(formData.initialBalance),
              },
            ]
          : [],
      credits: [],
      loans: [],
    }

    await new Promise((resolve) => setTimeout(resolve, 1000))
    onCreateAccount(newAccount)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Button variant="outline" onClick={onCancel}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Crear Nueva Cuenta</CardTitle>
            <CardDescription>Complete la información para crear una nueva cuenta de usuario</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nombre Completo</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="initialBalance">Balance Inicial</Label>
                <Input
                  id="initialBalance"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.initialBalance}
                  onChange={(e) => setFormData({ ...formData, initialBalance: e.target.value })}
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex space-x-4">
                <Button type="submit" className="flex-1 bg-red-600 hover:bg-red-700" disabled={loading}>
                  {loading ? "Creando..." : "Crear Cuenta"}
                </Button>
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
