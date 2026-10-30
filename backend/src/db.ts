import mongoose from 'mongoose'
import { config } from './config.js'

/**
 * Connects to MongoDB, always to the dedicated PayGoal database (config.dbName).
 * This app never drops databases or collections; it only creates its own
 * collections (users, enquiries, tickets) and their indexes inside that database.
 */
export async function connectDb() {
  mongoose.set('strictQuery', true)
  await mongoose.connect(config.mongoUri, { dbName: config.dbName, serverSelectionTimeoutMS: 10_000 })
  console.log(`MongoDB connected (database: ${mongoose.connection.name})`)
}

export async function disconnectDb() {
  await mongoose.disconnect()
}
