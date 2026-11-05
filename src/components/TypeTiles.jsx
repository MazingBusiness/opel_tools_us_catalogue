import { Link } from 'react-router-dom'
import { productImage, typePath } from '../data/catalogue.js'

export default function TypeTiles({ types, className = '' }) {
  return (
    <ul className={`card-grid grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 ${className}`}>
      {types.map((t) => (
        <li key={t.slug}>
          <Link to={typePath(t)} className="group flex h-full w-full flex-col items-center rounded-xl p-3 text-center hover:bg-surface-muted">
            <span className="relative aspect-square w-full shrink-0 overflow-hidden rounded-xl bg-surface-muted group-hover:bg-white">
              <img src={productImage(t.products[0].images[0])} alt="" loading="lazy" className="absolute inset-0 size-full object-contain p-4 transition group-hover:scale-105" />
            </span>
            <span className="mt-3 line-clamp-2 min-h-[2.5rem] text-sm font-bold leading-snug group-hover:text-brand">{t.label}</span>
            <span className="text-xs text-ink-muted">{t.products.length} {t.products.length === 1 ? 'product' : 'products'}</span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
