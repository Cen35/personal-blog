export type User = {
  id: number
  username: string
  email: string
  avatar: string
  bio: string
  createdAt: string
}

export type Post = {
  id: number
  title: string
  content: string
  excerpt: string
  cover: string
  category: string
  tags: string[]
  authorId: number
  author: Pick<User, 'id' | 'username' | 'avatar'>
  views: number
  createdAt: string
  updatedAt: string
}

export type PostList = { items: Post[]; total: number; page: number; pageSize: number }
export type Category = { id: number; name: string; description: string }

