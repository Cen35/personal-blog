import request from 'supertest'
import { beforeAll, describe, expect, it } from 'vitest'
import { app } from './app.js'
import { initializeStore } from './services/store.js'

beforeAll(async () => initializeStore())

describe('PERSONAL BLOG API', () => {
  it('returns paginated posts and supports search', async () => {
    const response = await request(app).get('/api/posts?page=1&pageSize=2&keyword=春天')
    expect(response.status).toBe(200)
    expect(response.body.pageSize).toBe(2)
    expect(response.body.items.length).toBeGreaterThan(0)
  })

  it('logs in and protects article creation', async () => {
    const anonymous = await request(app).post('/api/posts').send({})
    expect(anonymous.status).toBe(401)

    const login = await request(app).post('/api/auth/login').send({ login: 'paperwriter', password: 'demo123' })
    expect(login.status).toBe(200)
    expect(login.body.token).toBeTruthy()

    const created = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${login.body.token}`)
      .send({
        title: '测试文章', content: '## 可以工作的 Markdown 内容', excerpt: '自动化测试创建的文章',
        cover: '', category: '创作', tags: ['测试'],
      })
    expect(created.status).toBe(201)
    expect(created.body.author.username).toBe('paperwriter')
  })
})

