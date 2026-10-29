import { ImagePlus, Save } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useNavigate, useParams } from 'react-router-dom'
import { api, errorMessage } from '../lib/api'
import type { Category, Post } from '../types'
import { PageLoader } from '../components/Status'

const initial = { title: '', content: '# 开始写作\n\n在这里写下正文。', excerpt: '', cover: '', category: '日常', tags: '' }

export function WritePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(initial)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(Boolean(id))
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const set = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }))

  useEffect(() => {
    const load = async () => {
      try {
        const categoriesResponse = await api.get<Category[]>('/categories')
        setCategories(categoriesResponse.data)
        if (id) {
          const { data } = await api.get<Post>(`/posts/${id}`)
          setForm({ title: data.title, content: data.content, excerpt: data.excerpt, cover: data.cover, category: data.category, tags: data.tags.join(', ') })
        }
      } catch (reason) { setError(errorMessage(reason)) }
      finally { setLoading(false) }
    }
    void load()
  }, [id])

  const upload = async (file?: File) => {
    if (!file) return
    const body = new FormData(); body.append('cover', file)
    try {
      const { data } = await api.post<{ url: string }>('/uploads/cover', body, { headers: { 'Content-Type': 'multipart/form-data' } })
      set('cover', data.url)
    } catch (reason) { setError(errorMessage(reason)) }
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault(); setBusy(true); setError('')
    const payload = {
      ...form,
      excerpt: form.excerpt || form.content.replace(/[#>*_`[\]-]/g, '').slice(0, 120),
      tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
    }
    try {
      const { data } = id ? await api.put<Post>(`/posts/${id}`, payload) : await api.post<Post>('/posts', payload)
      navigate(`/post/${data.id}`)
    } catch (reason) { setError(errorMessage(reason)) }
    finally { setBusy(false) }
  }

  if (loading) return <PageLoader label="正在展开旧稿" />

  return (
    <section className="editor-page">
      <header><h1>{id ? '编辑文章' : '写一篇新文章'}</h1><p>左边写 Markdown，右边会实时预览。</p></header>
      <form onSubmit={submit}>
        <div className="editor-details">
          <label>标题<input value={form.title} onChange={(event) => set('title', event.target.value)} minLength={2} maxLength={160} required /></label>
          <label>分类<select value={form.category} onChange={(event) => set('category', event.target.value)}>{categories.map((category) => <option key={category.id}>{category.name}</option>)}</select></label>
          <label>标签<input value={form.tags} onChange={(event) => set('tags', event.target.value)} placeholder="阅读, 随笔（用逗号分隔）" /></label>
          <label>摘要<textarea value={form.excerpt} onChange={(event) => set('excerpt', event.target.value)} maxLength={300} rows={2} placeholder="留空会从正文自动截取" /></label>
          <label className="cover-field">封面地址<input value={form.cover} onChange={(event) => set('cover', event.target.value)} placeholder="图片 URL 或上传图片" /></label>
          <label className="upload-button"><ImagePlus aria-hidden="true" />上传封面<input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={(event) => void upload(event.target.files?.[0])} /></label>
        </div>
        <div className="editor-split">
          <label className="editor-pane">Markdown 正文<textarea value={form.content} onChange={(event) => set('content', event.target.value)} minLength={10} required /></label>
          <section className="preview-pane" aria-labelledby="preview-title"><h2 id="preview-title">实时预览</h2><div className="markdown-body"><ReactMarkdown remarkPlugins={[remarkGfm]}>{form.content}</ReactMarkdown></div></section>
        </div>
        {error && <p className="form-message is-error" role="alert">{error}</p>}
        <button className="primary-button save-button" type="submit" disabled={busy} aria-busy={busy}><Save aria-hidden="true" />{busy ? '正在保存…' : id ? '保存修改' : '发布文章'}</button>
      </form>
    </section>
  )
}

