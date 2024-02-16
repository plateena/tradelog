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
            connection = mongoose.createConnection(
                "mongodb://mongodb:27017/tradelog",
                {
                    user: "root",
                    pass: "example",
                    authSource: "admin",
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
