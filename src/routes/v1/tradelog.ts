import express, { Request, Response } from 'express'
import { TradelogCreate } from './../../controllers/tradelog'

const router = express.Router()

router.get('/tradelog', (_: Request, res: Response) => {
    return res.send('get tradelog index')
}).bind({ name: "tradelog.index" })

router.route('/tradelog')
    .post(TradelogCreate)


export default router

