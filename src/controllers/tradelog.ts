// Path: ./controllers/tradelog.ts
import { Request, Response } from 'express'
import Tradelog from '@models/tradelog'
import { ITradeLogModel, ISearch, ITradelog } from '@type/interface'
import { dateFormat } from '~/helpers'
import moment from 'moment'
import { tradelogCreateValidation } from '@middleware/validations/tradelog'
import doValidaton from '@middleware/validations/do-validation'

const main = async (req: Request, res: Response) => {
    try {
        const tradelogResult = await Tradelog.search<
            ISearch<ITradelog>,
            Partial<Request>
        >(req)
        return res.json(tradelogResult)
    } catch (error) {
        return res.status(500).json({ error })
    }
    // return res.json('test the body response')
}

const create = async (req: Request, res: Response) => {
    try {
        // Extract data from the request body
        const { symbol, price, unit, transactionDate, type } = req.body

        const transactionDateObject = moment(
            transactionDate,
            dateFormat
        ).toDate()

        // Create a new trade log record
        const newTradeLog = new Tradelog({
            symbol,
            price,
            unit,
            transactionDateObject,
            type,
        })

        // Save the new trade log record to the database
        const createdTradeLog = await newTradeLog.save()

        // Respond with the created trade log record
        res.status(201).json(createdTradeLog)
    } catch (error) {
        // Handle any errors that occur during trade log creation
        console.error('Error creating trade log:', error)
        res.status(500).json({ error: 'Failed to create trade log' })
    }
}

export const TradelogIndex = [main]
export const TradelogCreate = [tradelogCreateValidation, doValidaton, create]
