import mongoose from "mongoose"

let connection: mongoose.Mongoose

export interface DB {
    connect(): void
    getConnection(): mongoose.Connection
    close(): void
}

export async function connect(): Promise<void> {
    try {
        if (!connection) {
            connection = await mongoose.connect(
                "mongodb://mongodb:27017/tradelog",
                {
                    user: "root",
                    pass: "example",
                    authSource: "admin",
                    maxPoolSize: 10,
                }
            )

            await new Promise<void>((res, rej) => {
                mongoose.connection.once("connected", () => {
                    res()
                })
                mongoose.connection.on("error", (err) => {
                    rej(err)
                })
            })
        }
    } catch (error) {
        console.error("error connecting to mongodb:", error)
        throw error
    }
}

export function getConnection(): mongoose.Connection {
    if (!connection) {
        throw new Error("database connection has not been established.")
    }
    return connection.connection
}

export const close = async (): Promise<void> => {
    if (!connection) {
        throw new Error("database connection has not been established.")
    }
    return connection.connection.close()
}

connect()

export default { connect, getConnection, close }
