import { useParams } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import ProductCard from '../components/ProductCard.jsx'
import TypeTiles from '../components/TypeTiles.jsx'
import NotFound from './NotFound.jsx'
import { findCategory } from '../data/catalogue.js'

export default function Category() {
  const c = findCategory(useParams().category)
  if (!c) return <NotFound what="category" />
  return (
    <>
      <div className="bg-surface-muted">
        <div className="container-page py-8">
          <Breadcrumbs items={[['Home', '/'], ['Products', '/products'], [c.label]]} />
          <h1 className="mt-4 font-display text-5xl uppercase sm:text-6xl">{c.label}</h1>
          <p className="mt-1 text-ink-muted">{c.products.length} products</p>
        </div>
      </div>
      <div className="container-page">
        <TypeTiles types={c.types} className="mt-8" />
        <h2 className="mt-14 border-b-2 border-ink pb-2 text-xl font-extrabold uppercase tracking-wide">All {c.label} ({c.products.length})</h2>
        <ul className="card-grid mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {c.products.map((p) => <li key={p.id}><ProductCard product={p} /></li>)}
        </ul>
      </div>
    </>
  )
}
