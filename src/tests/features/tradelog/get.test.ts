import request from 'supertest'
import { Server } from 'http'
import makeServer from '@tests/make-app'
import { genTradelogData } from '@tests/models/tradelog'
import Tradelog from '@models/tradelog'

const baseUrl = '/api/v1'
let app: Server

// Mock the tradelog model
jest.mock('@models/tradelog')

/**
 * @group controller/tradelog
 */
describe('GET /api/v1/tradelog', () => {
    beforeAll(async () => {
        app = await makeServer()
    })

    afterEach(async () => {
        await Tradelog.deleteAll()
    })

    afterAll((done) => {
        app.close(done)
    })

    it('can get all the trade logs', async () => {
        let aspectedData = genTradelogData(50)

        const mockSearch = jest
            .fn()
            .mockResolvedValue(aspectedData) as jest.MockedFunction<typeof Tradelog.search>
        Tradelog.search = mockSearch

        const response = await request(app).get(baseUrl + '/tradelog')

        expect(response.status).toBe(200)
        expect(response.body).toStrictEqual(aspectedData)
        expect(response.body).toHaveLength(50)
    })
})
