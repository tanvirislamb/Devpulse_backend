import type { Response } from "express";

export const response = (res: Response, success: Boolean, status: number, message?: String, data?: any) => {
    res.status(status).json({
        success: success,
        message: message,
        data: data
    })
}

export const errorResponse = (res: Response, success: Boolean, status: number, message: String, error?: any) => {
    res.status(status).json({
        success: success,
        message: message,
        error: error?.message
    })
}