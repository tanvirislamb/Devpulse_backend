import type { NextFunction, Request, Response } from "express"
import { errorResponse } from "../Utils/res"
import jwt, { type JwtPayload } from "jsonwebtoken"
import config from "../Config/config"
import { pool } from "../DB/database"

const authMiddle = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization
            if (!token) {
                return errorResponse(res, false, 401, "Unauthorized access")
            }

            const decode = jwt.verify(token as string, config.secret as string) as JwtPayload

            const userData = await pool.query(`SELECT * FROM users WHERE email=$1`, [decode.email])
            if (userData.rows.length === 0) {
                return errorResponse(res, false, 404, "user not found")
            }

            req.user = decode

            next()

        } catch (error) {
            errorResponse(res, false, 400, "Something went wrong", error)
        }
    }
}

export default authMiddle