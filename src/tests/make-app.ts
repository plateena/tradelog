import buildApp from '../app'
import { DB } from '../database'

const mockDB: DB = {
    connect: jest.fn(),
    getConnection: jest.fn(),
    close: jest.fn(),
}

export const makeServer = async () => {
    const app = await buildApp(mockDB)

    const portString: string | undefined = process.env.PORT
    const PORT: number = parseInt(portString || '3001', 10) // Port for Express server

    // Start server
    const server = app.listen(PORT, () => {
        // console.log(`Server is running on port ${PORT}`);
    })

    return server
}

export default makeServer
