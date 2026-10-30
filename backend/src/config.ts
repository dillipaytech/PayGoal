function required(name: string): string {
  const v = process.env[name]
  if (!v) throw new Error(`Missing required environment variable ${name}. See backend/.env.example.`)
  return v
}

const jwtSecret = required('JWT_SECRET')
if (jwtSecret.length < 32 || jwtSecret.startsWith('change-me')) {
  throw new Error('JWT_SECRET must be a random string of at least 32 characters.')
}

const dbName = process.env.MONGODB_DB ?? 'paygoal'
// Safety: this app must only ever use its own database, never another project's.
if (!/^paygoal[a-z0-9_-]*$/i.test(dbName)) {
  throw new Error(`MONGODB_DB must start with "paygoal" (got "${dbName}"). Refusing to start.`)
}

export const config = {
  port: Number(process.env.PORT ?? 4100),
  mongoUri: required('MONGODB_URI'),
  dbName,
  jwtSecret,
  cookieSecure: process.env.COOKIE_SECURE === 'true',
  isProd: process.env.NODE_ENV === 'production',
  sessionDays: 7,
}
