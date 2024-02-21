import express, { Request, Response } from 'express'
import { DB } from './database'
import apiRouter from './routes/api'
import swaggerUi from 'swagger-ui-express'
import swaggerDefinition from './docs/swagger'

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

    // Serve Swagger UI at /api-docs endpoint
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDefinition));

    return app
}

export default buildApp
