"use server"

let Pool: any
let pool: any = null

export async function getPool() {
  if (!Pool) {
    const pgModule = await import("pg")
    Pool = pgModule.Pool
  }

  if (!pool) {
    const connectionString = process.env.DATABASE_URL
    if (!connectionString) {
      throw new Error("❌ DATABASE_URL is not defined.")
    }

    pool = new Pool({
      connectionString,
      ssl:
        process.env.NODE_ENV === "production"
          ? { rejectUnauthorized: false }
          : false,
    })

    console.log("✅ PostgreSQL pool initialized")
  }

  return pool
}

export async function query<T = any>(text: string, params?: any[]): Promise<{ rows: T[] }> {
  const client = await getPool()
  const result = await client.query(text, params)
  return result
}
