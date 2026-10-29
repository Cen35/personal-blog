import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/auth'

export function Layout() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const close = () => setOpen(false)

  return (
    <div className={location.pathname === '/' ? 'site-shell is-home' : 'site-shell'}>
      <a className="skip-link" href="#main">跳到正文</a>
      <header className="site-header">
        <Link className="mini-wordmark" to="/" onClick={close}>PERSONAL BLOG</Link>
        <button className="menu-button" type="button" aria-expanded={open} aria-controls="primary-navigation" onClick={() => setOpen((value) => !value)}>
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}<span className="sr-only">{open ? '关闭菜单' : '打开菜单'}</span>
        </button>
        <nav id="primary-navigation" className={open ? 'primary-nav is-open' : 'primary-nav'} aria-label="主导航">
          <NavLink to="/" end onClick={close}>文章</NavLink>
          <Link to="/?category=日常" onClick={close}>分类</Link>
          <Link to="/?keyword=关于我" onClick={close}>关于我</Link>
          <NavLink to="/write" onClick={close}>写文章</NavLink>
          {user ? (
            <>
              <NavLink to="/profile" onClick={close}>{user.username}</NavLink>
              <button type="button" className="text-button" onClick={() => { logout(); close() }}>退出</button>
            </>
          ) : <NavLink to="/login" state={{ from: location.pathname }} onClick={close}>登录</NavLink>}
        </nav>
      </header>
      <main id="main" className="page-enter"><Outlet /></main>
      <footer className="site-footer">
        <p>PERSONAL BLOG：写给日常，也写给未来的自己</p>
        <div><Link to="/">文章</Link><Link to="/?focus=categories">分类</Link><Link to="/write">写文章</Link></div>
        <p>© 2026</p>
        <p className="photo-credit">示例摄影：Paul E. Harrer、Barcelona、Larry Chen、Ales Krivec，经 Picsum 提供</p>
      </footer>
    </div>
  )
}

