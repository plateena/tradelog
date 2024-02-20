import express, { Request, Response } from 'express'

const router = express.Router()

router.get('/tradelog', (_: Request, res: Response) => {
    return res.send('get tradelog index')
}).bind({ name: "tradelog.index" })

export default router

