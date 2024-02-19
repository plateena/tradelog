import express, { Request, Response } from 'express'
import { DB } from './database'

export const DB_ERROR_MESSAGE = 'Database connection has not been established.'

const buildApp = async (db: DB) => {
    let dbConnStatus: boolean
    try {
        dbConnStatus = await db.connect()
    } catch (error) {
        // console.error('Error connecting to database: ', error)
        dbConnStatus = false
    }
    const app = express()

    if (!dbConnStatus) {
        app.get('/*', (_: Request, res: Response) => {
            res.status(500).send(DB_ERROR_MESSAGE)
        })
    }

    app.get('/test-running', (_: Request, res: Response) => {
        res.send('API is running')
    })

    return app
}

export default buildApp
