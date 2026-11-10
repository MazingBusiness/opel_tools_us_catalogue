import { Link } from 'react-router-dom'
import { productImage, productPath } from '../data/catalogue.js'

export default function ProductCard({ product: p }) {
  const highlight = p.power.find((s) => /\d/.test(s)) ?? p.specMap['Battery Voltage']
  return (
    <Link to={productPath(p)} className="group flex h-full w-full flex-col overflow-hidden rounded-xl border border-line bg-white transition hover:-translate-y-0.5 hover:border-brand hover:shadow-lg">
      <div className="relative aspect-square w-full shrink-0 overflow-hidden bg-surface-muted">
        <img src={productImage(p.images[0])} alt={`OPEL ${[p.model, p.name].filter(Boolean).join(' ')}`} loading="lazy" className="absolute inset-0 size-full object-contain p-6 transition duration-300 group-hover:scale-105" />
        {highlight && <span className="absolute left-3 top-3 rounded bg-highlight px-2 py-0.5 text-xs font-bold text-ink">{highlight}</span>}
      </div>
      <div className="flex min-h-[7.25rem] flex-1 flex-col border-t-4 border-transparent p-4 group-hover:border-highlight">
        <span className="text-xs font-bold tracking-wider text-ink-muted">{p.model ? `MODEL ${p.model}${p.variant ? ` · ${p.variant}` : ''}` : '\u00a0'}</span>
        <h3 className="mt-1 line-clamp-2 min-h-[2.75rem] font-bold leading-snug group-hover:text-brand">{p.name}</h3>
        <span className="mt-auto pt-3 text-sm font-bold text-brand">View details ›</span>
      </div>
    </Link>
  )
}
