import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    // Crear tabla de usuarios
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        account_number VARCHAR(50) UNIQUE NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'user') DEFAULT 'user',
        balance DECIMAL(15,2) DEFAULT 0.00,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `

    // Crear tabla de transacciones
    await sql`
      CREATE TABLE IF NOT EXISTS transactions (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        type ENUM('deposit', 'withdrawal', 'transfer') NOT NULL,
        amount DECIMAL(15,2) NOT NULL,
        description TEXT,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        balance DECIMAL(15,2) NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `

    // Crear tabla de préstamos
    await sql`
      CREATE TABLE IF NOT EXISTS loans (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        amount DECIMAL(15,2) NOT NULL,
        interest_rate DECIMAL(5,2) NOT NULL,
        term INT NOT NULL,
        monthly_payment DECIMAL(15,2) NOT NULL,
        remaining_balance DECIMAL(15,2) NOT NULL,
        status ENUM('active', 'paid', 'defaulted') DEFAULT 'active',
        start_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `

    // Crear tabla de tarjetas de crédito
    await sql`
      CREATE TABLE IF NOT EXISTS credit_cards (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        amount DECIMAL(15,2) NOT NULL,
        credit_limit DECIMAL(15,2) NOT NULL,
        interest_rate DECIMAL(5,2) NOT NULL,
        due_date DATE NOT NULL,
        status ENUM('active', 'paid', 'overdue') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `

    // Verificar si ya existe el administrador
    const existingAdmin = await sql`
      SELECT id FROM users WHERE email = 'admin@bankofamerica.com'
    `

    if (existingAdmin.length === 0) {
      // Crear administrador por defecto
      const adminId = Date.now().toString()
      await sql`
        INSERT INTO users (id, account_number, full_name, email, password, role, balance)
        VALUES (${adminId}, 'ADM-000001', 'Administrador', 'admin@bankofamerica.com', 'admin123', 'admin', 1000000.00)
      `

      // Crear usuario de ejemplo
      const userId = (Date.now() + 1).toString()
      await sql`
        INSERT INTO users (id, account_number, full_name, email, password, role, balance)
        VALUES (${userId}, '4001-2345-6789', 'Sagitario López', 'sagitario.lopez124@gmail.com', '2154', 'user', 50000.00)
      `

      // Agregar transacción inicial para el usuario
      await sql`
        INSERT INTO transactions (id, user_id, type, amount, description, balance)
        VALUES (${userId + "_1"}, ${userId}, 'deposit', 50000.00, 'Depósito inicial', 50000.00)
      `

      // Agregar un préstamo de ejemplo
      await sql`
        INSERT INTO loans (id, user_id, amount, interest_rate, term, monthly_payment, remaining_balance, start_date)
        VALUES (${userId + "_loan1"}, ${userId}, 100000.00, 12.5, 24, 5208.33, 95000.00, '2024-01-01')
      `

      // Agregar tarjeta de crédito de ejemplo
      await sql`
        INSERT INTO credit_cards (id, user_id, amount, credit_limit, interest_rate, due_date)
        VALUES (${userId + "_cc1"}, ${userId}, 15000.00, 50000.00, 24.99, '2024-12-31')
      `
    }

    return NextResponse.json({
      success: true,
      message: "Base de datos configurada exitosamente",
    })
  } catch (error) {
    console.error("Error setting up database:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Error configurando la base de datos",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
