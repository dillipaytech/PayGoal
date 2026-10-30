import { config } from './config.js'
import { connectDb, disconnectDb } from './db.js'
import { createApp } from './app.js'

await connectDb()

// Listen on localhost only: the public reaches the API through nginx.
const server = createApp().listen(config.port, '127.0.0.1', () => {
  console.log(`PayGoal API listening on http://127.0.0.1:${config.port}`)
})

const shutdown = () => {
  server.close(async () => {
    await disconnectDb()
    process.exit(0)
  })
}
process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)
