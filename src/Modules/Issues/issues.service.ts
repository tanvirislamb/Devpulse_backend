import config from "../../Config/config"
import { pool } from "../../DB/database"
import type { IIssues } from "./issues.interface"
import jwt, { type JwtPayload } from "jsonwebtoken"

// create issues in db
const insertIssuesInDB = async (payload: IIssues, token: string) => {
    const { title, description, type, status } = payload

    const decode = jwt.verify(token, config.secret as string) as JwtPayload
    const reporter_id = decode.id

    const result = await pool.query(`
        INSERT INTO issues(title, description,type,status,reporter_id) VALUES($1,$2,$3,COALESCE($4,'open'),$5) RETURNING *
        `, [title, description, type, status, reporter_id])

    return result.rows[0]

}


// get all issues from db
const getAllIssuesFromDB = async () => {

    const rawIssues = await pool.query(`SELECT * FROM issues`)
    const issues = rawIssues.rows

    const reporterIds = [...new Set(issues.map(issue => issue.reporter_id))]

    const usersResult = await pool.query(
        `SELECT id, name, role FROM users WHERE id = ANY($1)`,
        [reporterIds]
    )

    const users = usersResult.rows

    const userMap = users.reduce((acc, user) => {
        acc[user.id] = user
        return acc
    }, {})

    const formattedIssues = issues.map(issue => ({
        id: issue.id,
        title: issue.title,
        description: issue.description,
        type: issue.type,
        status: issue.status,
        reporter: userMap[issue.reporter_id],
        created_at: issue.created_at,
        updated_at: issue.updated_at
    }))

    return formattedIssues

}

export const issuesService = {
    insertIssuesInDB,
    getAllIssuesFromDB
}