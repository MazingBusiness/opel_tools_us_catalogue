import Breadcrumbs from '../components/Breadcrumbs.jsx'
import SparePartCard from '../components/SparePartCard.jsx'
import { KITS, PARTS } from '../data/spareParts.js'

function Section({ title, items }) {
  return (
    <section className="mt-10">
      <h2 className="border-b-2 border-ink pb-2 text-xl font-extrabold uppercase tracking-wide">{title}</h2>
      <ul className="card-grid mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {items.map((r) => <li key={r.id}><SparePartCard item={r} /></li>)}
      </ul>
    </section>
  )
}

export default function SpareParts() {
  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[['Home', '/'], ['Spare Parts']]} />
      <h1 className="mt-6 font-display text-4xl uppercase tracking-wide sm:text-5xl">Spare Parts</h1>
      <p className="mt-2 max-w-2xl text-ink-muted">Genuine OPEL replacement parts. Find the kit for your tool, or browse parts by type.</p>
      <Section title="Parts by tool" items={KITS} />
      <Section title="Parts by part type" items={PARTS} />
    </div>
  )
}
