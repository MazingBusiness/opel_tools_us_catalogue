import { useState } from 'react'
import { useParams } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import ProductCard from '../components/ProductCard.jsx'
import NotFound from './NotFound.jsx'
import SparePartCard from '../components/SparePartCard.jsx'
import { kitsForProduct } from '../data/spareParts.js'
import { isCorded, showSpec } from '../data/units.js'
import { useUnits } from '../components/units.js'
import UnitsToggle from '../components/UnitsToggle.jsx'
import { categoryPath, findProduct, productImage, typePath } from '../data/catalogue.js'

export default function Product() {
  const { id } = useParams()
  const p = findProduct(id)
  const [shot, setShot] = useState(0)
  const units = useUnits()
  if (!p) return <NotFound what="product" />

  const { categoryInfo: category, type } = p
  const related = type.products.filter((x) => x !== p).slice(0, 4)
  const kits = kitsForProduct(p)
  const img = p.images[Math.min(shot, p.images.length - 1)]

  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[['Home', '/'], ['Products', '/products'], [category.label, categoryPath(category)], [type.label, typePath(type)], [p.model]]} />

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div>
          <div className="grid aspect-square grid-cols-[minmax(0,1fr)] grid-rows-[minmax(0,1fr)] place-items-center rounded-2xl bg-surface-muted p-10">
            <img src={productImage(img)} alt={`OPEL ${p.model} ${p.name}`} className="size-full min-h-0 object-contain" />
          </div>
          {p.images.length > 1 && (
            <div className="mt-3 flex gap-3">
              {p.images.map((f, i) => (
                <button key={f} onClick={() => setShot(i)} className={`grid size-20 place-items-center rounded-lg bg-surface-muted p-2 ring-2 ${i === shot ? 'ring-brand' : 'ring-transparent'}`}>
                  <img src={productImage(f)} alt="" className="size-full min-h-0 object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-brand">{category.label} · {type.label}</p>
          <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">{p.name}</h1>
          <p className="mt-2 font-display text-2xl tracking-wide text-ink-muted">MODEL {p.model}</p>
          {p.power.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-2">
              {p.power.map((s) => <li key={s} className="bg-highlight px-3 py-1 text-sm font-bold">{s}</li>)}
            </ul>
          )}

          {p.specs.length > 0 && (
            <section className="mt-8">
              <div className="flex items-center justify-between border-b-2 border-ink pb-2">
                <h2 className="text-sm font-extrabold uppercase tracking-widest">Specifications</h2>
                <UnitsToggle />
              </div>
              <dl className="divide-y divide-line">
                {p.specs.map(([k, v]) => {
                  const s = showSpec(k, v, units, { corded: isCorded(p) })
                  return (
                    <div key={k} className="grid grid-cols-2 gap-4 py-3 text-sm">
                      <dt className="text-ink-muted">{s.key}</dt>
                      <dd className="font-semibold">{s.value}</dd>
                    </div>
                  )
                })}
              </dl>
            </section>
          )}
          {p.notes.length > 0 && <p className="mt-4 text-sm text-ink-muted">{p.notes.join(' · ')}</p>}
        </div>
      </div>

      {kits.length > 0 && (
        <section className="mt-16">
          <h2 className="border-b-2 border-ink pb-2 text-xl font-extrabold uppercase tracking-wide">Spare parts for this model</h2>
          <ul className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {kits.map((k) => <li key={k.id}><SparePartCard item={k} /></li>)}
          </ul>
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="border-b-2 border-ink pb-2 text-xl font-extrabold uppercase tracking-wide">More {type.label}</h2>
          <ul className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {related.map((x) => <li key={x.id}><ProductCard product={x} /></li>)}
          </ul>
        </section>
      )}
    </div>
  )
}
