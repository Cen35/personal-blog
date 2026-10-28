import { FileText, Settings } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/auth'
import { api, errorMessage } from '../lib/api'
import type { PostList, User } from '../types'
import { EmptyState, PageLoader } from '../components/Status'

export function ProfilePage() {
  const { user, refresh } = useAuth()
  const [form, setForm] = useState({ username: user?.username ?? '', email: user?.email ?? '', avatar: user?.avatar ?? '', bio: user?.bio ?? '' })
  const [posts, setPosts] = useState<PostList | null>(null)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const set = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }))

  useEffect(() => { api.get<PostList>('/posts', { params: { mine: true, pageSize: 50 } }).then(({ data }) => setPosts(data)).catch((reason) => setMessage(errorMessage(reason))) }, [])

  const submit = async (event: FormEvent) => {
    event.preventDefault(); setBusy(true); setMessage('')
    try {
      await api.put<User>('/users/me', form); await refresh(); setMessage('个人资料已经保存。')
    } catch (reason) { setMessage(errorMessage(reason)) }
    finally { setBusy(false) }
  }

  if (!user) return <PageLoader />

  return (
    <section className="profile-page">
      <header><h1>个人中心</h1><p>管理个人资料与已经发布的文章。</p></header>
      <div className="profile-grid">
        <form className="paper-form profile-form" onSubmit={submit}>
          <h2><Settings aria-hidden="true" />个人资料</h2>
          <label>用户名<input value={form.username} minLength={3} maxLength={20} onChange={(event) => set('username', event.target.value)} required /></label>
          <label>邮箱<input type="email" value={form.email} onChange={(event) => set('email', event.target.value)} required /></label>
          <label>头像地址<input value={form.avatar} onChange={(event) => set('avatar', event.target.value)} placeholder="https://…" /></label>
          <label>个人简介<textarea rows={4} maxLength={500} value={form.bio} onChange={(event) => set('bio', event.target.value)} /></label>
          {message && <p className="form-message" role="status">{message}</p>}
          <button className="primary-button" type="submit" disabled={busy}>{busy ? '正在保存…' : '保存资料'}</button>
        </form>
        <section className="my-posts" aria-labelledby="my-posts-title">
          <div className="section-heading"><h2 id="my-posts-title"><FileText aria-hidden="true" />我的文章</h2><Link to="/write">写新文章</Link></div>
          {!posts ? <PageLoader /> : posts.items.length === 0 ? <EmptyState title="还没有文章" body="写下第一篇文章后，它会出现在这里。" /> : (
            <ul>{posts.items.map((post) => <li key={post.id}><div><time>{new Date(post.createdAt).toLocaleDateString('zh-CN')}</time><Link to={`/post/${post.id}`}>{post.title}</Link></div><Link to={`/edit/${post.id}`}>编辑</Link></li>)}</ul>
          )}
        </section>
      </div>
    </section>
  )
}

