import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { env } from '../config/env.js'
import { createUser, findUserByLogin } from '../services/store.js'

const router = Router()

const registerSchema = z.object({
  username: z.string().trim().min(3, '用户名至少 3 个字符').max(20, '用户名最多 20 个字符'),
  email: z.email('请输入正确的邮箱地址'),
  password: z.string().min(6, '密码至少 6 位').max(72),
})

router.post('/register', async (req, res) => {
  const input = registerSchema.parse(req.body)
  if (await findUserByLogin(input.username) || await findUserByLogin(input.email)) {
    return res.status(409).json({ message: '用户名或邮箱已经被使用。' })
  }
  const password = await bcrypt.hash(input.password, 10)
  const user = await createUser(input.username, input.email, password)
  return res.status(201).json({ message: '注册成功，请登录。', user })
})

const loginSchema = z.object({ login: z.string().trim().min(1), password: z.string().min(1) })

router.post('/login', async (req, res) => {
  const input = loginSchema.parse(req.body)
  const user = await findUserByLogin(input.login)
  if (!user || !await bcrypt.compare(input.password, user.password)) {
    return res.status(401).json({ message: '用户名或密码不正确。' })
  }
  const token = jwt.sign({ id: user.id, username: user.username }, env.JWT_SECRET, { expiresIn: '7d' })
  const { password: _password, ...safeUser } = user
  return res.json({ token, user: safeUser })
})

export default router

