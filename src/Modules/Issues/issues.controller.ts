import type { Request, Response } from "express";
import { errorResponse, response } from "../../Utils/res";
import { issuesService } from "./issues.service";

// create issues
const createIssues = async (req: Request, res: Response) => {
    try {
        const result = await issuesService.insertIssuesInDB(req.body, req.headers.authorization as string)
        response(res, true, 201, "Issue created successfully", result)
    } catch (error) {
        errorResponse(res, false, 400, "Something went wrong", error)
    }
}


//get all issues
const getAllIssues = async (req: Request, res: Response) => {
    try {
        const sort = (req.query.sort as string) || 'newest'
        const result = await issuesService.getAllIssuesFromDB(sort)
        response(res, true, 200, "", result)
    } catch (error) {
        errorResponse(res, false, 400, "Something went wrong", error)
    }
}


// get single issue by id
const getSingleIssue = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string
        const result = await issuesService.getSingleIssueById(id)
        response(res, true, 200, "", result)
    } catch (error) {
        errorResponse(res, false, 400, "Something went wrong", error)
    }

}


// update issue
const updateIssue = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string
        const token = req.headers.authorization as string

        const result = await issuesService.updateIssueInDb(id, token, req.body)

        response(res, true, 200, "Issue updated successfully", result)
    } catch (error) {
        errorResponse(res, false, 400, "Something went worng", error)
    }
}

export const issuesController = {
    createIssues,
    getAllIssues,
    getSingleIssue,
    updateIssue
}