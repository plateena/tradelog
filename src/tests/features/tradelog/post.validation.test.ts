import request from 'supertest'
import { Server } from 'http'
import makeServer from './../../make-app'
import { ERROR_MESSAGES } from '@middleware/validations/tradelog'
import { genTradelogData } from '@tests/models/tradelog'
import { ITradelog, TradeLogType } from '@type/interfaces'

/**
 * @group validation/tradelog
 */

const baseUrl = '/api/v1'

// Mock the tradelog model
jest.mock('@models/tradelog')

let app: Server // Renamed 'app' to 'server' for clarity

describe('Validation POST /api/tradelog', () => {
    beforeAll(async () => {
        app = await makeServer()
    })

    afterAll((done) => {
        app.close(done)
    })

    it('should return validation error if request body is invalid', async () => {
        const invalidData = {
            // Invalid data here
        }

        const response = await request(app)
            .post(baseUrl + '/tradelog')
            .send(invalidData)
            .expect(400)

        // Assert that response contains validation errors
        expect(response.body.errors).toBeDefined()
        expect(response.body.errors.length).toBeGreaterThan(0)
    })

    it('should return 400 if symbol is missing', async () => {
        let { symbol, ...tradelogData } = genTradelogData() as ITradelog
        const response = await request(app)
            .post(baseUrl + '/tradelog')
            .send(tradelogData)
        expect(response.status).toBe(400)
        expect(response.body.errors[0].msg).toBe(ERROR_MESSAGES.SYMBOL_REQUIRED)
    })

    it('should return 400 if genTradelogDatad', async () => {
        const tradelogData = genTradelogData() as ITradelog
        tradelogData.price = -1
        const response = await request(app)
            .post(baseUrl + '/tradelog')
            .send(tradelogData)
        expect(response.status).toBe(400)
        expect(response.body.errors[0].msg).toBe(
            ERROR_MESSAGES.PRICE_INVALID(-1)
        )
    })

    it('should return 400 if genTradelogData increments of 0.005', async () => {
        const tradelogData = genTradelogData() as ITradelog
        tradelogData.price = 0.081
        const response = await request(app)
            .post(baseUrl + '/tradelog')
            .send(tradelogData)
        expect(response.status).toBe(400)
        expect(response.body.errors[0].msg).toBe(ERROR_MESSAGES.PRICE_INCREMENT)
    })

    it('should return 400 if transaction date is not a valid recent date', async () => {
        const invalidTransactionDate = '2022-01/02' // Invalid transaction date format
        const tradelogData = genTradelogData() as ITradelog
        tradelogData.transaction_date =
            invalidTransactionDate as unknown as Date
        const response = await request(app)
            .post(baseUrl + '/tradelog')
            .send(tradelogData)

        // Expect a 400 status code
        expect(response.status).toBe(400)

        // Expect the error message to match the expected message for an invalid transaction date format
        expect(response.body.errors[0].msg).toMatch(
            ERROR_MESSAGES.TRANSACTION_DATE_FORMAT(invalidTransactionDate)
        )
    })
genTradelogData
    it('should return 400 if unit is not a positive integer', async () => {
        const tradelogData = genTradelogData() as ITradelog
        tradelogData.unit = 0
        const response = await request(app)
            .post(baseUrl + '/tradelog')
            .send(tradelogData)
        expect(response.status).toBe(400)
        expect(response.body.errors[0].msg).toBe(
            ERROR_MESSAGES.UNIT_POSITIVE_INTEGER
        )
    })
genTradelogData
    it('should return 400 if type is invalid', async () => {
        const tradelogData = genTradelogData() as ITradelog
        tradelogData.type = 'invalid' as TradeLogType
        const response = await request(app)
            .post(baseUrl + '/tradelog')
            .send(tradelogData)
        expect(response.status).toBe(400)
        expect(response.body.errors[0].msg).toBe(
            ERROR_MESSAGES.INVALID_TRADE_LOG_TYPE('invalid')
        )
    })
})
