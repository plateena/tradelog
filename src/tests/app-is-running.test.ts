import request, { Response } from 'supertest'
import { Server } from 'http'
import makeServer from './make-app'
import { DB_ERROR_MESSAGE } from '../app'

/**
 * @group app
 */

let app: Server

describe('App', () => {
    afterAll(() => {
        app.close()
    })

    it('is running app', async () => {
        app = await makeServer()
        let rs: Response = await request(app).get('/test-running')
        expect(rs.status).toBe(200)
        expect(rs.text).toBe('API is running')
        app.close()
    })

    it('can\'t connect to db', async () => {
        app = await makeServer(false)
        let rs: Response = await request(app).get('/test-running')
        expect(rs.status).toBe(500)
        expect(rs.text).toBe(DB_ERROR_MESSAGE)
        app.close()
    })

    it('can\'t connect to all route if db failed', async () => {
        app = await makeServer(false)
        let rs: Response = await request(app).get('/app')
        expect(rs.status).toBe(500)
        expect(rs.text).toBe(DB_ERROR_MESSAGE)
        app.close()
    })
})
