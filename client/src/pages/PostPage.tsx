import { Eye, Pencil, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/auth'
import { api, coverUrl, errorMessage } from '../lib/api'
import type { Post } from '../types'
import { EmptyState, PageLoader } from '../components/Status'

export function PostPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get<Post>(`/posts/${id}`).then(({ data }) => setPost(data)).catch((reason) => setError(errorMessage(reason))).finally(() => setLoading(false))
  }, [id])

  const remove = async () => {
    if (!post || !window.confirm(`确定删除《${post.title}》吗？这个操作无法撤销。`)) return
    try { await api.delete(`/posts/${post.id}`); navigate('/') }
    catch (reason) { setError(errorMessage(reason)) }
  }

  if (loading) return <PageLoader />
  if (!post) return <EmptyState title="文章没有找到" body={error || '它可能已经被删除。'} />
  const date = new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(post.createdAt))

  return (
    <article className="article-page">
      <header className="article-header">
        <p>{post.category} · {date}</p>
        <h1>{post.title}</h1>
        <div className="article-meta"><span>作者 {post.author.username}</span><span><Eye aria-hidden="true" /> {post.views} 次阅读</span></div>
        {post.tags.length > 0 && <div className="tag-row" aria-label="文章标签">{post.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>}
      </header>
      {post.cover && <figure className="article-cover"><img src={coverUrl(post.cover)} alt="" /></figure>}
      <div className="markdown-body"><ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown></div>
      {user?.id === post.authorId && (
        <div className="owner-actions">
          <Link className="primary-button" to={`/edit/${post.id}`}><Pencil aria-hidden="true" />编辑文章</Link>
          <button className="danger-button" type="button" onClick={remove}><Trash2 aria-hidden="true" />删除文章</button>
        </div>
      )}
      {error && <p className="form-message is-error" role="alert">{error}</p>}
      <footer className="article-end"><p>这一页写完了。</p><Link to="/">回到文章列表</Link></footer>
    </article>
  )
}

