import { Router } from 'express'
import multer from 'multer'
import path from 'node:path'
import crypto from 'node:crypto'
import { requireAuth } from '../middleware/auth.js'

const root = path.resolve(process.cwd(), 'uploads')
const storage = multer.diskStorage({
  destination: root,
  filename: (_req, file, callback) => callback(null, `${Date.now()}-${crypto.randomUUID()}${path.extname(file.originalname).toLowerCase()}`),
})
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => callback(null, ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.mimetype)),
})

const router = Router()
router.post('/cover', requireAuth, upload.single('cover'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: '请选择 JPG、PNG、WebP 或 GIF 图片。' })
  return res.status(201).json({ url: `/uploads/${req.file.filename}` })
})

export default router

