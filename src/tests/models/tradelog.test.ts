import db from '~/database'
import Tradelog from '@models/tradelog'
import { ITradelog, TradeLogType, ISearch } from '@type/interfaces'
import { genTradelogData } from '@tests/models/tradelog'
import { Request } from 'express'
import moment from 'moment'
import appConfig from '@config/app'

/**
 * @group db/mongo/models/mongoose
 */

describe('Tradelog', () => {
    beforeAll(async () => {
        await db.connect()
    })

    afterEach(async () => {
        const rs = await Tradelog.deleteAll()
    })

    afterAll(async () => {
        await db.close()
    })

    it('MODEL tradelog: should insert data into the tradelog collection', async () => {
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

    it('MODEL tradelog: can create tradelog with save method', async () => {
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

    it('MODEL tradelog: can retrieve all tradelog data', async () => {
        const tradelogData: ITradelog[] = genTradelogData(10) as ITradelog[]
        for (const tradelog of tradelogData) {
            await Tradelog.create<ITradelog>(tradelog)
        }
        const req: Partial<Request> = {}

        const result = await Tradelog.search<
            ISearch<ITradelog>,
            Partial<Request>
        >(req)

        // create new result with only partial of ITredelog
        const data = result.data.map((data: any) => {
            return {
                symbol: data.symbol,
                price: data.price,
                unit: data.unit,
                transaction_date: moment(data.transaction_date).format(
                    appConfig.format.date
                ),
                type: data.type,
            }
        })

        let transformedData = {
            data: data,
        }

        expect(transformedData.data).toEqual(
            expect.arrayContaining(tradelogData)
        )
        expect(result.status).toBe('success')
        expect(result.data).toHaveLength(10)
    })

    it('MODEL tradelog: can retrieve all tradelog data with pagination', async () => {
        const tradelogData: ITradelog[] = genTradelogData(30) as ITradelog[]
        for (const tradelog of tradelogData) {
            await Tradelog.create<ITradelog>(tradelog)
        }
        const req: Partial<Request> = {
            query: {
                page: '1',
            },
        }

        const result = await Tradelog.search<
            ISearch<ITradelog>,
            Partial<Request>
        >(req)
        expect(result.status).toBe('success')
        expect(result.pagination?.last_page).toBe(2)
    })

    it('MODEL tradelog: can retrieve all tradelog data with pagination page 2', async () => {
        const tradelogData: ITradelog[] = genTradelogData(30) as ITradelog[]
        for (const tradelog of tradelogData) {
            await Tradelog.create<ITradelog>(tradelog)
        }
        const req: Partial<Request> = {
            query: {
                page: '2',
            },
        }

        const result = await Tradelog.search<
            ISearch<ITradelog>,
            Partial<Request>
        >(req)
        expect(result.status).toBe('success')
        expect(result.pagination?.current_page).toBe(2)
    })

    it('MODEL tradelog: can retrieve data with symbol filter', async () => {
        const tradelogData: ITradelog[] = genTradelogData(30) as ITradelog[]
        for (const tradelog of tradelogData) {
            await Tradelog.create<ITradelog>(tradelog)
        }

        const searchData: ITradelog = {
            symbol: tradelogData[0].symbol,
            price: tradelogData[0].price,
            unit: tradelogData[0].unit,
            transaction_date: moment(
                tradelogData[0].transaction_date,
                appConfig.format.date
            ).toDate(),
            type: tradelogData[0].type,
        }

        const req: Partial<Request> = {
            query: {
                'filter[symbol]': tradelogData[0].symbol,
            },
        }

        const result = await Tradelog.search<
            ISearch<ITradelog>,
            Partial<Request>
        >(req)
        expect(result.status).toBe('success')
        expect(result.data).toEqual(
            expect.arrayContaining([expect.objectContaining(searchData)])
        )
    })

    it('MODEL tradelog: can retrieve empty data', async () => {
        const req: Partial<Request> = {
            query: {
                'page': '1',
            },
        }

        const result = await Tradelog.search<
            ISearch<ITradelog>,
            Partial<Request>
        >(req)

        console.log(result)
        expect(result.status).toBe('success')
        expect(result.data).toHaveLength(0)
        expect(result.total).toBe(0)
    })
})
