import { Link } from 'react-router-dom'
import { productImage, typePath } from '../data/catalogue.js'

export default function TypeTiles({ types, className = '' }) {
  return (
    <ul className={`grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 ${className}`}>
      {types.map((t) => (
        <li key={t.slug}>
          <Link to={typePath(t)} className="group flex h-full flex-col items-center rounded-xl p-3 text-center hover:bg-surface-muted">
            <span className="grid aspect-square w-full place-items-center rounded-xl bg-surface-muted p-4 group-hover:bg-white">
              <img src={productImage(t.products[0].images[0])} alt="" loading="lazy" className="max-h-full object-contain transition group-hover:scale-105" />
            </span>
            <span className="mt-3 text-sm font-bold group-hover:text-brand">{t.label}</span>
            <span className="text-xs text-ink-muted">{t.products.length} {t.products.length === 1 ? 'product' : 'products'}</span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
