import buildApp from './app'
import db from './database'
import dotenv from 'dotenv'

// Load environment variables based on the environment
dotenv.config()

const PORT = process.env.PORT || 3000 // Port for Express server

const server = async () => {
    const app = await buildApp(db)
    // Start server
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
}

server()
