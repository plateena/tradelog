import db from '~/database'
import Tradelog from '@models/tradelog'
import { ITradelog, TradeLogType, ISearch } from '@type/interfaces'
import { genTradelogData } from '@tests/models/tradelog'
import { Request } from 'express'
/**
 * @group db/mongo/models/mongoose
 */

describe('Tradelog', () => {
    beforeAll(async () => {
        await db.connect()
    })

    afterAll(async () => {
        try {
            await Tradelog.deleteAll()
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
            transaction_date: new Date(),
            type: TradeLogType.buy,
        }

        const savedTradelog = await Tradelog.create<ITradelog>(tradelogData)

        expect(savedTradelog._id).toBeDefined()
        expect(savedTradelog.symbol).toBe(tradelogData.symbol)
        expect(savedTradelog.price).toBe(tradelogData.price)
        expect(savedTradelog.unit).toBe(tradelogData.unit)
        expect(savedTradelog.transaction_date.toISOString()).toBe(
            tradelogData.transaction_date.toISOString()
        )
    })

    it('can create tradelog with save method', async () => {
        const tradelogData: ITradelog = {
            symbol: 'AAPL',
            price: 150.0,
            unit: 10,
            transaction_date: new Date(),
            type: TradeLogType.buy,
        }

        // Create a new trade log record
        const newTradeLog = new Tradelog(tradelogData)

        // Save the new trade log record to the database
        const savedTradelog = await newTradeLog.save()

        expect(savedTradelog._id).toBeDefined()
        expect(savedTradelog.symbol).toBe(tradelogData.symbol)
        expect(savedTradelog.price).toBe(tradelogData.price)
        expect(savedTradelog.unit).toBe(tradelogData.unit)
        expect(savedTradelog.transaction_date.toISOString()).toBe(
            tradelogData.transaction_date.toISOString()
        )
    })

    it('can retrieve all tradelog data', async () => {
        const tradelogData: ITradelog[] = genTradelogData(10) as ITradelog[]
        for (const tradelog of tradelogData) {
            await Tradelog.create<ITradelog>(tradelog)
        }
        const req: Partial<Request> = {
            query: {
                per_page: "12"
            },
        }

        const result = await Tradelog.search<
            ISearch<ITradelog>,
            Partial<Request>
        >(req)

        // create new result with only partial of ITredelog
        const data = result.data.map((data) => {
            return {
                symbol: data.symbol,
                price: data.price,
                unit: data.unit,
                transaction_date: data.transaction_date,
                type: data.type,
            }
        })

        let transformedData = {
            data: data,
        }

        // @TODO: <plateena711@gmail.com> delete this debug line
        console.log(result)
        expect(transformedData.data).toEqual(
            expect.arrayContaining(tradelogData)
        )
        expect(result.status).toBe('success')
        expect(result.pagination.per_page).toBe(15)
    })
})
