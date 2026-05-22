import config from "../../Config/config"
import { pool } from "../../DB/database"
import type { IUser } from "./user.interface"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


// create user in db
const createUserInDb = async (payload: IUser) => {
    const { name, email, password, role } = payload

    const hashedPass = await bcrypt.hash(password, 10)
    const result = await pool.query(`
        INSERT INTO users(name,email,password,role) VALUES($1,$2,$3,COALESCE($4, 'contributor'))
        RETURNING id, name, email, role, created_at,updated_at
        `, [name, email, hashedPass, role])

    return result.rows[0]
}

// let user log in
const logInToDB = async (payload: IUser) => {
    const { email, password } = payload

    const userData = await pool.query(`SELECT * FROM users WHERE email=$1`, [email])

    if (userData.rows.length === 0) {
        throw new Error("User not found")
    }

    const user = userData.rows[0]


    const decodePass = await bcrypt.compare(password, user.password)

    if (!decodePass) {
        throw new Error("Wrong password")
    } else {
        const jwtPayload = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }

        const token = jwt.sign(jwtPayload, config.secret as string, { expiresIn: "1d" })

        const { password: _, ...safeUser } = user

        return { token, user: safeUser }
    }
}

export const authService = {
    createUserInDb,
    logInToDB
}