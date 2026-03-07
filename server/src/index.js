import 'dotenv/config'
import bcrypt from 'bcryptjs'
import cors from 'cors'
import express from 'express'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import { randomUUID } from 'node:crypto'
import { authRequired } from './middleware/auth.js'
import { Task } from './TASKS/Task.js'
import { User } from './models/User.js'
import { UserData } from './models/UserData.js'
import { calculateAccountStats } from './utils/stats.js'

const app = express()
let dbReady = false
let dbErrorHint = null
const validWeekdays = new Set(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'])

function summarizeDbError(error) {
  const message = String(error?.message || '').toLowerCase()

  if (message.includes('authentication failed') || message.includes('bad auth')) {
    return 'Mongo auth failed: check MONGODB_URI username/password and Database Access user.'
  }

  if (message.includes('querysrv') || message.includes('getaddrinfo') || message.includes('enotfound')) {
    return 'Mongo DNS lookup failed: verify Atlas hostname in MONGODB_URI.'
  }

  if (message.includes('timed out') || message.includes('timeout')) {
    return 'Mongo network timeout: check Atlas Network Access IP allowlist.'
  }

  if (message.includes('ssl') || message.includes('tls')) {
    return 'Mongo TLS/SSL error: verify Atlas URI options and certificate requirements.'
  }

  if (message.includes('uri') || message.includes('connection string')) {
    return 'Mongo URI format error: verify full mongodb+srv URI including database name.'
  }

  return 'Mongo connection failed: check API runtime logs for details.'
}

function parseMongoUriInfo(uri) {
  if (!uri || typeof uri !== 'string') {
    return { configured: false, scheme: null, host: null }
  }

  const trimmed = uri.trim().replace(/^"|"$/g, '')
  const schemeMatch = trimmed.match(/^(mongodb(?:\+srv)?):\/\//i)
  const scheme = schemeMatch ? schemeMatch[1].toLowerCase() : null

  const withoutScheme = schemeMatch ? trimmed.slice(schemeMatch[0].length) : trimmed
  const afterCreds = withoutScheme.includes('@') ? withoutScheme.split('@')[1] : withoutScheme
  const host = afterCreds.split('/')[0]?.split('?')[0] || null

  return {
    configured: true,
    scheme,
    host,
  }
}

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
    return res.status(500).json({
      error: 'Database unavailable. Check MONGODB_URI/network and restart API.',
      code: 'DB_NOT_READY',
      details: dbErrorHint,
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

function clampScore(value) {
  const raw = Number(value)
  if (!Number.isFinite(raw) || raw < 0) {
    return 0
  }

  return Math.floor(raw)
}

function sanitizeTask(rawTask) {
  const task = rawTask && typeof rawTask === 'object' ? rawTask : {}
  const plannedDate =
    typeof task.plannedDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(task.plannedDate)
      ? task.plannedDate
      : undefined
  const reminderTime =
    typeof task.reminderTime === 'string' && /^\d{2}:\d{2}$/.test(task.reminderTime)
      ? task.reminderTime
      : undefined
  const schedule = Array.isArray(task.schedule)
    ? task.schedule.filter((item) => typeof item === 'string' && validWeekdays.has(item))
    : []

  return {
    id: typeof task.id === 'string' && task.id.trim() ? task.id.trim() : randomUUID(),
    name: typeof task.name === 'string' && task.name.trim() ? task.name.trim() : 'Untitled task',
    weight: Math.min(5, Math.max(1, Number(task.weight) || 1)),
    icon: typeof task.icon === 'string' && task.icon.trim() ? task.icon.trim().slice(0, 2) : undefined,
    schedule: plannedDate ? [] : schedule,
    plannedDate,
    reminderTime,
  }
}

function toTaskPayload(taskDoc) {
  return {
    id: taskDoc.id,
    name: taskDoc.name,
    weight: taskDoc.weight,
    icon: taskDoc.icon,
    schedule: Array.isArray(taskDoc.schedule) ? taskDoc.schedule : [],
    plannedDate: taskDoc.plannedDate,
    reminderTime: taskDoc.reminderTime,
  }
}

async function replaceTasksForUser(userId, taskList) {
  const normalized = Array.isArray(taskList) ? taskList.map(sanitizeTask) : []
  await Task.deleteMany({ userId })
  if (normalized.length === 0) {
    return []
  }

  await Task.insertMany(
    normalized.map((task) => ({
      userId,
      ...task,
    })),
  )

  return normalized
}

async function getTasksForUser(userId, legacyTasks = []) {
  let tasks = await Task.find({ userId }).sort({ createdAt: 1 }).lean()

  if (tasks.length === 0 && Array.isArray(legacyTasks) && legacyTasks.length > 0) {
    await Task.insertMany(
      legacyTasks.map((task) => ({
        userId,
        ...sanitizeTask(task),
      })),
    )

    // Clean legacy embedded tasks after one-time migration.
    await UserData.findOneAndUpdate({ userId }, { tasks: [] })
    tasks = await Task.find({ userId }).sort({ createdAt: 1 }).lean()
  }

  return tasks.map(toTaskPayload)
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
    gameHighScore: 0,
  })
}

app.get('/api/health', (_req, res) => {
  const uriInfo = parseMongoUriInfo(process.env.MONGODB_URI)

  res.json({
    ok: true,
    dbReady,
    dbError: dbReady ? null : dbErrorHint,
    mongoUri: uriInfo,
  })
})

const registerHandler = async (req, res) => {
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
}

app.post('/api/auth/register', requireDbReady, registerHandler)
app.post('/auth/register', requireDbReady, registerHandler)

const loginHandler = async (req, res) => {
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
}

app.post('/api/auth/login', requireDbReady, loginHandler)
app.post('/auth/login', requireDbReady, loginHandler)

const meHandler = async (req, res) => {
  const user = await User.findById(req.auth.userId)
  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }

  const data = await getOrCreateData(user._id)
  const tasks = await getTasksForUser(user._id, data.tasks)
  const stats = calculateAccountStats(tasks, data.records || {})

  return res.json({
    user: { email: user.email },
    stats,
  })
}

app.get('/api/auth/me', requireDbReady, authRequired, meHandler)
app.get('/auth/me', requireDbReady, authRequired, meHandler)

const getDataHandler = async (req, res) => {
  const data = await getOrCreateData(req.auth.userId)
  const tasks = await getTasksForUser(req.auth.userId, data.tasks)
  const stats = calculateAccountStats(tasks, data.records || {})

  return res.json({
    tasks,
    records: data.records || {},
    theme: data.theme,
    gameHighScore: data.gameHighScore || 0,
    stats,
    updatedAt: data.updatedAt ? data.updatedAt.toISOString() : null,
  })
}

app.get('/api/data', requireDbReady, authRequired, getDataHandler)
app.get('/data', requireDbReady, authRequired, getDataHandler)

const putDataHandler = async (req, res) => {
  const payload = req.body ?? {}
  const tasks = await replaceTasksForUser(req.auth.userId, payload.tasks)
  const records = typeof payload.records === 'object' && payload.records ? payload.records : {}
  const theme = payload.theme === 'light' ? 'light' : 'dark'

  const updated = await UserData.findOneAndUpdate(
    { userId: req.auth.userId },
    { records, theme },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  )

  const stats = calculateAccountStats(tasks, updated.records || {})
  return res.json({
    ok: true,
    stats,
    updatedAt: updated.updatedAt ? updated.updatedAt.toISOString() : null,
  })
}

app.put('/api/data', requireDbReady, authRequired, putDataHandler)
app.put('/data', requireDbReady, authRequired, putDataHandler)
app.post('/api/data', requireDbReady, authRequired, putDataHandler)
app.post('/data', requireDbReady, authRequired, putDataHandler)

const upsertTaskHandler = async (req, res) => {
  const sanitizedTask = sanitizeTask(req.body?.task)

  await Task.findOneAndUpdate(
    { userId: req.auth.userId, id: sanitizedTask.id },
    { userId: req.auth.userId, ...sanitizedTask },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  )

  const data = await getOrCreateData(req.auth.userId)
  const tasks = await getTasksForUser(req.auth.userId)
  const stats = calculateAccountStats(tasks, data.records || {})

  return res.json({ ok: true, task: sanitizedTask, stats })
}

app.post('/api/tasks/upsert', requireDbReady, authRequired, upsertTaskHandler)
app.post('/tasks/upsert', requireDbReady, authRequired, upsertTaskHandler)

const deleteTaskHandler = async (req, res) => {
  const taskId = String(req.params.taskId || '').trim()
  if (!taskId) {
    return res.status(400).json({ error: 'taskId is required' })
  }

  await Task.deleteOne({ userId: req.auth.userId, id: taskId })
  const data = await getOrCreateData(req.auth.userId)
  const tasks = await getTasksForUser(req.auth.userId)
  const records = Object.fromEntries(
    Object.entries(data.records || {}).map(([date, record]) => [
      date,
      {
        ...(record || {}),
        completedTaskIds: Array.isArray(record?.completedTaskIds)
          ? record.completedTaskIds.filter((id) => id !== taskId)
          : [],
      },
    ]),
  )

  const updatedData = await UserData.findOneAndUpdate(
    { userId: req.auth.userId },
    { records },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  )

  const stats = calculateAccountStats(tasks, updatedData.records || {})
  return res.json({ ok: true, stats })
}

app.delete('/api/tasks/:taskId', requireDbReady, authRequired, deleteTaskHandler)
app.delete('/tasks/:taskId', requireDbReady, authRequired, deleteTaskHandler)

const resetDataHandler = async (req, res) => {
  await Promise.all([
    UserData.findOneAndUpdate(
      { userId: req.auth.userId },
      { tasks: [], records: {} },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    ),
    Task.deleteMany({ userId: req.auth.userId }),
  ])

  return res.json({ ok: true })
}

app.post('/api/data/reset', requireDbReady, authRequired, resetDataHandler)
app.post('/data/reset', requireDbReady, authRequired, resetDataHandler)

const submitGameScoreHandler = async (req, res) => {
  const submittedScore = clampScore(req.body?.score)
  const data = await getOrCreateData(req.auth.userId)
  const previousBest = data.gameHighScore || 0
  const gameHighScore = Math.max(previousBest, submittedScore)

  if (gameHighScore !== previousBest) {
    data.gameHighScore = gameHighScore
    await data.save()
  }

  return res.json({
    ok: true,
    score: submittedScore,
    highScore: gameHighScore,
    improved: gameHighScore > previousBest,
  })
}

app.post('/api/game/score', requireDbReady, authRequired, submitGameScoreHandler)
app.post('/game/score', requireDbReady, authRequired, submitGameScoreHandler)

const leaderboardHandler = async (_req, res) => {
  const top = await UserData.find({ gameHighScore: { $gt: 0 } })
    .sort({ gameHighScore: -1, updatedAt: 1 })
    .limit(20)
    .lean()

  const userIds = top.map((entry) => String(entry.userId))
  const users = await User.find({ _id: { $in: userIds } }).lean()
  const emailById = new Map(users.map((item) => [String(item._id), item.email]))

  const leaderboard = top.map((entry, index) => ({
    rank: index + 1,
    userEmail: emailById.get(String(entry.userId)) || 'unknown@user',
    highScore: entry.gameHighScore || 0,
  }))

  return res.json({ leaderboard })
}

app.get('/api/game/leaderboard', requireDbReady, authRequired, leaderboardHandler)
app.get('/game/leaderboard', requireDbReady, authRequired, leaderboardHandler)

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
  dbErrorHint = null
  console.log('MongoDB connected')
})

mongoose.connection.on('disconnected', () => {
  dbReady = false
  dbErrorHint = 'Mongo disconnected: check Atlas availability and network allowlist.'
  console.error('MongoDB disconnected')
})

mongoose.connect(process.env.MONGODB_URI).catch((error) => {
  dbReady = false
  dbErrorHint = summarizeDbError(error)
  console.error('MongoDB connection failed:', error.message)
})
