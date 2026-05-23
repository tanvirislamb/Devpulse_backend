import type { Request, Response } from "express";
import { errorResponse, response } from "../../Utils/res";
import { issuesService } from "./issues.service";

// create issues
const createIssues = async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization as string
        if (!token) {
            errorResponse(res, false, 401, "Unauthorized acces")
        }
        const result = await issuesService.insertIssuesInDB(req.body, token as string)
        response(res, true, 201, "Issue created successfully", result)
    } catch (error: any) {
        errorResponse(res, false, 400, error.message, error)
    }
}


//get all issues
const getAllIssues = async (req: Request, res: Response) => {
    try {
        const sort = (req.query.sort as string) || 'newest'
        const type = req.query.type as string
        const status = req.query.status as string

        const result = await issuesService.getAllIssuesFromDB(sort, type, status)
        response(res, true, 200, "Issue retrived successfully", result)
    } catch (error: any) {
        errorResponse(res, false, 400, error.message, error)
    }
}


// get single issue by id
const getSingleIssue = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string
        const result = await issuesService.getSingleIssueById(id)
        response(res, true, 200, "Issue retrived successfully", result)
    } catch (error: any) {
        errorResponse(res, false, 400, error.message, error)
    }

}


// update issue
const updateIssue = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string
        const token = req.headers.authorization as string
        if (!token) {
            errorResponse(res, false, 401, "Unauthorized acces")
        }
        const result = await issuesService.updateIssueInDb(id, token, req.body)

        response(res, true, 200, "Issue updated successfully", result)
    } catch (error: any) {
        errorResponse(res, false, 400, error.message, error)
    }
}


// delete issue
const deleteIssues = async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization as string
        if (!token) {
            errorResponse(res, false, 401, "Unauthorized acces")
        }
        const id = req.params.id as string

        const result = await issuesService.deleteIssuesFromDb(id, token)
        response(res, true, 200, "Issue deleted successfully")
    } catch (error: any) {
        errorResponse(res, false, 400, error.message, error)
    }
}

export const issuesController = {
    createIssues,
    getAllIssues,
    getSingleIssue,
    updateIssue,
    deleteIssues
}