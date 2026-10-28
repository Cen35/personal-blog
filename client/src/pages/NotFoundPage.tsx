import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return <section className="not-found"><h1>这一页走丢了</h1><p>纸页可能被风吹走了，回到首页继续阅读吧。</p><Link className="primary-button" to="/">返回首页</Link></section>
}

