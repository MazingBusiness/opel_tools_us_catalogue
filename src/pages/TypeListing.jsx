import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import ProductCard from '../components/ProductCard.jsx'
import NotFound from './NotFound.jsx'
import { categoryPath, findCategory, findType, typePath } from '../data/catalogue.js'
import { SORTS, buildFacets, matches, readQuery, sortProducts, writeQuery } from '../data/filters.js'

function FilterGroup({ facet, picked, onToggle }) {
  return (
    <details open className="group border-b border-line py-4">
      <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-extrabold uppercase tracking-wide">
        {facet.label}
        <span className="text-lg leading-none transition group-open:rotate-45" aria-hidden>+</span>
      </summary>
      <ul className="mt-3 space-y-2">
        {facet.options.map((o) => {
          const on = picked.includes(o.key)
          const off = !on && o.count === 0
          return (
            <li key={o.key}>
              <label className={`flex cursor-pointer items-center gap-3 text-sm ${off ? 'opacity-40' : ''}`}>
                <input type="checkbox" checked={on} disabled={off} onChange={() => onToggle(facet.key, o.key)} className="size-4 accent-brand" />
                <span className="flex-1">{o.label}</span>
                <span className="text-xs text-ink-muted">({o.count})</span>
              </label>
            </li>
          )
        })}
      </ul>
    </details>
  )
}

export default function TypeListing() {
  const params = useParams()
  const category = findCategory(params.category)
  const type = findType(category, params.type)
  const [search, setSearch] = useSearchParams()
  const [drawer, setDrawer] = useState(false)

  const base = type?.products ?? []
  const { selected, sort, clean } = useMemo(() => readQuery(search, base), [search, base])

  // Unknown filter values, unknown keys or a bad sort in the URL are dropped without adding a history entry.
  const dirty = type && clean !== search.toString()
  useEffect(() => {
    if (dirty) setSearch(clean, { replace: true })
  }, [dirty, clean, setSearch])

  if (!category) return <NotFound what="category" />
  if (!type) return <NotFound what="product type" back={[categoryPath(category), `All ${category.label}`]} />

  const facets = buildFacets(base, selected)
  const shown = sortProducts(base.filter((p) => matches(p, selected)), sort)
  const pickedCount = Object.values(selected).flat().length

  const update = (nextSelected, nextSort = sort) => setSearch(writeQuery(nextSelected, nextSort))
  const toggle = (key, value) => {
    const cur = selected[key] ?? []
    update({ ...selected, [key]: cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value] })
  }
  const labelOf = (key, value) => facets.find((f) => f.key === key)?.options.find((o) => o.key === value)?.label ?? value

  const sidebar = (
    <>
      <div className="flex items-center justify-between border-b-2 border-ink pb-3">
        <h2 className="text-sm font-extrabold uppercase tracking-widest">Filters</h2>
        {pickedCount > 0 && <button onClick={() => update({})} className="text-xs font-bold text-brand hover:underline">Clear all</button>}
      </div>
      {facets.length === 0 && <p className="py-4 text-sm text-ink-muted">No filters for this product type.</p>}
      {facets.map((f) => <FilterGroup key={f.key} facet={f} picked={selected[f.key] ?? []} onToggle={toggle} />)}
      <div className="py-4">
        <p className="text-xs font-bold uppercase tracking-wide text-ink-muted">More in {category.label}</p>
        <ul className="mt-2 space-y-1.5 text-sm">
          {category.types.filter((t) => t !== type).map((t) => (
            <li key={t.slug}><Link to={typePath(t)} className="hover:text-brand hover:underline">{t.label}</Link></li>
          ))}
        </ul>
      </div>
    </>
  )

  return (
    <>
      <div className="bg-night text-white">
        <div className="container-page py-8 [&_a]:text-white/70 [&_nav]:text-white/70 [&_span]:text-white">
          <Breadcrumbs items={[['Home', '/'], ['Products', '/products'], [category.label, categoryPath(category)], [type.label]]} />
        </div>
        <div className="container-page pb-10">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-highlight">Explore products</p>
          <h1 className="mt-2 font-display text-5xl uppercase sm:text-6xl">{type.label}</h1>
        </div>
      </div>

      <div className="container-page grid gap-8 py-8 lg:grid-cols-[16rem_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2">{sidebar}</div>
        </aside>

        <div>
          <div className="flex flex-wrap items-center gap-3 border-b border-line pb-4">
            <h2 className="text-lg font-extrabold">Products ({shown.length})</h2>
            <button onClick={() => setDrawer(true)} className="rounded-full border border-ink px-4 py-1.5 text-sm font-bold lg:hidden">
              Filters{pickedCount ? ` (${pickedCount})` : ''}
            </button>
            <label className="ml-auto flex items-center gap-2 text-sm">
              <span className="text-ink-muted">Sort by</span>
              <select value={sort} onChange={(e) => update(selected, e.target.value)} className="rounded-md border border-line bg-white px-3 py-1.5 font-semibold">
                {SORTS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
              </select>
            </label>
          </div>

          {pickedCount > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2">
              {Object.entries(selected).flatMap(([k, vals]) =>
                vals.map((v) => (
                  <li key={k + v}>
                    <button onClick={() => toggle(k, v)} className="flex items-center gap-2 rounded-full bg-surface-muted px-3 py-1 text-xs font-bold hover:bg-highlight">
                      {labelOf(k, v)} <span aria-hidden>×</span>
                    </button>
                  </li>
                )),
              )}
            </ul>
          )}

          {shown.length === 0 ? (
            <div className="py-20 text-center">
              <p className="font-bold">No products match these filters.</p>
              <button onClick={() => update({})} className="mt-4 text-sm font-bold text-brand hover:underline">Clear all filters</button>
            </div>
          ) : (
            <ul className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
              {shown.map((p) => <li key={p.id}><ProductCard product={p} /></li>)}
            </ul>
          )}
        </div>
      </div>

      {drawer && (
        <div className="fixed inset-0 z-[60] flex lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDrawer(false)} />
          <div className="relative ml-auto flex h-full w-[min(22rem,88vw)] flex-col bg-white">
            <div className="flex-1 overflow-y-auto p-5">{sidebar}</div>
            <button onClick={() => setDrawer(false)} className="m-4 bg-highlight py-3 text-sm font-bold uppercase tracking-wider text-ink">
              Show {shown.length} products
            </button>
          </div>
        </div>
      )}
    </>
  )
}
