import mongoose from 'mongoose'
import db from '../../database'
import Tradelog, { ITradelog } from './../../models/tradelog'

/**
 * @group db/mongo/models/mongoose
 */

describe('Tradelog', () => {
    beforeAll(async () => {
        await db.connect()
    })

    afterAll(async () => {
        try {
            // await Tradelog.deleteMany({});
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
            buy_date: new Date(),
        }

        const savedTradelog = await Tradelog.create(tradelogData)
        console.log(savedTradelog)

        expect(savedTradelog._id).toBeDefined()
        expect(savedTradelog.symbol).toBe(tradelogData.symbol)
        expect(savedTradelog.price).toBe(tradelogData.price)
        expect(savedTradelog.unit).toBe(tradelogData.unit)
        expect(savedTradelog.buy_date.toISOString()).toBe(
            tradelogData.buy_date.toISOString()
        )
    })
})
