import 'dotenv/config'
import { z } from 'zod'

const schema = z.object({
  PORT: z.coerce.number().default(3001),
  CLIENT_ORIGIN: z.string().default('*'),
  DATABASE_DRIVER: z.enum(['memory', 'mysql']).default('memory'),
  JWT_SECRET: z.string().min(16).default('development-secret-change-me'),
  DB_HOST: z.string().default('127.0.0.1'),
  DB_PORT: z.coerce.number().default(3306),
  DB_USER: z.string().default('blog_user'),
  DB_PASSWORD: z.string().default('blog_password'),
  DB_NAME: z.string().default('personal_blog'),
})

export const env = schema.parse(process.env)

