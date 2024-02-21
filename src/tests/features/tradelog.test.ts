import request from 'supertest'
import { Server } from 'http'
import makeServer from './../make-app'
import { ITradelog, TradeLogType } from './../../types/interfaces'
import { faker } from '@faker-js/faker'
import { dateFormat } from '../../helpers'
import Tradelog from './../../models/tradelog'
import moment from 'moment'

// Mock the tradelog model
jest.mock('./../../models/tradelog')

let server: Server // Renamed 'app' to 'server' for clarity

describe('GET /api/tradelog', () => {
    beforeAll(async () => {
        server = await makeServer()
    })

    afterAll((done) => {
        server.close(done)
    })

    it('should return tradelog index', async () => {
        const response = await request(server).get('/api/v1/tradelog')
        expect(response.status).toBe(200)
        expect(response.text).toBe('get tradelog index')
    })

    it('can post tradelog', async () => {
        // Create tradelog faker data with type ITradeLog
        const buyDate = moment(faker.date.recent({ days: 21 })).format(
            dateFormat
        )
        const tradelogRequestData: ITradelog = {
            symbol: faker.lorem.word({ length: { min: 3, max: 7 } }),
            unit: faker.number.int({ min: 1, max: 900 }) * 100,
            price: parseFloat(faker.finance.amount({ min: 0.005, max: 200.0 })),
            transactionDate: buyDate as unknown as Date,
            type: TradeLogType.buy,
        }

        const tradelogSavedData = { ...tradelogRequestData }

        // Mock the return value from model save data transaction date as Date types
        tradelogSavedData.transactionDate = moment(buyDate, dateFormat).toDate()

        Tradelog.prototype.save.mockResolvedValue(tradelogSavedData)

        // Convert the date to string for last check because response.body returns all in string
        tradelogSavedData.transactionDate =
            tradelogSavedData.transactionDate.toISOString() as unknown as Date

        // Make the POST request to create tradelog
        const response = await request(server)
            .post('/api/v1/tradelog')
            .send(tradelogRequestData)

        // Assertions
        expect(response.status).toBe(201)
        expect(response.type).toBe('application/json')
        expect(response.body).toStrictEqual(tradelogSavedData)
    })
})
