import { Router } from 'express'
import { listCategories } from '../services/store.js'

const router = Router()
router.get('/', async (_req, res) => res.json(await listCategories()))
export default router

