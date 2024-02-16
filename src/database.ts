import mongoose from "mongoose"

let connection: mongoose.Connection

export interface DB {
    connect(): void
    getConnection(): mongoose.Connection
    close(): void
}

const connect = async (): Promise<void> => {
    try {
        if (!connection) {
            const db_uri = `mongodb://${process.env.DB_URI}:${process.env.DB_PORT}/${process.env.DB_NAME}`
            connection = mongoose.createConnection(
                db_uri,
                {
                    user: process.env.DB_USER,
                    pass: process.env.DB_PASS,
                    authSource: process.env.DB_NAME,
                    maxPoolSize: 10,
                }
            )

            await new Promise<void>((resolve, reject) => {
                connection.on("connected", () => {
                    resolve()
                })
                connection.on("error", (err) => {
                    reject(err)
                })
            })
        }
    } catch (error) {
        console.error("error connecting to mongodb:", error)
        throw error
    }
}

const getConnection = (): mongoose.Connection => {
    if (!connection) {
        throw new Error("database connection has not been established.")
    }
    return connection
}

const close =  async (): Promise<void> => {
    if (!connection) {
        throw new Error("database connection has not been established.")
    }
    return connection.close()
}

export default { connect, getConnection, close }
