import express, { Request, Response } from 'express'
import tradeLogRouter from './v1/tradelog'

const router = express.Router()

router.use('/v1', tradeLogRouter)

export default router

