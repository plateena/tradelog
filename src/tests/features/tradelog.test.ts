import request from 'supertest'
import { Server } from 'http'
import makeServer from './../make-app'

let app: Server

describe('GET /api/tradelog', () => {
    afterAll(() => {
        app.close()
    })

    it('shout return get tradelog index', async () => {
        app = await makeServer()
        const response = await request(app).get('/api/v1/tradelog')
        expect(response.status).toBe(200)
        expect(response.text).toBe('get tradelog index')
    })
})
