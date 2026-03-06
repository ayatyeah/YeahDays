import 'dotenv/config'
import bcrypt from 'bcryptjs'
import cors from 'cors'
import express from 'express'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import { authRequired } from './middleware/auth.js'
import { User } from './models/User.js'
import { UserData } from './models/UserData.js'
import { calculateAccountStats } from './utils/stats.js'

const app = express()
let dbReady = false

app.use(
  cors({
    origin: (origin, callback) => {
      const configured = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)

      const isLocalhostDevOrigin =
        typeof origin === 'string' &&
        /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin)

      const isLanDevOrigin =
        typeof origin === 'string' && /^https?:\/\/192\.168\.\d+\.\d+(:\d+)?$/i.test(origin)

      const isDigitalOceanAppOrigin =
        typeof origin === 'string' && /^https?:\/\/[a-z0-9-]+\.ondigitalocean\.app$/i.test(origin)

      if (
        !origin ||
        configured.includes(origin) ||
        isLocalhostDevOrigin ||
        isLanDevOrigin ||
        isDigitalOceanAppOrigin
      ) {
        callback(null, true)
        return
      }

      callback(new Error('CORS not allowed'))
    },
    credentials: false,
  }),
)
app.use(express.json({ limit: '1mb' }))

function requireDbReady(_req, res, next) {
  if (!dbReady) {
    return res.status(503).json({
      error: 'Database unavailable. Check MONGODB_URI/network and restart API.',
    })
  }

  next()
}

function signToken(userId) {
  return jwt.sign({}, process.env.JWT_SECRET, {
    subject: userId,
    expiresIn: '30d',
  })
}

async function getOrCreateData(userId) {
  const existing = await UserData.findOne({ userId })
  if (existing) {
    return existing
  }

  return UserData.create({
    userId,
    tasks: [],
    records: {},
    theme: 'dark',
  })
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, dbReady })
})

app.post('/api/auth/register', requireDbReady, async (req, res) => {
  const { email, password } = req.body ?? {}

  if (!email || !password || password.length < 6) {
    return res.status(400).json({ error: 'Email and password (min 6 chars) are required' })
  }

  const normalizedEmail = String(email).trim().toLowerCase()
  const exists = await User.findOne({ email: normalizedEmail })
  if (exists) {
    return res.status(409).json({ error: 'Account already exists' })
  }

  const passwordHash = await bcrypt.hash(String(password), 10)
  const user = await User.create({ email: normalizedEmail, passwordHash })
  await getOrCreateData(user._id)

  return res.status(201).json({
    token: signToken(String(user._id)),
    user: { email: user.email },
  })
})

app.post('/api/auth/login', requireDbReady, async (req, res) => {
  const { email, password } = req.body ?? {}
  const normalizedEmail = String(email || '').trim().toLowerCase()

  const user = await User.findOne({ email: normalizedEmail })
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  const valid = await bcrypt.compare(String(password || ''), user.passwordHash)
  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  return res.json({
    token: signToken(String(user._id)),
    user: { email: user.email },
  })
})

app.get('/api/auth/me', requireDbReady, authRequired, async (req, res) => {
  const user = await User.findById(req.auth.userId)
  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }

  const data = await getOrCreateData(user._id)
  const stats = calculateAccountStats(data.tasks, data.records || {})

  return res.json({
    user: { email: user.email },
    stats,
  })
})

app.get('/api/data', requireDbReady, authRequired, async (req, res) => {
  const data = await getOrCreateData(req.auth.userId)
  const stats = calculateAccountStats(data.tasks, data.records || {})

  return res.json({
    tasks: data.tasks,
    records: data.records || {},
    theme: data.theme,
    stats,
    updatedAt: data.updatedAt ? data.updatedAt.toISOString() : null,
  })
})

app.put('/api/data', requireDbReady, authRequired, async (req, res) => {
  const payload = req.body ?? {}
  const tasks = Array.isArray(payload.tasks) ? payload.tasks : []
  const records = typeof payload.records === 'object' && payload.records ? payload.records : {}
  const theme = payload.theme === 'light' ? 'light' : 'dark'

  const updated = await UserData.findOneAndUpdate(
    { userId: req.auth.userId },
    { tasks, records, theme },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  )

  const stats = calculateAccountStats(updated.tasks, updated.records || {})
  return res.json({
    ok: true,
    stats,
    updatedAt: updated.updatedAt ? updated.updatedAt.toISOString() : null,
  })
})

app.post('/api/data/reset', requireDbReady, authRequired, async (req, res) => {
  await UserData.findOneAndUpdate(
    { userId: req.auth.userId },
    { tasks: [], records: {} },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  )

  return res.json({ ok: true })
})

app.use((error, _req, res, _next) => {
  console.error(error)
  res.status(500).json({ error: 'Internal server error' })
})

const port = Number(process.env.PORT || 4000)

app.listen(port, () => {
  console.log(`YeahDays API listening on http://localhost:${port}`)
})

mongoose.connection.on('connected', () => {
  dbReady = true
  console.log('MongoDB connected')
})

mongoose.connection.on('disconnected', () => {
  dbReady = false
  console.error('MongoDB disconnected')
})

mongoose.connect(process.env.MONGODB_URI).catch((error) => {
  dbReady = false
  console.error('MongoDB connection failed:', error.message)
})
