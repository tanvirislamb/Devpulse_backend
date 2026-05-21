import { pool } from "../../DB/database"
import type { IUser } from "./user.interface"
import bcrypt from "bcrypt"

const createUserInDb = async (payload: IUser) => {
    const { name, email, password, role } = payload
    
    const hashedPass = await bcrypt.hash(password, 10)
    const result = await pool.query(`
        INSERT INTO users(name,email,password,role) VALUES($1,$2,$3,COALESCE($4, 'contributor'))
        RETURNING id, name, email, role, created_at,updated_at
        `, [name, email, hashedPass, role])

    return result.rows[0]
}

export const authService = {
    createUserInDb
}