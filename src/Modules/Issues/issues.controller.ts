import type { Request, Response } from "express";
import { errorResponse, response } from "../../Utils/res";
import { issuesService } from "./issues.service";

const createIssues = async (req: Request, res: Response) => {
    try {
        const result = await issuesService.insertIssuesInDB(req.body, req.headers.authorization as string)
        response(res, true, 201, "Issue created successfully", result)
    } catch (error) {
        errorResponse(res, false, 400, "Something went wrong", error)
    }
}

export const issuesController = {
    createIssues
}