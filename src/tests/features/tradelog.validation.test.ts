import request from 'supertest'
import { Server } from 'http'
import makeServer from './../make-app'
import { ITradelog, TradeLogType } from './../../types/interfaces'
import { faker } from '@faker-js/faker'
import { dateFormat } from '../../helpers'
import Tradelog from './../../models/tradelog'
import moment from 'moment'
import { ERROR_MESSAGES } from './../../middleware/validations/tradelog'

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
        const response = await request(app)
            .post(baseUrl + '/tradelog')
            .send({
                price: 0.01,
                unit: 10,
                transaction_date: '2022-01-01',
                type: 'buy',
            })
        expect(response.status).toBe(400)
        expect(response.body.errors[0].msg).toBe(ERROR_MESSAGES.SYMBOL_REQUIRED)
    })

    it('should return 400 if price is invalid', async () => {
        const response = await request(app)
            .post(baseUrl + '/tradelog')
            .send({
                symbol: faker.lorem.word(),
                price: -1,
                unit: 10,
                transaction_date: '2022-01-01',
                type: 'buy',
            })
        expect(response.status).toBe(400)
        expect(response.body.errors[0].msg).toBe(ERROR_MESSAGES.PRICE_INVALID(-1))
    })

    it('should return 400 if price is not in increments of 0.005', async () => {
        const response = await request(app)
            .post(baseUrl + '/tradelog')
            .send({
                symbol: faker.lorem.word(),
                price: 0.081,
                unit: 10,
                transaction_date: '2022-01-01',
                type: 'buy',
            })
        expect(response.status).toBe(400)
        expect(response.body.errors[0].msg).toBe(ERROR_MESSAGES.PRICE_INCREMENT)
    })

    it('should return 400 if transaction date is not a valid recent date', async () => {
        const invalidTransactionDate = '2022-01/02' // Invalid transaction date format
        const response = await request(app)
            .post(baseUrl + '/tradelog')
            .send({
                symbol: faker.lorem.word(),
                price: 0.01,
                unit: 10,
                transaction_date: invalidTransactionDate,
                type: 'buy',
            })

        // Expect a 400 status code
        expect(response.status).toBe(400)

        // Expect the error message to match the expected message for an invalid transaction date format
        expect(response.body.errors[0].msg).toMatch(
            ERROR_MESSAGES.TRANSACTION_DATE_FORMAT(invalidTransactionDate)
        )
    })

    it('should return 400 if unit is not a positive integer', async () => {
        const response = await request(app)
            .post(baseUrl + '/tradelog')
            .send({
                symbol: faker.lorem.word(),
                price: 0.01,
                unit: 0,
                transaction_date: '2022-01-01',
                type: 'buy',
            })
        expect(response.status).toBe(400)
        expect(response.body.errors[0].msg).toBe(
            ERROR_MESSAGES.UNIT_POSITIVE_INTEGER
        )
    })

    it('should return 400 if type is invalid', async () => {
        const response = await request(app)
            .post(baseUrl + '/tradelog')
            .send({
                symbol: faker.lorem.word(),
                price: 0.01,
                unit: 10,
                transaction_date: '2022-01-01',
                type: 'invalid',
            })
        expect(response.status).toBe(400)
        expect(response.body.errors[0].msg).toBe(
            ERROR_MESSAGES.INVALID_TRADE_LOG_TYPE('invalid')
        )
    })
})
