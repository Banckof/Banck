"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Building2,
  LogOut,
  CreditCard,
  Banknote,
  ArrowUpRight,
  ArrowDownLeft,
  QrCode,
  Smartphone,
  FileText,
  Shield,
} from "lucide-react"
import type { Account, User } from "@/types/bank"

interface UserDashboardProps {
  currentUser: User
  accounts: Account[]
  onUpdateAccounts: (accounts: Account[]) => void
  onLogout: () => void
}

export default function UserDashboard({ currentUser, accounts, onUpdateAccounts, onLogout }: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-red-600 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-red-600">Bank of America</h1>
                <p className="text-sm text-gray-600">Banca Digital</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Hola, {currentUser.fullName}</span>
              <Button variant="outline" onClick={onLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="services">Servicios</TabsTrigger>
            <TabsTrigger value="products">Productos</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Saldo Disponible</CardTitle>
                  <CardDescription>Cuenta: {currentUser.accountNumber}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">${currentUser.balance.toLocaleString()}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Mis Créditos</CardTitle>
                  <CardDescription>Límite disponible</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">
                    ${currentUser.credits.reduce((sum, credit) => sum + credit.amount, 0).toLocaleString()}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Préstamos</CardTitle>
                  <CardDescription>Saldo pendiente</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600">
                    ${currentUser.loans.reduce((sum, loan) => sum + loan.remainingBalance, 0).toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Movimientos Recientes</CardTitle>
                <CardDescription>Últimas transacciones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentUser.movements.slice(-5).map((movement) => (
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
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <ArrowUpRight className="h-8 w-8 text-blue-600 mb-2" />
                  <CardTitle>Transferir</CardTitle>
                  <CardDescription>Envía dinero a otras cuentas</CardDescription>
                </CardHeader>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <QrCode className="h-8 w-8 text-purple-600 mb-2" />
                  <CardTitle>Pagar con QR</CardTitle>
                  <CardDescription>Pagos rápidos y seguros</CardDescription>
                </CardHeader>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Smartphone className="h-8 w-8 text-green-600 mb-2" />
                  <CardTitle>Recargas</CardTitle>
                  <CardDescription>Recarga tu celular</CardDescription>
                </CardHeader>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <FileText className="h-8 w-8 text-orange-600 mb-2" />
                  <CardTitle>Paz y Salvo</CardTitle>
                  <CardDescription>Certificados y constancias</CardDescription>
                </CardHeader>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Shield className="h-8 w-8 text-red-600 mb-2" />
                  <CardTitle>Certificados</CardTitle>
                  <CardDescription>Documentos oficiales</CardDescription>
                </CardHeader>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Banknote className="h-8 w-8 text-yellow-600 mb-2" />
                  <CardTitle>Retirar sin Tarjeta</CardTitle>
                  <CardDescription>Retiros con código</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-6 w-6 mr-2 text-blue-600" />
                    Tarjetas de Crédito
                  </CardTitle>
                  <CardDescription>Gestiona tus tarjetas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {currentUser.credits.map((credit) => (
                      <div key={credit.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{credit.type}</span>
                          <Badge variant="secondary">{credit.status}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">Límite: ${credit.amount.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Banknote className="h-6 w-6 mr-2 text-green-600" />
                    Préstamos
                  </CardTitle>
                  <CardDescription>Tus préstamos activos</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {currentUser.loans.map((loan) => (
                      <div key={loan.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{loan.type}</span>
                          <Badge variant="outline">{loan.status}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          Saldo: ${loan.remainingBalance.toLocaleString()} / ${loan.originalAmount.toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
