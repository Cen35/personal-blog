export function PageLoader({ label = '正在展开这一页' }: { label?: string }) {
  return <div className="page-status" role="status"><span className="loader-mark" aria-hidden="true" />{label}</div>
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return <section className="empty-state"><h2>{title}</h2><p>{body}</p></section>
}

