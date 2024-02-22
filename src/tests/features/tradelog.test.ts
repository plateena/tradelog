import request from 'supertest'
import { Server } from 'http'
import makeServer from './../make-app'
import { ITradelog, TradeLogType } from './../../types/interfaces'
import { faker } from '@faker-js/faker'
import { dateFormat } from '../../helpers'
import Tradelog from './../../models/tradelog'
import moment from 'moment'

const baseUrl = '/api/v1'

// Mock the tradelog model
jest.mock('./../../models/tradelog')

let app: Server // Renamed 'app' to 'server' for clarity

describe('POST /api/tradelog', () => {
    beforeAll(async () => {
        app = await makeServer()
    })

    afterAll((done) => {
        app.close(done)
    })

    it('can post tradelog', async () => {
        // Create tradelog faker data with type ITradeLog
        const buyDate = moment(faker.date.recent({ days: 21 })).format(
            dateFormat
        )
        const tradelogRequestData: ITradelog = {
            symbol: faker.lorem.word({ length: { min: 3, max: 7 } }),
            unit: faker.number.int({ min: 1, max: 900 }) * 100,
            price: (faker.number.int({ min: 1, max: 9000000 }) * 5) / 1000,
            transaction_date: buyDate as unknown as Date,
            type: TradeLogType.buy,
        }

        const tradelogSavedData = { ...tradelogRequestData }

        // Mock the return value from model save data transaction date as Date types
        tradelogSavedData.transaction_date = moment(
            buyDate,
            dateFormat
        ).toDate()

        Tradelog.prototype.save.mockResolvedValue(tradelogSavedData)

        // Convert the date to string for last check because response.body returns all in string
        tradelogSavedData.transaction_date =
            tradelogSavedData.transaction_date.toISOString() as unknown as Date

        // Make the POST request to create tradelog
        const response = await request(app)
            .post(baseUrl + '/tradelog')
            .send(tradelogRequestData)

        // Assertions
        expect(response.type).toBe('application/json')
        expect(response.body).toStrictEqual(tradelogSavedData)
        expect(response.status).toBe(201)
    })
})
