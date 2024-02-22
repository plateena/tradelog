import { validationResult } from 'express-validator'
import { NextFunction, Request, Response, RequestHandler } from 'express'

const doValidation: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // Check for validation errors
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        // If no validation errors, proceed to the next middleware
        next()
    } catch (error) {
        // Handle any unexpected errors during validation
        console.error('Validation error:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

export default doValidation
