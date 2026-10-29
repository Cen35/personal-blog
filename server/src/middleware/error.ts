import type { ErrorRequestHandler } from 'express'
import { ZodError } from 'zod'

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    return res.status(400).json({ message: '提交的信息不完整。', issues: error.issues })
  }
  if ((error as { code?: string }).code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ message: '用户名或邮箱已经被使用。' })
  }
  console.error(error)
  return res.status(500).json({ message: '服务器暂时无法完成请求，请稍后再试。' })
}

