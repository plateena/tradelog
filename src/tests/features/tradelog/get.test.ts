import request from 'supertest'
import { Server } from 'http'
import makeServer from '@tests/make-app'
import { genTradelogData } from '@tests/models/tradelog'

const baseUrl = '/api/v1'
let app: Server

/**
 * @group controller/tradelog
 */

describe('GET /api/v1/tradelog', () => {
    beforeAll(async () => {
        app = await makeServer()
    })

    afterAll((done) => {
        app.close(done)
    })

    it('can get all the trade logs', async () => {
        let aspectedData = genTradelogData(10)
        const response = await request(app).get(baseUrl + '/tradelog')

        expect(response.status).toBe(200)
        expect(response.body).toStrictEqual(aspectedData)
    })
})
