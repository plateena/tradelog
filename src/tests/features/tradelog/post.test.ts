import request from 'supertest'
import { Server } from 'http'
import makeServer from '@tests/make-app'
import { ITradelog } from '@type/interface'
import { TradeLogType } from '@type/enums'
import { faker } from '@faker-js/faker'
import { dateFormat } from '~/helpers'
import Tradelog from '@models/tradelog'
import moment from 'moment'
import { genTradelogData } from '@tests/models/tradelog'

/**
 * @group controller/tradelog
 */
const baseUrl = '/api/v1'

// Mock the tradelog model
jest.mock('@models/tradelog')

let app: Server

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
        const tradelogRequestData: ITradelog = genTradelogData() as ITradelog

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
