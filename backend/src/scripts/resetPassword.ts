/**
 * Sets a new password for an existing account (partner or admin) without changing its role.
 *
 *   npm run reset-password -- --email user@example.com
 */
import { createInterface } from 'node:readline/promises'
import { parseArgs } from 'node:util'
import bcrypt from 'bcryptjs'
import { connectDb, disconnectDb } from '../db.js'
import { UserModel } from '../models/User.js'

const { values } = parseArgs({ options: { email: { type: 'string' } } })
const email = values.email?.trim().toLowerCase()
if (!email) {
  console.error('Usage: npm run reset-password -- --email user@example.com')
  process.exit(1)
}

const rl = createInterface({ input: process.stdin, output: process.stdout })
const password = process.env.NEW_PASSWORD ?? (await rl.question('New password (min 8 characters): '))
rl.close()
if (password.length < 8) {
  console.error('Password must be at least 8 characters.')
  process.exit(1)
}

await connectDb()
const user = await UserModel.findOne({ email })
if (!user) {
  console.error(`No account found for ${email}.`)
} else {
  user.passwordHash = await bcrypt.hash(password, 12)
  await user.save()
  console.log(`Password updated for ${email} (${user.role}).`)
}
await disconnectDb()
