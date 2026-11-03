import { Link } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import TypeTiles from '../components/TypeTiles.jsx'
import { CATEGORIES, PRODUCTS, categoryPath } from '../data/catalogue.js'

export default function AllProducts() {
  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[['Home', '/'], ['Products']]} />
      <h1 className="mt-4 font-display text-5xl uppercase">Explore products</h1>
      <p className="mt-2 text-ink-muted">{PRODUCTS.length} products in {CATEGORIES.length} categories.</p>
      {CATEGORIES.map((c) => (
        <section key={c.slug} className="mt-12">
          <div className="flex items-baseline justify-between border-b-2 border-ink pb-2">
            <h2 className="text-xl font-extrabold uppercase tracking-wide">{c.label}</h2>
            <Link to={categoryPath(c)} className="text-sm font-bold text-brand hover:underline">View all {c.products.length}</Link>
          </div>
          <TypeTiles types={c.types} className="mt-6" />
        </section>
      ))}
    </div>
  )
}
