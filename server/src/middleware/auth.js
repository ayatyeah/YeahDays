import jwt from 'jsonwebtoken'

export function authRequired(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing authorization token' })
  }

  const token = authHeader.slice(7)

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.auth = { userId: decoded.sub }
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}
