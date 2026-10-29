import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/auth'
import { errorMessage } from '../lib/api'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [loginValue, setLoginValue] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (event: FormEvent) => {
    event.preventDefault(); setBusy(true); setError('')
    try {
      await login(loginValue, password)
      navigate((location.state as { from?: string } | null)?.from ?? '/profile', { replace: true })
    } catch (reason) { setError(errorMessage(reason)) }
    finally { setBusy(false) }
  }

  return (
    <section className="auth-page">
      <div className="auth-note"><p>欢迎回来。</p><span>登录后继续写下这一页。</span></div>
      <form className="paper-form" onSubmit={submit}>
        <h1>登录</h1>
        <p>演示账号：paperwriter / demo123</p>
        <label htmlFor="login">用户名或邮箱</label>
        <input id="login" autoComplete="username" value={loginValue} onChange={(event) => setLoginValue(event.target.value)} required />
        <label htmlFor="password">密码</label>
        <input id="password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        {error && <p className="form-message is-error" role="alert">{error}</p>}
        <button className="primary-button" type="submit" disabled={busy} aria-busy={busy}>{busy ? '正在登录…' : '登录'}</button>
        <p>还没有账号？<Link to="/register">去注册</Link></p>
      </form>
    </section>
  )
}

