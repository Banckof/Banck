import mysql from "mysql2/promise"

const connectionConfig = {
  host: process.env.MYSQL_HOST || process.env.MYSQLHOST,
  port: Number.parseInt(process.env.MYSQL_PORT || process.env.MYSQLPORT || "3306"),
  user: process.env.MYSQL_USER || process.env.MYSQLUSER,
  password: process.env.MYSQL_PASSWORD || process.env.MYSQLPASSWORD,
  database: process.env.MYSQL_DATABASE || process.env.MYSQLDATABASE,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  connectTimeout: 60000,
  acquireTimeout: 60000,
  timeout: 60000,
}

let pool: mysql.Pool | null = null

function createPool() {
  if (!pool) {
    pool = mysql.createPool({
      ...connectionConfig,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    })
  }
  return pool
}

export async function sql(strings: TemplateStringsArray, ...values: any[]) {
  const pool = createPool()

  let query = strings[0]
  for (let i = 0; i < values.length; i++) {
    query += "?" + strings[i + 1]
  }

  try {
    const [rows] = await pool.execute(query, values)
    return rows as any[]
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

export async function testConnection() {
  try {
    const pool = createPool()
    const connection = await pool.getConnection()
    await connection.ping()
    connection.release()
    return true
  } catch (error) {
    console.error("Database connection error:", error)
    return false
  }
}
