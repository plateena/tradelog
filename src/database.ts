import mongoose, { Mongoose } from 'mongoose'

let connection: Mongoose

export interface DB {
    connect(): Promise<boolean>
    getConnection(): mongoose.Connection
    close(): void
}

const connect = async (): Promise<boolean> => {
    try {
        if (!connection) {
            const db_uri = `mongodb://${process.env.DB_URI}:${process.env.DB_PORT}/${process.env.DB_NAME}`
            connection = await mongoose.connect(db_uri, {
                user: process.env.DB_USER,
                pass: process.env.DB_PASS,
                authSource: process.env.DB_NAME,
                maxPoolSize: 10,
                socketTimeoutMS: 30000,
                connectTimeoutMS: 30000,
            })

            // console.log('Connected to MongoDB')
            return true
        }
    } catch (error) {
        console.error('error connecting to mongodb:', error)
        throw error
    }
    return false
}

const getConnection = (): mongoose.Connection => {
    if (!connection) {
        throw new Error('database connection has not been established.')
    }
    return connection.connection
}

const close = async (): Promise<void> => {
    if (!connection) {
        throw new Error('database connection has not been established.')
    }
    return connection.connection.close()
}

export default { connect, getConnection, close }
