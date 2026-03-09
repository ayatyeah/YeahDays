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

function looksCorruptedTaskName(value) {
  if (typeof value !== 'string') {
    return true
  }

  // U+FFFD appears when decoding/encoding already failed before reaching the API.
  if (value.includes('\uFFFD')) {
    return true
  }

  // Guard against lossy names like "????????? 9990" from broken terminal/codepage input.
  if (/\?{3,}/.test(value)) {
    const meaningful = value.replace(/[?\d\s\-_,.!:;()\[\]{}]+/g, '')
    if (meaningful.length === 0) {
      return true
    }
  }

  return false
}

function sanitizeTask(rawTask, options = {}) {
  const strictName = options.strictName === true
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
  const normalizedName = typeof task.name === 'string' ? task.name.trim() : ''

  if (strictName && (normalizedName.length === 0 || looksCorruptedTaskName(normalizedName))) {
    return null
  }

  return {
    id: typeof task.id === 'string' && task.id.trim() ? task.id.trim() : randomUUID(),
    name: normalizedName || 'Untitled task',
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
  const normalizedRaw = Array.isArray(taskList)
    ? taskList
        .map((task) => sanitizeTask(task, { strictName: true }))
        .filter((task) => task !== null)
    : []

  // Keep one task per id to avoid unique index collisions on bulk replace.
  const byId = new Map(normalizedRaw.map((task) => [task.id, task]))
  const normalized = Array.from(byId.values())

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

function pruneRecordTaskRefs(records, validTaskIds) {
  const allowedIds = new Set(validTaskIds)
  const source = records && typeof records === 'object' ? records : {}

  return Object.fromEntries(
    Object.entries(source).map(([date, record]) => {
      const completedTaskIds = Array.isArray(record?.completedTaskIds)
        ? record.completedTaskIds.filter((id) => allowedIds.has(id))
        : []

      return [
        date,
        {
          ...(record || {}),
          completedTaskIds,
        },
      ]
    }),
  )
}

function isIsoDate(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
}

function normalizeCompletedTaskIds(value) {
  if (!Array.isArray(value)) {
    return []
  }

  const unique = new Set()
  for (const item of value) {
    if (typeof item === 'string' && item.trim()) {
      unique.add(item.trim())
    }
  }

  return Array.from(unique)
}

function normalizeRecords(records, validTaskIds) {
  const source = records && typeof records === 'object' ? records : {}
  const validTaskIdSet = new Set(validTaskIds)
  const normalized = {}

  for (const [date, record] of Object.entries(source)) {
    if (!isIsoDate(date)) {
      continue
    }

    const completedTaskIds = normalizeCompletedTaskIds(record?.completedTaskIds).filter((id) =>
      validTaskIdSet.has(id),
    )

    normalized[date] = {
      date,
      completedTaskIds,
    }
  }

  return normalized
}

function toCloudResponse({ tasks, data, stats, staleIgnored = false }) {
  return {
    ok: true,
    staleIgnored,
    tasks,
    records: data.records || {},
    theme: data.theme,
    gameHighScore: data.gameHighScore || 0,
    stats,
    updatedAt: data.updatedAt ? data.updatedAt.toISOString() : null,
  }
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
    lastClientChangeAt: 0,
  })
}

app.get('/api/health', (_req, res) => {
  const uriInfo = parseMongoUriInfo(process.env.MONGODB_URI)

  res.json({
    ok: true,
    dbReady,
    dbError: dbReady ? null : dbErrorHint,
    dbName: mongoose.connection?.name || null,
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
  const clientLastChangeAt = Number(payload.clientLastChangeAt)
  const safeClientChangeAt = Number.isFinite(clientLastChangeAt) && clientLastChangeAt > 0 ? clientLastChangeAt : Date.now()

  const currentData = await getOrCreateData(req.auth.userId)
  const serverLastChangeAt = Number(currentData.lastClientChangeAt || 0)
  if (safeClientChangeAt < serverLastChangeAt) {
    const tasks = await getTasksForUser(req.auth.userId, currentData.tasks)
    const stats = calculateAccountStats(tasks, currentData.records || {})
    return res.json({
      ok: true,
      staleIgnored: true,
      stats,
      updatedAt: currentData.updatedAt ? currentData.updatedAt.toISOString() : null,
    })
  }

  // Tasks are managed only by dedicated /api/tasks routes to avoid accidental wipes by stale snapshots.
  const tasks = await getTasksForUser(req.auth.userId, currentData.tasks)
  const records = typeof payload.records === 'object' && payload.records ? payload.records : {}
  const theme = payload.theme === 'light' ? 'light' : 'dark'

  const updated = await UserData.findOneAndUpdate(
    { userId: req.auth.userId },
    {
      records,
      theme,
      lastClientChangeAt: Math.max(serverLastChangeAt, safeClientChangeAt),
    },
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
  const sanitizedTask = sanitizeTask(req.body?.task, { strictName: true })
  if (!sanitizedTask) {
    return res.status(400).json({ error: 'Task name is invalid or corrupted. Use UTF-8 text and retry.' })
  }

  const submittedChangeAt = Number(req.body?.clientLastChangeAt)
  const safeClientChangeAt =
    Number.isFinite(submittedChangeAt) && submittedChangeAt > 0 ? submittedChangeAt : Date.now()
  const data = await getOrCreateData(req.auth.userId)
  const serverLastChangeAt = Number(data.lastClientChangeAt || 0)

  if (safeClientChangeAt < serverLastChangeAt) {
    const tasks = await getTasksForUser(req.auth.userId, data.tasks)
    const stats = calculateAccountStats(tasks, data.records || {})
    return res.json({
      ok: true,
      staleIgnored: true,
      tasks,
      stats,
      updatedAt: data.updatedAt ? data.updatedAt.toISOString() : null,
    })
  }

  await Task.findOneAndUpdate(
    { userId: req.auth.userId, id: sanitizedTask.id },
    { userId: req.auth.userId, ...sanitizedTask },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  )

  const updatedData = await UserData.findOneAndUpdate(
    { userId: req.auth.userId },
    { lastClientChangeAt: Math.max(serverLastChangeAt, safeClientChangeAt) },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  )
  const tasks = await getTasksForUser(req.auth.userId)
  const stats = calculateAccountStats(tasks, updatedData.records || {})

  return res.json({
    ok: true,
    task: sanitizedTask,
    stats,
    updatedAt: updatedData.updatedAt ? updatedData.updatedAt.toISOString() : null,
  })
}

app.post('/api/tasks/upsert', requireDbReady, authRequired, upsertTaskHandler)
app.post('/tasks/upsert', requireDbReady, authRequired, upsertTaskHandler)

const replaceTasksHandler = async (req, res) => {
  const incomingTasks = Array.isArray(req.body?.tasks) ? req.body.tasks : []
  const submittedChangeAt = Number(req.body?.clientLastChangeAt)
  const safeClientChangeAt =
    Number.isFinite(submittedChangeAt) && submittedChangeAt > 0 ? submittedChangeAt : Date.now()
  const data = await getOrCreateData(req.auth.userId)
  const serverLastChangeAt = Number(data.lastClientChangeAt || 0)

  if (safeClientChangeAt < serverLastChangeAt) {
    const tasks = await getTasksForUser(req.auth.userId, data.tasks)
    const stats = calculateAccountStats(tasks, data.records || {})
    return res.json({
      ok: true,
      staleIgnored: true,
      tasks,
      stats,
      updatedAt: data.updatedAt ? data.updatedAt.toISOString() : null,
    })
  }

  const normalizedTasks = await replaceTasksForUser(req.auth.userId, incomingTasks)
  const validTaskIds = normalizedTasks.map((task) => task.id)
  const records = pruneRecordTaskRefs(data.records || {}, validTaskIds)
  const updatedData = await UserData.findOneAndUpdate(
    { userId: req.auth.userId },
    {
      records,
      lastClientChangeAt: Math.max(serverLastChangeAt, safeClientChangeAt),
    },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  )
  const stats = calculateAccountStats(normalizedTasks, updatedData.records || {})

  return res.json({ ok: true, tasks: normalizedTasks, stats })
}

app.post('/api/tasks/replace', requireDbReady, authRequired, replaceTasksHandler)
app.post('/tasks/replace', requireDbReady, authRequired, replaceTasksHandler)

const upsertRecordHandler = async (req, res) => {
  const date = String(req.body?.date || '').trim()
  if (!isIsoDate(date)) {
    return res.status(400).json({ error: 'Valid date (YYYY-MM-DD) is required' })
  }

  const incomingIds = normalizeCompletedTaskIds(req.body?.completedTaskIds)
  const tasks = await getTasksForUser(req.auth.userId)
  const validTaskIds = new Set(tasks.map((task) => task.id))
  const completedTaskIds = incomingIds.filter((id) => validTaskIds.has(id))
  const submittedChangeAt = Number(req.body?.clientLastChangeAt)
  const safeClientChangeAt =
    Number.isFinite(submittedChangeAt) && submittedChangeAt > 0 ? submittedChangeAt : Date.now()

  const data = await getOrCreateData(req.auth.userId)
  const records = typeof data.records === 'object' && data.records ? { ...data.records } : {}
  records[date] = {
    date,
    completedTaskIds,
  }

  const updatedData = await UserData.findOneAndUpdate(
    { userId: req.auth.userId },
    {
      records,
      lastClientChangeAt: Math.max(Number(data.lastClientChangeAt || 0), safeClientChangeAt),
    },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  )
  const stats = calculateAccountStats(tasks, updatedData.records || {})

  return res.json({ ok: true, date, completedTaskIds, stats, updatedAt: updatedData.updatedAt?.toISOString() || null })
}

app.post('/api/records/upsert', requireDbReady, authRequired, upsertRecordHandler)
app.post('/records/upsert', requireDbReady, authRequired, upsertRecordHandler)

const setThemeHandler = async (req, res) => {
  const theme = req.body?.theme === 'light' ? 'light' : 'dark'
  const submittedChangeAt = Number(req.body?.clientLastChangeAt)
  const safeClientChangeAt =
    Number.isFinite(submittedChangeAt) && submittedChangeAt > 0 ? submittedChangeAt : Date.now()

  const data = await getOrCreateData(req.auth.userId)
  const tasks = await getTasksForUser(req.auth.userId)
  const updatedData = await UserData.findOneAndUpdate(
    { userId: req.auth.userId },
    {
      theme,
      lastClientChangeAt: Math.max(Number(data.lastClientChangeAt || 0), safeClientChangeAt),
    },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  )
  const stats = calculateAccountStats(tasks, updatedData.records || {})

  return res.json({ ok: true, theme, stats, updatedAt: updatedData.updatedAt?.toISOString() || null })
}

app.post('/api/theme', requireDbReady, authRequired, setThemeHandler)
app.post('/theme', requireDbReady, authRequired, setThemeHandler)

const deleteTaskHandler = async (req, res) => {
  const taskId = String(req.params.taskId || '').trim()
  if (!taskId) {
    return res.status(400).json({ error: 'taskId is required' })
  }

  const data = await getOrCreateData(req.auth.userId)
  const submittedChangeAt = Number(req.body?.clientLastChangeAt)
  const safeClientChangeAt =
    Number.isFinite(submittedChangeAt) && submittedChangeAt > 0 ? submittedChangeAt : Date.now()
  const serverLastChangeAt = Number(data.lastClientChangeAt || 0)

  if (safeClientChangeAt < serverLastChangeAt) {
    const tasks = await getTasksForUser(req.auth.userId, data.tasks)
    const stats = calculateAccountStats(tasks, data.records || {})
    return res.json({
      ok: true,
      staleIgnored: true,
      tasks,
      stats,
      updatedAt: data.updatedAt ? data.updatedAt.toISOString() : null,
    })
  }

  await Task.deleteOne({ userId: req.auth.userId, id: taskId })
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
    {
      records,
      lastClientChangeAt: Math.max(serverLastChangeAt, safeClientChangeAt),
    },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  )

  const stats = calculateAccountStats(tasks, updatedData.records || {})
  return res.json({ ok: true, stats })
}

app.delete('/api/tasks/:taskId', requireDbReady, authRequired, deleteTaskHandler)
app.delete('/tasks/:taskId', requireDbReady, authRequired, deleteTaskHandler)

const syncSnapshotHandler = async (req, res) => {
  const payload = req.body ?? {}
  const submittedChangeAt = Number(payload.clientLastChangeAt)
  const safeClientChangeAt =
    Number.isFinite(submittedChangeAt) && submittedChangeAt > 0 ? submittedChangeAt : Date.now()

  const data = await getOrCreateData(req.auth.userId)
  const serverLastChangeAt = Number(data.lastClientChangeAt || 0)

  if (safeClientChangeAt < serverLastChangeAt) {
    const tasks = await getTasksForUser(req.auth.userId, data.tasks)
    const stats = calculateAccountStats(tasks, data.records || {})
    return res.json(toCloudResponse({ tasks, data, stats, staleIgnored: true }))
  }

  const incomingTasks = Array.isArray(payload.tasks) ? payload.tasks : []
  const normalizedTasks = await replaceTasksForUser(req.auth.userId, incomingTasks)
  const validTaskIds = normalizedTasks.map((task) => task.id)
  const normalizedRecords = normalizeRecords(payload.records, validTaskIds)
  const theme = payload.theme === 'light' ? 'light' : 'dark'

  const updatedData = await UserData.findOneAndUpdate(
    { userId: req.auth.userId },
    {
      records: normalizedRecords,
      theme,
      lastClientChangeAt: Math.max(serverLastChangeAt, safeClientChangeAt),
      tasks: [],
    },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  )

  const stats = calculateAccountStats(normalizedTasks, updatedData.records || {})
  return res.json(toCloudResponse({ tasks: normalizedTasks, data: updatedData, stats }))
}

app.post('/api/sync', requireDbReady, authRequired, syncSnapshotHandler)
app.post('/sync', requireDbReady, authRequired, syncSnapshotHandler)

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
