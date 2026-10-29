import { Router } from 'express'
import { z } from 'zod'
import { requireAuth, type AuthRequest } from '../middleware/auth.js'
import { findUserById, updateUser } from '../services/store.js'

const router = Router()
router.use(requireAuth)

router.get('/me', async (req: AuthRequest, res) => {
  const user = await findUserById(req.user!.id)
  if (!user) return res.status(404).json({ message: '没有找到这个用户。' })
  return res.json(user)
})

const profileSchema = z.object({
  username: z.string().trim().min(3).max(20),
  email: z.email(),
  avatar: z.string().trim().max(500).default(''),
  bio: z.string().trim().max(500).default(''),
})

router.put('/me', async (req: AuthRequest, res) => {
  const input = profileSchema.parse(req.body)
  const user = await updateUser(req.user!.id, input)
  if (!user) return res.status(404).json({ message: '没有找到这个用户。' })
  return res.json(user)
})

export default router

