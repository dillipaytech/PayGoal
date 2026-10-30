/**
 * Creates (or promotes) a PayGoal admin account.
 *
 *   npm run create-admin -- --email you@paygoal.in --name "Your Name"
 *
 * You will be asked for a password. There are no default admin credentials.
 */
import { createInterface } from 'node:readline/promises'
import { parseArgs } from 'node:util'
import bcrypt from 'bcryptjs'
import { connectDb, disconnectDb } from '../db.js'
import { UserModel } from '../models/User.js'

const { values } = parseArgs({ options: { email: { type: 'string' }, name: { type: 'string' } } })
const email = values.email?.trim().toLowerCase()
const name = values.name?.trim() || 'PayGoal Admin'
if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
  console.error('Usage: npm run create-admin -- --email you@paygoal.in --name "Your Name"')
  process.exit(1)
}

const rl = createInterface({ input: process.stdin, output: process.stdout })
const password = process.env.ADMIN_PASSWORD ?? (await rl.question('Password (min 8 characters): '))
rl.close()
if (password.length < 8) {
  console.error('Password must be at least 8 characters.')
  process.exit(1)
}

await connectDb()
const passwordHash = await bcrypt.hash(password, 12)
const existing = await UserModel.findOne({ email })
if (existing) {
  existing.role = 'admin'
  existing.status = 'approved'
  existing.passwordHash = passwordHash
  await existing.save()
  console.log(`Updated ${email}: now an admin with the new password.`)
} else {
  await UserModel.create({ email, name, passwordHash, role: 'admin', status: 'approved', onboarding: [] })
  console.log(`Created admin ${email}.`)
}
await disconnectDb()
