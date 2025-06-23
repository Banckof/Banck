"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, ArrowUpRight, ArrowDownLeft, CreditCard, Banknote, TrendingUp, TrendingDown } from "lucide-react"
import type { Account, Movement, Credit, Loan } from "@/types/bank"

interface AccountDetailsProps {
  account: Account
  onBack: () => void
  onUpdateAccount: (account: Account) => void
}

export default function AccountDetails({ account, onBack, onUpdateAccount }: AccountDetailsProps) {
  const [newMovement, setNewMovement] = useState({
    type: "deposit" as "deposit" | "withdrawal",
    amount: "",
    description: "",
  })
  const [newCredit, setNewCredit] = useState({
    amount: "",
    limit: "",
    interestRate: "",
  })
  const [newLoan, setNewLoan] = useState({
    amount: "",
    interestRate: "",
    term: "",
  })

  const handleAddMovement = () => {
    if (!newMovement.amount || !newMovement.description) return

    const amount = Number.parseFloat(newMovement.amount)
    const newBalance = newMovement.type === "deposit" ? account.balance + amount : account.balance - amount

    if (newBalance < 0) {
      alert("Balance insuficiente para realizar el retiro")
      return
    }

    const movement: Movement = {
      id: Date.now().toString(),
      type: newMovement.type,
      amount,
      description: newMovement.description,
      date: new Date().toISOString(),
      balance: newBalance,
    }

    const updatedAccount = {
      ...account,
      balance: newBalance,
      movements: [...account.movements, movement],
    }

    onUpdateAccount(updatedAccount)
    setNewMovement({ type: "deposit", amount: "", description: "" })
  }

  const handleAddCredit = () => {
    if (!newCredit.amount || !newCredit.limit || !newCredit.interestRate) return

    const credit: Credit = {
      id: Date.now().toString(),
      amount: Number.parseFloat(newCredit.amount),
      limit: Number.parseFloat(newCredit.limit),
      interestRate: Number.parseFloat(newCredit.interestRate),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: "active",
    }

    const updatedAccount = {
      ...account,
      credits: [...account.credits, credit],
    }

    onUpdateAccount(updatedAccount)
    setNewCredit({ amount: "", limit: "", interestRate: "" })
  }

  const handleAddLoan = () => {
    if (!newLoan.amount || !newLoan.interestRate || !newLoan.term) return

    const amount = Number.parseFloat(newLoan.amount)
    const rate = Number.parseFloat(newLoan.interestRate) / 100 / 12
    const term = Number.parseInt(newLoan.term)
    const monthlyPayment = (amount * rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1)

    const loan: Loan = {
      id: Date.now().toString(),
      amount,
      interestRate: Number.parseFloat(newLoan.interestRate),
      term,
      monthlyPayment,
      remainingBalance: amount,
      status: "active",
      startDate: new Date().toISOString(),
    }

    const updatedAccount = {
      ...account,
      loans: [...account.loans, loan],
    }

    onUpdateAccount(updatedAccount)
    setNewLoan({ amount: "", interestRate: "", term: "" })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Información de la Cuenta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Nombre Completo</p>
                  <p className="font-medium">{account.fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Número de Cuenta</p>
                  <p className="font-medium">{account.accountNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{account.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Balance Actual</p>
                  <p className="text-2xl font-bold text-green-600">${account.balance.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Rol</p>
                  <Badge variant="secondary">{account.role === "admin" ? "Administrador" : "Usuario"}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Historial de Movimientos</CardTitle>
                <CardDescription>Últimas transacciones de la cuenta</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {account.movements.map((movement) => (
                    <div key={movement.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {movement.type === "deposit" ? (
                          <ArrowDownLeft className="h-5 w-5 text-green-600" />
                        ) : (
                          <ArrowUpRight className="h-5 w-5 text-red-600" />
                        )}
                        <div>
                          <p className="font-medium">{movement.description}</p>
                          <p className="text-sm text-gray-600">{new Date(movement.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${movement.type === "deposit" ? "text-green-600" : "text-red-600"}`}>
                          {movement.type === "deposit" ? "+" : "-"}${movement.amount.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">Saldo: ${movement.balance.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                  {account.movements.length === 0 && (
                    <div className="text-center py-8 text-gray-500">No hay movimientos registrados</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Tabs defaultValue="movements" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="movements">Movimientos</TabsTrigger>
                <TabsTrigger value="credits">Créditos</TabsTrigger>
                <TabsTrigger value="loans">Préstamos</TabsTrigger>
                <TabsTrigger value="actions">Acciones</TabsTrigger>
              </TabsList>

              <TabsContent value="movements">
                <Card>
                  <CardHeader>
                    <CardTitle>Historial de Movimientos</CardTitle>
                    <CardDescription>Todos los movimientos de la cuenta</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {account.movements.map((movement) => (
                        <div key={movement.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            {movement.type === "deposit" ? (
                              <TrendingUp className="h-5 w-5 text-green-600" />
                            ) : (
                              <TrendingDown className="h-5 w-5 text-red-600" />
                            )}
                            <div>
                              <p className="font-medium">{movement.description}</p>
                              <p className="text-sm text-gray-600">{new Date(movement.date).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p
                              className={`font-bold ${movement.type === "deposit" ? "text-green-600" : "text-red-600"}`}
                            >
                              {movement.type === "deposit" ? "+" : "-"}${movement.amount.toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-600">Balance: ${movement.balance.toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                      {account.movements.length === 0 && (
                        <div className="text-center py-8 text-gray-500">No hay movimientos registrados</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="credits">
                <Card>
                  <CardHeader>
                    <CardTitle>Créditos</CardTitle>
                    <CardDescription>Créditos asignados a la cuenta</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {account.credits.map((credit) => (
                        <div key={credit.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <CreditCard className="h-5 w-5 text-blue-600" />
                            <div>
                              <p className="font-medium">Crédito ${credit.amount.toLocaleString()}</p>
                              <p className="text-sm text-gray-600">
                                Límite: ${credit.limit.toLocaleString()} | Tasa: {credit.interestRate}%
                              </p>
                            </div>
                          </div>
                          <Badge variant={credit.status === "active" ? "default" : "secondary"}>
                            {credit.status === "active" ? "Activo" : credit.status}
                          </Badge>
                        </div>
                      ))}
                      {account.credits.length === 0 && (
                        <div className="text-center py-8 text-gray-500">No hay créditos asignados</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="loans">
                <Card>
                  <CardHeader>
                    <CardTitle>Préstamos</CardTitle>
                    <CardDescription>Préstamos asignados a la cuenta</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {account.loans.map((loan) => (
                        <div key={loan.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <Banknote className="h-5 w-5 text-orange-600" />
                            <div>
                              <p className="font-medium">Préstamo ${loan.amount.toLocaleString()}</p>
                              <p className="text-sm text-gray-600">
                                Cuota mensual: ${loan.monthlyPayment.toFixed(2)} | Plazo: {loan.term} meses
                              </p>
                              <p className="text-sm text-gray-600">
                                Saldo restante: ${loan.remainingBalance.toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <Badge variant={loan.status === "active" ? "default" : "secondary"}>
                            {loan.status === "active" ? "Activo" : loan.status}
                          </Badge>
                        </div>
                      ))}
                      {account.loans.length === 0 && (
                        <div className="text-center py-8 text-gray-500">No hay préstamos asignados</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="actions" className="space-y-6">
                {/* Add Movement */}
                <Card>
                  <CardHeader>
                    <CardTitle>Agregar Movimiento</CardTitle>
                    <CardDescription>Registrar depósito o retiro</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <Label>Tipo</Label>
                        <select
                          className="w-full p-2 border rounded"
                          value={newMovement.type}
                          onChange={(e) =>
                            setNewMovement((prev) => ({ ...prev, type: e.target.value as "deposit" | "withdrawal" }))
                          }
                        >
                          <option value="deposit">Depósito</option>
                          <option value="withdrawal">Retiro</option>
                        </select>
                      </div>
                      <div>
                        <Label>Monto</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={newMovement.amount}
                          onChange={(e) => setNewMovement((prev) => ({ ...prev, amount: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label>Descripción</Label>
                        <Input
                          value={newMovement.description}
                          onChange={(e) => setNewMovement((prev) => ({ ...prev, description: e.target.value }))}
                        />
                      </div>
                      <div className="flex items-end">
                        <Button onClick={handleAddMovement} className="w-full">
                          <ArrowUpRight className="h-4 w-4 mr-2" />
                          Agregar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Add Credit */}
                <Card>
                  <CardHeader>
                    <CardTitle>Asignar Crédito</CardTitle>
                    <CardDescription>Crear nuevo crédito para la cuenta</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <Label>Monto</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={newCredit.amount}
                          onChange={(e) => setNewCredit((prev) => ({ ...prev, amount: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label>Límite</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={newCredit.limit}
                          onChange={(e) => setNewCredit((prev) => ({ ...prev, limit: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label>Tasa de Interés (%)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={newCredit.interestRate}
                          onChange={(e) => setNewCredit((prev) => ({ ...prev, interestRate: e.target.value }))}
                        />
                      </div>
                      <div className="flex items-end">
                        <Button onClick={handleAddCredit} className="w-full">
                          <ArrowUpRight className="h-4 w-4 mr-2" />
                          Asignar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Add Loan */}
                <Card>
                  <CardHeader>
                    <CardTitle>Asignar Préstamo</CardTitle>
                    <CardDescription>Crear nuevo préstamo para la cuenta</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <Label>Monto</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={newLoan.amount}
                          onChange={(e) => setNewLoan((prev) => ({ ...prev, amount: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label>Tasa de Interés (%)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={newLoan.interestRate}
                          onChange={(e) => setNewLoan((prev) => ({ ...prev, interestRate: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label>Plazo (meses)</Label>
                        <Input
                          type="number"
                          value={newLoan.term}
                          onChange={(e) => setNewLoan((prev) => ({ ...prev, term: e.target.value }))}
                        />
                      </div>
                      <div className="flex items-end">
                        <Button onClick={handleAddLoan} className="w-full">
                          <ArrowUpRight className="h-4 w-4 mr-2" />
                          Asignar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
