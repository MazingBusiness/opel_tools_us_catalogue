import { Link, useParams } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import NotFound from './NotFound.jsx'
import { productPath } from '../data/catalogue.js'
import { findSparePart, sparePartImage } from '../data/spareParts.js'

const heading = 'border-b-2 border-ink pb-2 text-sm font-extrabold uppercase tracking-widest'

export default function SparePart() {
  const { id } = useParams()
  const r = findSparePart(id)
  if (!r) return <NotFound what="spare part" />

  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[['Home', '/'], ['Spare Parts', '/spare-parts'], [r.label]]} />
      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="grid aspect-square grid-cols-[minmax(0,1fr)] grid-rows-[minmax(0,1fr)] place-items-center rounded-2xl border border-line bg-white p-8">
          <img src={sparePartImage(r)} alt={r.label} className="size-full min-h-0 object-contain" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-brand">Spare Parts · {r.kind === 'kit' ? 'By tool' : 'By part type'}</p>
          <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">{r.label}</h1>
          {r.kind === 'kit' && (
            <>
              <p className="mt-4 text-sm">
                For{' '}
                {r.tools.map((t, i) => (
                  <span key={t.id}>
                    {i > 0 && ', '}
                    <Link to={productPath(t)} className="font-bold text-brand hover:underline">OPEL {t.model} {t.name}</Link>
                  </span>
                ))}
                {r.refCodes.length > 0 && <span className="text-ink-muted"> (also listed as {r.refCodes.join(', ')})</span>}
              </p>
              <section className="mt-8">
                <h2 className={heading}>Parts in this kit ({r.parts.length})</h2>
                <ul className="mt-3 grid gap-x-6 text-sm sm:grid-cols-2">
                  {r.parts.map((x, i) => <li key={i} className="border-b border-line py-2">{titleCaseKeep(x)}</li>)}
                </ul>
              </section>
            </>
          )}
          {r.kind === 'part' && (
            <>
              {r.codes && <p className="mt-2 font-display text-2xl tracking-wide text-ink-muted">CODE {r.codes.join(' / ')}</p>}
              {r.features.length > 0 && (
                <ul className="mt-5 flex flex-wrap gap-2">
                  {r.features.map((f) => <li key={f} className="bg-highlight px-3 py-1 text-sm font-bold">{f.replace(/\.$/, '')}</li>)}
                </ul>
              )}
              {r.fitsModels.length > 0 && <section className="mt-8">
                <h2 className={heading}>Fits these models ({r.fitsModels.length})</h2>
                <ul className="mt-3 flex flex-wrap gap-2 text-sm">
                  {r.fitsModels.map((m) => <li key={m} className="rounded border border-line px-3 py-1.5 font-semibold">{m}</li>)}
                </ul>
              </section>}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// Part names are printed in capitals; show them in title case but keep codes like O-RING or 4902 readable.
function titleCaseKeep(s) {
  return s.toLowerCase().replace(/(^|[\s(/,-])([a-z])/g, (_, pre, c) => pre + c.toUpperCase())
}
