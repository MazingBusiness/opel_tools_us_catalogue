import { Fragment } from 'react'
import { Link } from 'react-router-dom'

export default function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs font-semibold text-ink-muted">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map(([label, to], i) => (
          <Fragment key={label + i}>
            {i > 0 && <li aria-hidden>/</li>}
            <li>{to ? <Link to={to} className="hover:text-brand hover:underline">{label}</Link> : <span className="text-ink">{label}</span>}</li>
          </Fragment>
        ))}
      </ol>
    </nav>
  )
}
