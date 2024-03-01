import db from '~/database'
import Tradelog from '@models/tradelog'
import type { ITradelog, ISearch } from '@type/interface'
import { TradeLogType } from '@type/enums'
import { Request } from 'express'
import moment from 'moment'
import appConfig from '@config/app'
import TradeLogFactory from '@factories/tradelog-factory'

/**
 * @group db/mongo/models/mongoose
 */

let num: number = 1

describe('Tradelog', () => {
    beforeAll(async () => {
        await db.connect()
    })

    afterEach(async () => {
        await Tradelog.deleteAll()
    })

    afterAll(async () => {
        await db.close()
    })

    it(`#${num++}:MODEL tradelog: should insert data into the tradelog collection`, async () => {
        const tradelogData: ITradelog = TradeLogFactory.withState({
            type: TradeLogType.buy,
        }).make() as ITradelog

        const savedTradelog = await Tradelog.create<ITradelog>(tradelogData)

        expect(savedTradelog._id).toBeDefined()
        expect(savedTradelog.symbol).toBe(tradelogData.symbol)
        expect(savedTradelog.price).toBe(tradelogData.price)
        expect(savedTradelog.unit).toBe(tradelogData.unit)
        expect(savedTradelog.transaction_date.toISOString()).toBe(
            moment(
                tradelogData.transaction_date,
                appConfig.format.date
            ).toISOString()
        )
    })

    it(`#${num++}:MODEL tradelog: can create tradelog with save method`, async () => {
        const tradelogData: ITradelog = TradeLogFactory.withState({
            type: TradeLogType.buy,
        }).make() as ITradelog

        // Create a new trade log record
        const newTradeLog = new Tradelog(tradelogData)

        // Save the new trade log record to the database
        const savedTradelog = await newTradeLog.save()

        expect(savedTradelog._id).toBeDefined()
        expect(savedTradelog.symbol).toBe(tradelogData.symbol)
        expect(savedTradelog.price).toBe(tradelogData.price)
        expect(savedTradelog.unit).toBe(tradelogData.unit)
        expect(savedTradelog.transaction_date.toISOString()).toBe(
            moment(
                tradelogData.transaction_date,
                appConfig.format.date
            ).toISOString()
        )
    })

    it(`#${num++}:MODEL tradelog: can retrieve all tradelog data`, async () => {
        await Tradelog.deleteAll()
        const tradelogData: ITradelog[] = (await TradeLogFactory.count(
            10
        ).create()) as ITradelog[]

        const req: Partial<Request> = {}

        const result = await Tradelog.search<
            ISearch<ITradelog>,
            Partial<Request>
        >(req)

        const resultDataFiltered = result.data.map((item: any) => ({
            symbol: item.symbol,
            price: item.price,
            unit: item.unit,
            transaction_date: item.transaction_date,
            type: item.type,
            _id: item._id?.toString(),
        }))

        const tradelogDataFiltered = tradelogData.map((item) => ({
            symbol: item.symbol,
            price: item.price,
            unit: item.unit,
            transaction_date: item.transaction_date,
            type: item.type,
            _id: item._id?.toString(),
        }))

        expect(resultDataFiltered).toEqual(tradelogDataFiltered)
        expect(result.status).toBe('success')
        expect(result.data).toHaveLength(10)
    })

    it(`#${num++}:MODEL tradelog: can retrieve all tradelog data with pagination`, async () => {
        let rs = await Tradelog.find({})
        const tradelogData = (await TradeLogFactory.count(
            30
        ).create()) as ITradelog[]

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

    it(`#${num++}:MODEL tradelog: can retrieve all tradelog data with pagination page 2`, async () => {
        const tradelogData = (await TradeLogFactory.count(
            30
        ).create()) as ITradelog[]
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

    it(`#${num++}:MODEL tradelog: can retrieve data with symbol filter`, async () => {
        const tradelogData = (await TradeLogFactory.count(
            30
        ).create()) as ITradelog[]

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

    it(`#${num++}:MODEL tradelog: can retrieve empty data`, async () => {
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
        expect(result.data).toHaveLength(0)
        expect(result.total).toBe(0)
    })
})
