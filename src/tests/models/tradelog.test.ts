import mongoose from 'mongoose'
import db from '../../database'
import Tradelog from './../../models/tradelog'
import { ITradelog, TradeLogType } from '../../types/interfaces'
/**
 * @group db/mongo/models/mongoose
 */

describe('Tradelog', () => {
    beforeAll(async () => {
        await db.connect()
    })

    afterAll(async () => {
        try {
            await Tradelog.deleteAll();
        } catch (err) {
            console.log(err)
        }
        await db.close()
    })

    it('should insert data into the tradelog collection', async () => {
        const tradelogData: ITradelog = {
            symbol: 'AAPL',
            price: 150.0,
            unit: 10,
            transactionDate: new Date(),
            type: TradeLogType.buy

        }

        const savedTradelog = await Tradelog.create<ITradelog>(tradelogData)

        expect(savedTradelog._id).toBeDefined()
        expect(savedTradelog.symbol).toBe(tradelogData.symbol)
        expect(savedTradelog.price).toBe(tradelogData.price)
        expect(savedTradelog.unit).toBe(tradelogData.unit)
        expect(savedTradelog.transactionDate.toISOString()).toBe(
            tradelogData.transactionDate.toISOString()
        )
    })

    it('can create tradelog with save method', async () => {
        const tradelogData: ITradelog = {
            symbol: 'AAPL',
            price: 150.0,
            unit: 10,
            transactionDate: new Date(),
            type: TradeLogType.buy

        }

        // Create a new trade log record
        const newTradeLog = new Tradelog(tradelogData);

        // Save the new trade log record to the database
        const savedTradelog = await newTradeLog.save();

        expect(savedTradelog._id).toBeDefined()
        expect(savedTradelog.symbol).toBe(tradelogData.symbol)
        expect(savedTradelog.price).toBe(tradelogData.price)
        expect(savedTradelog.unit).toBe(tradelogData.unit)
        expect(savedTradelog.transactionDate.toISOString()).toBe(
            tradelogData.transactionDate.toISOString()
        )
    })
})
