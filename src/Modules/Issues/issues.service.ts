import config from "../../Config/config"
import { pool } from "../../DB/database"
import type { IIssues } from "./issues.interface"
import jwt, { type JwtPayload } from "jsonwebtoken"

const insertIssuesInDB = async (payload: IIssues, token: string) => {
    const { title, description, type, status } = payload

    const decode = jwt.verify(token, config.secret as string) as JwtPayload
    const reporter_id = decode.id

    const result = await pool.query(`
        INSERT INTO issues(title, description,type,status,reporter_id) VALUES($1,$2,$3,COALESCE($4,'open'),$5) RETURNING *
        `, [title, description, type, status, reporter_id])

    return result.rows[0]

}

export const issuesService = {
    insertIssuesInDB
}