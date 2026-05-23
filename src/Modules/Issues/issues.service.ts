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
const getAllIssuesFromDB = async (sort: string = 'newest', type?: string, status?: string) => {
    const orderBy = sort === 'oldest' ? 'ASC' : 'DESC'

    let whereClause = ''
    const params: any[] = []

    if (type || status) {
        const conditions: string[] = []

        if (type) {
            conditions.push(`type = $${params.length + 1}`)
            params.push(type)
        }

        if (status) {
            conditions.push(`status = $${params.length + 1}`)
            params.push(status)
        }

        whereClause = ' WHERE ' + conditions.join(' AND ')
    }

    const rawIssues = await pool.query(`SELECT * FROM issues${whereClause} ORDER BY created_at ${orderBy}`, params)
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


// get issue by id
const getSingleIssueById = async (id: string) => {
    const getIssue = await pool.query(`SELECT * FROM issues WHERE id=$1`, [id])

    if (getIssue.rows.length === 0) {
        throw new Error("Issue not found")
    }

    const issue = getIssue.rows[0]

    const reporterIds = issue.reporter_id

    const usersResult = await pool.query(
        `SELECT id, name, role FROM users WHERE id = $1`,
        [reporterIds]
    )

    const user = usersResult.rows[0]

    const formattedResult = {
        id: issue.id,
        title: issue.title,
        description: issue.description,
        type: issue.type,
        status: issue.status,
        reporter: user,
        created_at: issue.created_at,
        updated_at: issue.updated_at
    }

    return formattedResult
}


//update issue
const updateIssueInDb = async (id: string, token: string, payload: IIssues) => {
    const { title, description, type } = payload

    const decode = jwt.verify(token, config.secret as string) as JwtPayload

    if (decode.role === "maintainer") {
        const result = await pool.query(`
            UPDATE issues 
              SET title=$1, 
                description=$2, 
                type=$3, 
                updated_at = NOW() 
              WHERE id=$4 RETURNING *`
            , [title, description, type, id])

        if (result.rows.length === 0) {
            throw new Error("Issues not found")
        }

        return result.rows[0]
    }

    if (decode.role === "contributor") {
        const result = await pool.query(`
            UPDATE issues 
            SET title=$1, 
                description=$2, 
                type=$3, 
                updated_at = NOW() 
            WHERE id=$4 AND reporter_id=$5 AND status='open' RETURNING *`
            , [title, description, type, id, decode.id]
        )
        if (result.rows.length === 0) {
            throw new Error("Forbidden acces")
        }

        return result.rows[0]
    }
    throw new Error("Forbidden")
}


const deleteIssuesFromDb = async (id: string, token: string) => {
    const decode = jwt.verify(token, config.secret as string) as JwtPayload
    if (decode.role === 'maintainer') {
        const result = await pool.query(`DELETE FROM issues WHERE id=$1 RETURNING *`, [id])

        if (result.rows.length === 0) {
            throw new Error("Issues not found")
        }
        return result.rows[0]
    } else {
        throw new Error("Forbidden access")
    }
}

export const issuesService = {
    insertIssuesInDB,
    getAllIssuesFromDB,
    getSingleIssueById,
    updateIssueInDb,
    deleteIssuesFromDb
}