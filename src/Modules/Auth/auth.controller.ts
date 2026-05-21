import type { Request, Response } from "express"
import { errorResponse, response } from "../../Utils/res"
import { authService } from "./auth.service"


// user sign in
const createUser = async (req: Request, res: Response) => {
    try {
        const result = await authService.createUserInDb(req.body)
        response(res, true, 200, "User registered successfully", result)
    } catch (error) {
        errorResponse(res, false, 500, "Signup failed", error)
    }
}


//user log in
const logInUser = async (req: Request, res: Response) => {
    try {
        const result = await authService.createUserInDb(req.body)
        response(res, true, 200, "User registered successfully", result)
    } catch (error) {
        errorResponse(res, false, 500, "Signup failed", error)
    }
}

export const authController = {
    createUser,
    logInUser
}