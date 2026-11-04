import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import ProductCard from '../components/ProductCard.jsx'
import SparePartCard from '../components/SparePartCard.jsx'
import { PRODUCTS, searchProducts } from '../data/catalogue.js'
import { searchSpareParts } from '../data/spareParts.js'

export default function Search() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const q = params.get('q') ?? ''
  const [draft, setDraft] = useState(q)
  const results = searchProducts(PRODUCTS, q)
  const parts = searchSpareParts(q)
  const total = results.length + parts.length
  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[['Home', '/'], ['Search']]} />
      <form
        className="mt-6 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          navigate(`/search?q=${encodeURIComponent(draft.trim())}`)
        }}
      >
        <input key={q} defaultValue={q} onChange={(e) => setDraft(e.target.value)} autoFocus={!q} placeholder="Search by model or tool" aria-label="Search products" className="w-full rounded-md border border-line px-4 py-3 outline-none focus:border-brand" />
        <button className="bg-highlight px-6 text-sm font-bold uppercase tracking-wider text-ink">Search</button>
      </form>
      {q && <h1 className="mt-8 text-lg font-extrabold">{total} {total === 1 ? 'result' : 'results'} for “{q}”</h1>}
      {q && total === 0 && <p className="mt-2 text-ink-muted">Try a model number like 5229, or a tool name like grinder.</p>}
      <ul className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {results.map((p) => <li key={p.id}><ProductCard product={p} /></li>)}
      </ul>
      {parts.length > 0 && (
        <>
          <h2 className="mt-12 border-b-2 border-ink pb-2 text-xl font-extrabold uppercase tracking-wide">Spare parts</h2>
          <ul className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {parts.map((r) => <li key={r.id}><SparePartCard item={r} /></li>)}
          </ul>
        </>
      )}
    </div>
  )
}
