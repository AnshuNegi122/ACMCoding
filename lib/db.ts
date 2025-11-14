import mysql from "mysql2/promise"

const host = process.env.DB_HOST || "localhost"
const port = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306
const user = process.env.DB_USER || "root"
const password = process.env.DB_PASSWORD || ""
const database = process.env.DB_NAME || "quiz_app"

// Create a connection without specifying database first to create it if needed
const adminPool = mysql.createPool({
  host,
  port,
  user,
  password,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

// Initialize database and tables
async function initializeDatabase() {
  try {
    // Create database if it doesn't exist
    await adminPool.execute(`CREATE DATABASE IF NOT EXISTS \`${database}\``)
    
    // Now create a pool with the database specified
    const dbPool = mysql.createPool({
      host,
      port,
      user,
      password,
      database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    })

    // Create tables if they don't exist
    await dbPool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'participant') DEFAULT 'participant',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await dbPool.execute(`
      CREATE TABLE IF NOT EXISTS questions (
        id INT PRIMARY KEY AUTO_INCREMENT,
        text VARCHAR(500) NOT NULL,
        option_a VARCHAR(255) NOT NULL,
        option_b VARCHAR(255) NOT NULL,
        option_c VARCHAR(255) NOT NULL,
        option_d VARCHAR(255) NOT NULL,
        correct_answer CHAR(1) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await dbPool.execute(`
      CREATE TABLE IF NOT EXISTS submissions (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        email VARCHAR(255) NOT NULL,
        score INT NOT NULL,
        total_questions INT NOT NULL,
        percentage FLOAT NOT NULL,
        passed BOOLEAN NOT NULL,
        answers JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `)

    return dbPool
  } catch (error) {
    console.error("[db] Initialization error:", error)
    throw error
  }
}

// Initialize and get the pool
let pool: mysql.Pool | null = null
const poolPromise = initializeDatabase().then((p) => {
  pool = p
  return p
})

// Ensure pool is initialized before use
async function getPool() {
  if (pool) {
    return pool
  }
  return await poolPromise
}

export async function query(sql: string, values?: any[]) {
  const dbPool = await getPool()
  const connection = await dbPool.getConnection()
  try {
    const [results] = await connection.execute(sql, values)
    return results
  } catch (err) {
    console.error("[db] Query error:", err, { sql, values })
    throw err
  } finally {
    try {
      connection.release()
    } catch (releaseErr) {
      console.error("[db] Connection release error:", releaseErr)
    }
  }
}

export async function getConnection() {
  const dbPool = await getPool()
  return await dbPool.getConnection()
}

export default poolPromise
