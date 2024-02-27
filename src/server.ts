import buildApp from '~/app'
import db from '~/database'
import dotenv from 'dotenv'
import { Server } from 'http'

// Load environment variables based on the environment
dotenv.config()

const PORT = process.env.PORT || 3000 // Port for Express server

let server: Server

const startApp = async () => {
    const app = await buildApp(db)
    // Start server

    // Custom route to close the server
    app.get('/close-server', (_, res) => {
        // Check if the server is already running
        if (server) {
            // Close the server
            server.close(() => {
                console.log('Server is closed')
                res.send('Server closed successfully')
            })
        } else {
            // If the server is not running, send a message
            res.status(500).send('Server is not running')
        }
    })

    server = app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
}

startApp()
