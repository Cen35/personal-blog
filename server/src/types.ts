export type PublicUser = {
  id: number
  username: string
  email: string
  avatar: string
  bio: string
  createdAt: string
}

export type StoredUser = PublicUser & { password: string }

export type Post = {
  id: number
  title: string
  content: string
  excerpt: string
  cover: string
  category: string
  tags: string[]
  authorId: number
  author: Pick<PublicUser, 'id' | 'username' | 'avatar'>
  views: number
  createdAt: string
  updatedAt: string
}

export type PostInput = Pick<Post, 'title' | 'content' | 'excerpt' | 'cover' | 'category' | 'tags'>

export type PostQuery = {
  page: number
  pageSize: number
  category?: string
  keyword?: string
  authorId?: number
}

