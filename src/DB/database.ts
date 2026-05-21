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
            name VARCHAR(100) NOT NULL,
            email VARCHAR(255)  NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(25) NOT NULL DEFAULT 'contributor' CHECK (role IN ('contributor', 'maintainer')),
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
            )
            `)

        await pool.query(`
                CREATE TABLE IF NOT EXISTS issues(
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                type VARCHAR(50) NOT NULL CHECK(type IN ('bug', 'feature_request')),
                status VARCHAR(50) NOT NULL CHECK(status IN ('open', 'in_progress', 'resolved')),
                reporter_id INTEGER NOT NULL,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
                )
                `)

    } catch (error) {
        console.log(error)
    }
}