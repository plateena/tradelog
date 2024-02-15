import express, { Request, Response } from "express"
import { DB } from "./database"

const buildApp = async (db: DB) => {
    await db.connect()
    const app = express()

    app.get("/test-running", (_: Request, res: Response) => {
        res.send("API is running")
    })

    return app
}

export default buildApp
