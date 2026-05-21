import { Pool } from "pg"
import config from "../Config/config"

export const pool = new Pool({
    connectionString: String(config.db_string)
})

export const initDB = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY,
            name VARCHAR(25) NOT NULL,
            email VARCHAR(30)  NOT NULL UNIQUE,
            password VARCHAR(50) NOT NULL,
            role VARCHAR(25) NOT NULL DEFAULT 'contributor',
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
            )
            `)

    } catch (error) {
        console.log(error)
    }
}