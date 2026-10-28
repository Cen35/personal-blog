import { Router } from 'express'
import { z } from 'zod'
import { optionalAuth, requireAuth, type AuthRequest } from '../middleware/auth.js'
import { createPost, deletePost, getPost, listPosts, updatePost } from '../services/store.js'

const router = Router()
router.use(optionalAuth)

const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(10),
  category: z.string().trim().optional(),
  keyword: z.string().trim().optional(),
  mine: z.enum(['true', 'false']).optional(),
})

router.get('/', async (req: AuthRequest, res) => {
  const query = querySchema.parse(req.query)
  const result = await listPosts({
    page: query.page,
    pageSize: query.pageSize,
    category: query.category || undefined,
    keyword: query.keyword || undefined,
    authorId: query.mine === 'true' ? req.user?.id : undefined,
  })
  return res.json(result)
})

router.get('/:id', async (req, res) => {
  const id = z.coerce.number().int().positive().parse(req.params.id)
  const post = await getPost(id, true)
  if (!post) return res.status(404).json({ message: '这篇文章不存在或已被删除。' })
  return res.json(post)
})

const postSchema = z.object({
  title: z.string().trim().min(2).max(160),
  content: z.string().trim().min(10),
  excerpt: z.string().trim().max(300).default(''),
  cover: z.string().trim().max(500).default(''),
  category: z.string().trim().min(1).max(60),
  tags: z.array(z.string().trim().min(1).max(30)).max(8).default([]),
})

router.post('/', requireAuth, async (req: AuthRequest, res) => {
  const input = postSchema.parse(req.body)
  const post = await createPost(req.user!.id, input)
  return res.status(201).json(post)
})

router.put('/:id', requireAuth, async (req: AuthRequest, res) => {
  const id = z.coerce.number().int().positive().parse(req.params.id)
  const input = postSchema.partial().parse(req.body)
  const post = await updatePost(id, req.user!.id, input)
  if (post === 'forbidden') return res.status(403).json({ message: '你只能修改自己的文章。' })
  if (!post) return res.status(404).json({ message: '这篇文章不存在。' })
  return res.json(post)
})

router.delete('/:id', requireAuth, async (req: AuthRequest, res) => {
  const id = z.coerce.number().int().positive().parse(req.params.id)
  const result = await deletePost(id, req.user!.id)
  if (result === 'forbidden') return res.status(403).json({ message: '你只能删除自己的文章。' })
  if (result === 'missing') return res.status(404).json({ message: '这篇文章不存在。' })
  return res.status(204).send()
})

export default router

