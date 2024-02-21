import express, { Request, Response } from 'express'
import { DB } from './database'
import apiRouter from './routes/api'

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

    app.use(express.urlencoded({ extended: false }))
    app.use(express.json())

    if (!dbConnStatus) {
        app.get('/*', (_: Request, res: Response) => {
            res.status(500).send(DB_ERROR_MESSAGE)
        })
    }

    app.use("/api", apiRouter)

    app.get('/test-running', (_: Request, res: Response) => {
        res.send('API is running')
    })

    app.get('/*', (_: Request, res: Response) => {
        res.status(404).send('File Not Found')
    })

    return app
}

export default buildApp
