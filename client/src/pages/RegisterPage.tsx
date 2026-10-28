import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api, errorMessage } from '../lib/api'

export function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const set = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }))

  const submit = async (event: FormEvent) => {
    event.preventDefault(); setBusy(true); setError('')
    try { await api.post('/auth/register', form); navigate('/login', { replace: true }) }
    catch (reason) { setError(errorMessage(reason)) }
    finally { setBusy(false) }
  }

  return (
    <section className="auth-page">
      <div className="auth-note"><p>从空白页开始。</p><span>给自己一个可以慢慢写字的地方。</span></div>
      <form className="paper-form" onSubmit={submit}>
        <h1>注册</h1>
        <p>用户名 3-20 个字符，密码至少 6 位。</p>
        <label htmlFor="username">用户名</label>
        <input id="username" autoComplete="username" minLength={3} maxLength={20} value={form.username} onChange={(event) => set('username', event.target.value)} required />
        <label htmlFor="email">邮箱</label>
        <input id="email" type="email" autoComplete="email" value={form.email} onChange={(event) => set('email', event.target.value)} required />
        <label htmlFor="new-password">密码</label>
        <input id="new-password" type="password" autoComplete="new-password" minLength={6} value={form.password} onChange={(event) => set('password', event.target.value)} required />
        {error && <p className="form-message is-error" role="alert">{error}</p>}
        <button className="primary-button" type="submit" disabled={busy} aria-busy={busy}>{busy ? '正在创建…' : '创建账号'}</button>
        <p>已经有账号？<Link to="/login">去登录</Link></p>
      </form>
    </section>
  )
}

