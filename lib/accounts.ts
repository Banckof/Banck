import { sql } from "./db"
import type { Account } from "@/types/bank"

export async function getAllAccounts(): Promise<Account[]> {
  try {
    const users = await sql`
      SELECT * FROM users ORDER BY created_at DESC
    `

    const accountsWithDetails = await Promise.all(
      users.map(async (user: any) => {
        const transactions = await sql`
          SELECT * FROM transactions WHERE user_id = ${user.id} ORDER BY date DESC
        `

        const creditCards = await sql`
          SELECT * FROM credit_cards WHERE user_id = ${user.id} ORDER BY created_at DESC
        `

        const loans = await sql`
          SELECT * FROM loans WHERE user_id = ${user.id} ORDER BY created_at DESC
        `

        return {
          id: user.id,
          accountNumber: user.account_number,
          fullName: user.full_name,
          email: user.email,
          password: user.password,
          role: user.role as "admin" | "user",
          balance: Number.parseFloat(user.balance),
          movements: transactions.map((t: any) => ({
            id: t.id,
            type: t.type as "deposit" | "withdrawal" | "transfer",
            amount: Number.parseFloat(t.amount),
            description: t.description,
            date: t.date.toISOString(),
            balance: Number.parseFloat(t.balance),
          })),
          credits: creditCards.map((c: any) => ({
            id: c.id,
            amount: Number.parseFloat(c.amount),
            limit: Number.parseFloat(c.credit_limit),
            interestRate: Number.parseFloat(c.interest_rate),
            dueDate: c.due_date.toISOString().split("T")[0],
            status: c.status as "active" | "paid" | "overdue",
          })),
          loans: loans.map((l: any) => ({
            id: l.id,
            amount: Number.parseFloat(l.amount),
            interestRate: Number.parseFloat(l.interest_rate),
            term: l.term,
            monthlyPayment: Number.parseFloat(l.monthly_payment),
            remainingBalance: Number.parseFloat(l.remaining_balance),
            status: l.status as "active" | "paid" | "defaulted",
            startDate: l.start_date.toISOString().split("T")[0],
          })),
        }
      }),
    )

    return accountsWithDetails
  } catch (error) {
    console.error("Error fetching accounts:", error)
    throw error
  }
}

export async function createAccount(account: Omit<Account, "id">): Promise<Account> {
  try {
    const id = Date.now().toString()

    await sql`
      INSERT INTO users (id, account_number, full_name, email, password, role, balance)
      VALUES (${id}, ${account.accountNumber}, ${account.fullName}, ${account.email}, ${account.password}, ${account.role}, ${account.balance})
    `

    // Insertar transacción inicial si hay balance
    if (account.balance > 0) {
      const transactionId = `${id}_1`
      await sql`
        INSERT INTO transactions (id, user_id, type, amount, description, balance)
        VALUES (${transactionId}, ${id}, 'deposit', ${account.balance}, 'Depósito inicial', ${account.balance})
      `
    }

    const newAccount: Account = {
      id,
      ...account,
      movements:
        account.balance > 0
          ? [
              {
                id: `${id}_1`,
                type: "deposit",
                amount: account.balance,
                description: "Depósito inicial",
                date: new Date().toISOString(),
                balance: account.balance,
              },
            ]
          : [],
    }

    return newAccount
  } catch (error) {
    console.error("Error creating account:", error)
    throw error
  }
}

export async function updateAccount(account: Account): Promise<void> {
  try {
    await sql`
      UPDATE users 
      SET full_name = ${account.fullName}, 
          email = ${account.email}, 
          password = ${account.password}, 
          balance = ${account.balance}
      WHERE id = ${account.id}
    `

    // Actualizar transacciones (eliminar existentes y recrear)
    await sql`DELETE FROM transactions WHERE user_id = ${account.id}`

    for (const movement of account.movements) {
      await sql`
        INSERT INTO transactions (id, user_id, type, amount, description, date, balance)
        VALUES (${movement.id}, ${account.id}, ${movement.type}, ${movement.amount}, ${movement.description}, ${movement.date}, ${movement.balance})
      `
    }

    // Actualizar tarjetas de crédito
    await sql`DELETE FROM credit_cards WHERE user_id = ${account.id}`

    for (const credit of account.credits) {
      await sql`
        INSERT INTO credit_cards (id, user_id, amount, credit_limit, interest_rate, due_date, status)
        VALUES (${credit.id}, ${account.id}, ${credit.amount}, ${credit.limit}, ${credit.interestRate}, ${credit.dueDate}, ${credit.status})
      `
    }

    // Actualizar préstamos
    await sql`DELETE FROM loans WHERE user_id = ${account.id}`

    for (const loan of account.loans) {
      await sql`
        INSERT INTO loans (id, user_id, amount, interest_rate, term, monthly_payment, remaining_balance, status, start_date)
        VALUES (${loan.id}, ${account.id}, ${loan.amount}, ${loan.interestRate}, ${loan.term}, ${loan.monthlyPayment}, ${loan.remainingBalance}, ${loan.status}, ${loan.startDate})
      `
    }
  } catch (error) {
    console.error("Error updating account:", error)
    throw error
  }
}

export async function deleteAccount(accountId: string): Promise<void> {
  try {
    await sql`DELETE FROM users WHERE id = ${accountId}`
  } catch (error) {
    console.error("Error deleting account:", error)
    throw error
  }
}

export async function getAccountByCredentials(email: string, password: string): Promise<Account | null> {
  try {
    const accounts = await getAllAccounts()
    return accounts.find((acc) => acc.email === email && acc.password === password) || null
  } catch (error) {
    console.error("Error getting account by credentials:", error)
    return null
  }
}
