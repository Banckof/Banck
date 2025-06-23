// Simulación simple de base de datos para testing
export const mockUsers = [
  {
    id: "1",
    accountNumber: "ADM-000001",
    fullName: "Administrador",
    email: "admin@bankofamerica.com",
    password: "admin123",
    role: "admin" as const,
    balance: 0,
    movements: [],
    credits: [],
    loans: [],
  },
  {
    id: "2",
    accountNumber: "4001-2345-6789",
    fullName: "Sagitario López",
    email: "sagitario.lopez124@gmail.com",
    password: "2154",
    role: "user" as const,
    balance: 150000,
    movements: [
      {
        id: "mov1",
        type: "deposit" as const,
        amount: 150000,
        description: "Depósito inicial",
        date: new Date().toISOString(),
        balance: 150000,
      },
    ],
    credits: [],
    loans: [],
  },
]

export function getUsers() {
  return mockUsers
}

export function getUserByCredentials(email: string, password: string) {
  return mockUsers.find((user) => user.email === email && user.password === password) || null
}
