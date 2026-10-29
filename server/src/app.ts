import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import path from 'node:path'
import fs from 'node:fs'
import { env } from './config/env.js'
import { errorHandler } from './middleware/error.js'
import authRoutes from './routes/auth.js'
import categoryRoutes from './routes/categories.js'
import postRoutes from './routes/posts.js'
import uploadRoutes from './routes/uploads.js'
import userRoutes from './routes/users.js'

export const app = express()
const root = process.env.LAMBDA_TASK_ROOT ? '/tmp/personal-blog-uploads' : path.resolve(process.cwd(), 'uploads')
fs.mkdirSync(root, { recursive: true })

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
const allowedOrigins = env.CLIENT_ORIGIN.split(',').map((origin) => origin.trim())
app.use(cors({ origin(origin, callback) {
  if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) return callback(null, true)
  return callback(new Error('CORS origin is not allowed'))
} }))
app.use(express.json({ limit: '1mb' }))
app.use(morgan('dev'))
app.use('/uploads', express.static(root))

app.get('/api/health', (_req, res) => res.json({ ok: true }))
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/uploads', uploadRoutes)

app.use((_req, res) => res.status(404).json({ message: '没有找到这个接口。' }))
app.use(errorHandler)

