import bcrypt from 'bcryptjs'
import { env } from '../config/env.js'
import { pool } from '../db/mysql.js'
import { categories as categorySeed, schemaStatements } from '../db/schema.js'
import type { Post, PostInput, PostQuery, PublicUser, StoredUser } from '../types.js'

const now = () => new Date().toISOString()
let users: StoredUser[] = []
let posts: Post[] = []
let ready = false

const publicUser = (user: StoredUser): PublicUser => ({
  id: user.id,
  username: user.username,
  email: user.email,
  avatar: user.avatar,
  bio: user.bio,
  createdAt: user.createdAt,
})

const normalizePost = (row: Record<string, unknown>): Post => ({
  id: Number(row.id),
  title: String(row.title),
  content: String(row.content),
  excerpt: String(row.excerpt ?? ''),
  cover: String(row.cover ?? ''),
  category: String(row.category),
  tags: Array.isArray(row.tags) ? row.tags.map(String) : JSON.parse(String(row.tags ?? '[]')),
  authorId: Number(row.author_id ?? row.authorId),
  author: {
    id: Number(row.author_id ?? row.authorId),
    username: String(row.author_username ?? row.username ?? ''),
    avatar: String(row.author_avatar ?? row.avatar ?? ''),
  },
  views: Number(row.views ?? 0),
  createdAt: new Date(String(row.created_at ?? row.createdAt)).toISOString(),
  updatedAt: new Date(String(row.updated_at ?? row.updatedAt)).toISOString(),
})

export async function initializeStore() {
  if (ready) return
  if (env.DATABASE_DRIVER === 'mysql') {
    for (const statement of schemaStatements) await pool.query(statement)
    for (const [name, description] of categorySeed) {
      await pool.query('INSERT IGNORE INTO categories (name, description) VALUES (?, ?)', [name, description])
    }
  } else {
    const password = await bcrypt.hash('demo123', 10)
    const createdAt = now()
    users = [{
      id: 1,
      username: 'paperwriter',
      email: 'demo@personal.blog',
      password,
      avatar: '',
      bio: '记录日常、阅读与旅途中的细小发现。',
      createdAt,
    }]
    const samples: Array<Omit<Post, 'author'>> = [
      {
        id: 1,
        title: '雾散之后，还是会有光',
        content: '# 雾散之后，还是会有光\n\n清晨的雾把远处的山藏了起来。走过一段路后，我发现光线正在一点点从云后面透出来。\n\n> 有些答案不用急着找到，先把今天好好过完。\n\n这篇文章记录一次安静的散步，也记录重新整理心情的过程。',
        excerpt: '有些情绪像山里的雾，来得快也会散。走过一段低潮后，我开始学着把日子过回简单的形状。',
        cover: '/images/cover-mist.jpg',
        category: '日常',
        tags: ['散步', '随笔'],
        authorId: 1,
        views: 128,
        createdAt: '2026-04-17T08:30:00.000Z',
        updatedAt: '2026-04-17T08:30:00.000Z',
      },
      {
        id: 2,
        title: '一间安静的房间',
        content: '# 一间安静的房间\n\n整理桌面，泡一杯热茶，让阳光落在纸上。\n\n安静不是没有声音，而是终于能听见自己。',
        excerpt: '整理桌面，泡一杯热茶，让阳光落在纸上。原来幸福不在很远的地方。',
        cover: '/images/cover-room.jpg',
        category: '日常',
        tags: ['房间', '生活'],
        authorId: 1,
        views: 96,
        createdAt: '2026-04-05T09:10:00.000Z',
        updatedAt: '2026-04-05T09:10:00.000Z',
      },
      {
        id: 3,
        title: '春天来之前',
        content: '# 春天来之前\n\n在还很冷的日子里，已经能闻到一些变化。树枝变软了，风也不那么刺骨。',
        excerpt: '在还很冷的日子里，已经能闻到一些变化。树枝变软了，风也不那么刺骨。',
        cover: '/images/cover-spring.jpg',
        category: '旅行',
        tags: ['春天', '风景'],
        authorId: 1,
        views: 74,
        createdAt: '2026-03-28T11:00:00.000Z',
        updatedAt: '2026-03-28T11:00:00.000Z',
      },
      {
        id: 4,
        title: '把一本书读慢一点',
        content: '# 把一本书读慢一点\n\n这次不追着页数走，只记下真正留下来的句子。\n\n- 一段关于时间的描述\n- 一个想要再次拜访的地方\n- 一种更轻盈的生活方式',
        excerpt: '不追着页数走，只记下真正留下来的句子，让阅读重新成为一件慢慢发生的事。',
        cover: '/images/cover-books.jpg',
        category: '阅读',
        tags: ['阅读', '笔记'],
        authorId: 1,
        views: 51,
        createdAt: '2026-03-18T15:20:00.000Z',
        updatedAt: '2026-03-18T15:20:00.000Z',
      },
    ]
    posts = samples.map((post) => ({ ...post, author: { id: 1, username: 'paperwriter', avatar: '' } }))
  }
  ready = true
}

export async function findUserByLogin(login: string): Promise<StoredUser | null> {
  if (env.DATABASE_DRIVER === 'memory') {
    return users.find((user) => user.username === login || user.email === login) ?? null
  }
  const [rows] = await pool.query('SELECT * FROM users WHERE username = ? OR email = ? LIMIT 1', [login, login])
  const user = (rows as Array<Record<string, unknown>>)[0]
  if (!user) return null
  return {
    id: Number(user.id), username: String(user.username), email: String(user.email),
    password: String(user.password), avatar: String(user.avatar ?? ''), bio: String(user.bio ?? ''),
    createdAt: new Date(String(user.created_at)).toISOString(),
  }
}

export async function findUserById(id: number): Promise<PublicUser | null> {
  if (env.DATABASE_DRIVER === 'memory') {
    const user = users.find((item) => item.id === id)
    return user ? publicUser(user) : null
  }
  const [rows] = await pool.query('SELECT id, username, email, avatar, bio, created_at FROM users WHERE id = ?', [id])
  const user = (rows as Array<Record<string, unknown>>)[0]
  return user ? {
    id: Number(user.id), username: String(user.username), email: String(user.email),
    avatar: String(user.avatar ?? ''), bio: String(user.bio ?? ''),
    createdAt: new Date(String(user.created_at)).toISOString(),
  } : null
}

export async function createUser(username: string, email: string, password: string): Promise<PublicUser> {
  if (env.DATABASE_DRIVER === 'memory') {
    const user: StoredUser = { id: users.length + 1, username, email, password, avatar: '', bio: '', createdAt: now() }
    users.push(user)
    return publicUser(user)
  }
  const [result] = await pool.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, password])
  return (await findUserById(Number((result as { insertId: number }).insertId)))!
}

export async function updateUser(id: number, input: { username: string; email: string; avatar: string; bio: string }): Promise<PublicUser | null> {
  if (env.DATABASE_DRIVER === 'memory') {
    const user = users.find((item) => item.id === id)
    if (!user) return null
    Object.assign(user, input)
    return publicUser(user)
  }
  await pool.query('UPDATE users SET username = ?, email = ?, avatar = ?, bio = ? WHERE id = ?', [input.username, input.email, input.avatar, input.bio, id])
  return findUserById(id)
}

export async function listCategories() {
  if (env.DATABASE_DRIVER === 'memory') return categorySeed.map(([name, description], index) => ({ id: index + 1, name, description }))
  const [rows] = await pool.query('SELECT id, name, description FROM categories ORDER BY id')
  return rows
}

export async function listPosts(query: PostQuery) {
  if (env.DATABASE_DRIVER === 'memory') {
    let filtered = [...posts]
    if (query.category) filtered = filtered.filter((post) => post.category === query.category)
    if (query.keyword) {
      const keyword = query.keyword.toLowerCase()
      filtered = filtered.filter((post) => `${post.title} ${post.content}`.toLowerCase().includes(keyword))
    }
    if (query.authorId) filtered = filtered.filter((post) => post.authorId === query.authorId)
    filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    const start = (query.page - 1) * query.pageSize
    return { items: filtered.slice(start, start + query.pageSize), total: filtered.length, page: query.page, pageSize: query.pageSize }
  }
  const where: string[] = []
  const values: unknown[] = []
  if (query.category) { where.push('p.category = ?'); values.push(query.category) }
  if (query.keyword) { where.push('(p.title LIKE ? OR p.content LIKE ?)'); values.push(`%${query.keyword}%`, `%${query.keyword}%`) }
  if (query.authorId) { where.push('p.author_id = ?'); values.push(query.authorId) }
  const clause = where.length ? `WHERE ${where.join(' AND ')}` : ''
  const [countRows] = await pool.query(`SELECT COUNT(*) total FROM posts p ${clause}`, values)
  const offset = (query.page - 1) * query.pageSize
  const [rows] = await pool.query(
    `SELECT p.*, u.username author_username, u.avatar author_avatar FROM posts p JOIN users u ON u.id = p.author_id ${clause} ORDER BY p.created_at DESC LIMIT ? OFFSET ?`,
    [...values, query.pageSize, offset],
  )
  return {
    items: (rows as Array<Record<string, unknown>>).map(normalizePost),
    total: Number((countRows as Array<{ total: number }>)[0].total),
    page: query.page,
    pageSize: query.pageSize,
  }
}

export async function getPost(id: number, increment = false): Promise<Post | null> {
  if (env.DATABASE_DRIVER === 'memory') {
    const post = posts.find((item) => item.id === id)
    if (!post) return null
    if (increment) post.views += 1
    return { ...post }
  }
  if (increment) await pool.query('UPDATE posts SET views = views + 1 WHERE id = ?', [id])
  const [rows] = await pool.query('SELECT p.*, u.username author_username, u.avatar author_avatar FROM posts p JOIN users u ON u.id = p.author_id WHERE p.id = ?', [id])
  const row = (rows as Array<Record<string, unknown>>)[0]
  return row ? normalizePost(row) : null
}

export async function createPost(authorId: number, input: PostInput): Promise<Post> {
  if (env.DATABASE_DRIVER === 'memory') {
    const user = users.find((item) => item.id === authorId)!
    const post: Post = {
      ...input, id: Math.max(0, ...posts.map((item) => item.id)) + 1, authorId,
      author: { id: user.id, username: user.username, avatar: user.avatar }, views: 0, createdAt: now(), updatedAt: now(),
    }
    posts.unshift(post)
    return post
  }
  const [result] = await pool.query(
    'INSERT INTO posts (title, content, excerpt, cover, category, tags, author_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [input.title, input.content, input.excerpt, input.cover, input.category, JSON.stringify(input.tags), authorId],
  )
  return (await getPost(Number((result as { insertId: number }).insertId)))!
}

export async function updatePost(id: number, authorId: number, input: Partial<PostInput>): Promise<Post | 'forbidden' | null> {
  const existing = await getPost(id)
  if (!existing) return null
  if (existing.authorId !== authorId) return 'forbidden'
  const next = { ...existing, ...input, tags: input.tags ?? existing.tags, updatedAt: now() }
  if (env.DATABASE_DRIVER === 'memory') {
    posts = posts.map((post) => post.id === id ? next : post)
    return next
  }
  await pool.query(
    'UPDATE posts SET title = ?, content = ?, excerpt = ?, cover = ?, category = ?, tags = ? WHERE id = ?',
    [next.title, next.content, next.excerpt, next.cover, next.category, JSON.stringify(next.tags), id],
  )
  return getPost(id)
}

export async function deletePost(id: number, authorId: number): Promise<'deleted' | 'forbidden' | 'missing'> {
  const existing = await getPost(id)
  if (!existing) return 'missing'
  if (existing.authorId !== authorId) return 'forbidden'
  if (env.DATABASE_DRIVER === 'memory') posts = posts.filter((post) => post.id !== id)
  else await pool.query('DELETE FROM posts WHERE id = ?', [id])
  return 'deleted'
}

