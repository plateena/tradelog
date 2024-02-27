import express, { Request, Response } from 'express'
import { TradelogCreate, TradelogIndex } from './../../controllers/tradelog'
import doValidation from './../../middleware/validations/do-validation'
import { tradelogCreateValidation } from './../../middleware/validations/tradelog'

const router = express.Router()

router.route('/tradelog')
    .get(...TradelogIndex)
    .post(...TradelogCreate)

export default router

