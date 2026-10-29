import { ChevronRight, Search, Sparkles } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api, coverUrl } from '../lib/api'
import type { Post, PostList } from '../types'

const fallbackPosts: Post[] = [
  { id: 1, title: '雾散之后，还是会有光', content: '', excerpt: '有些情绪像山里的雾，来得快也会散。走过一段低潮后，我开始学着把日子过回简单的形状。', cover: '/images/cover-mist.jpg', category: '日常', tags: [], authorId: 1, author: { id: 1, username: 'paperwriter', avatar: '' }, views: 128, createdAt: '2026-04-17T08:30:00.000Z', updatedAt: '2026-04-17T08:30:00.000Z' },
  { id: 2, title: '一间安静的房间', content: '', excerpt: '整理桌面，泡一杯热茶，让阳光落在纸上。原来幸福不在很远的地方。', cover: '/images/cover-room.jpg', category: '生活', tags: [], authorId: 1, author: { id: 1, username: 'paperwriter', avatar: '' }, views: 96, createdAt: '2026-04-05T09:10:00.000Z', updatedAt: '2026-04-05T09:10:00.000Z' },
  { id: 3, title: '春天来之前', content: '', excerpt: '在还很冷的日子里，已经能闻到一些变化。树枝变软了，风也不那么刺骨。', cover: '/images/cover-spring.jpg', category: '随笔', tags: [], authorId: 1, author: { id: 1, username: 'paperwriter', avatar: '' }, views: 74, createdAt: '2026-03-28T11:00:00.000Z', updatedAt: '2026-03-28T11:00:00.000Z' },
  { id: 4, title: '和一位老朋友重逢', content: '', excerpt: '在很久没去的那片森林里，我又遇见了它。像是许久不见的老朋友，没有言语，只是静静地并肩站着。', cover: '/images/cover-books.jpg', category: '随笔', tags: [], authorId: 1, author: { id: 1, username: 'paperwriter', avatar: '' }, views: 51, createdAt: '2026-02-28T15:20:00.000Z', updatedAt: '2026-02-28T15:20:00.000Z' },
]

const dateText = (value: string) => new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(value)).replaceAll('/', '.')

export function HomePage() {
  const [params, setParams] = useSearchParams()
  const [posts, setPosts] = useState<Post[]>(fallbackPosts)
  const [draftKeyword, setDraftKeyword] = useState(params.get('keyword') ?? '')
  const keyword = params.get('keyword') ?? ''

  useEffect(() => {
    api.get<PostList>('/posts', { params: { page: 1, pageSize: 4, keyword: keyword || undefined } })
      .then(({ data }) => { if (data.items.length) setPosts(data.items) })
      .catch(() => undefined)
  }, [keyword])

  const submitSearch = (event: FormEvent) => {
    event.preventDefault()
    const next = draftKeyword.trim()
    setParams(next ? { keyword: next } : {})
  }

  const recent = posts.slice(0, 3)
  const featured = posts[3] ?? posts[0] ?? fallbackPosts[3]

  return (
    <section className="paper-home" aria-labelledby="home-title">
      <div className="paper-main">
        <header className="paper-intro">
          <h1 id="home-title">PERSONAL BLOG <Sparkles aria-hidden="true" /></h1>
          <p>写给日常，也写给未来的自己</p>
          <form className="paper-search" role="search" onSubmit={submitSearch}>
            <Search aria-hidden="true" />
            <label className="sr-only" htmlFor="article-search">搜索文章</label>
            <input id="article-search" value={draftKeyword} onChange={(event) => setDraftKeyword(event.target.value)} placeholder="搜索文章" />
          </form>
        </header>
        <section className="paper-recent" aria-labelledby="recent-title">
          <h2 id="recent-title">最近写下的</h2>
          <div className="paper-rows">
            {recent.map((post) => (
              <article className="paper-row" key={post.id}>
                <Link to={`/post/${post.id}`} className="paper-thumb" aria-label={`阅读《${post.title}》`}><img src={coverUrl(post.cover)} alt="" /></Link>
                <div><time dateTime={post.createdAt}>{dateText(post.createdAt)}</time><h3><Link to={`/post/${post.id}`}>{post.title}</Link></h3><p>{post.excerpt}</p></div>
                <span>{post.category}</span><Link to={`/post/${post.id}`} className="paper-arrow" aria-label={`阅读《${post.title}》`}><ChevronRight aria-hidden="true" /></Link>
              </article>
            ))}
          </div>
        </section>
        <article className="paper-featured">
          <Link to={`/post/${featured.id}`} className="featured-image" aria-label={`阅读《${featured.title}》`}><img src={coverUrl(featured.cover)} alt="" /></Link>
          <div><time dateTime={featured.createdAt}>{dateText(featured.createdAt)}</time><h2>{featured.title}</h2><p>{featured.excerpt}</p><Link to={`/post/${featured.id}`}>阅读全文</Link></div>
        </article>
      </div>
      <aside className="paper-collage" aria-label="手记照片">
        <div className="polaroid"><span className="paper-tape" aria-hidden="true" /><img src="/images/cover-mist.jpg" alt="薄雾中的山与湖" /><p>山雾会散，<br />但我会一直记得<br />此刻的安静。</p></div>
        <span className="pressed-flower" aria-hidden="true">✦</span><p className="side-note">去森林，呼吸<br />把温柔的风，<br />也收进日常里。</p>
      </aside>
      <div className="paper-hills" aria-hidden="true"><span /><span /><span /></div>
    </section>
  )
}
