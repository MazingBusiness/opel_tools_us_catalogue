import { Link } from 'react-router-dom'
import { sparePartImage, sparePartPath } from '../data/spareParts.js'

export default function SparePartCard({ item: r }) {
  const sub = r.kind === 'kit' ? r.tools.map((t) => t.name).join(' / ') : r.codes ? `Code ${r.codes.join(' / ')}` : `Fits ${r.fitsModels.slice(0, 3).join(', ')}${r.fitsModels.length > 3 ? ` and ${r.fitsModels.length - 3} more` : ''}`
  const count = r.kind === 'kit' ? `${r.parts.length} parts` : 'Part'
  return (
    <Link to={sparePartPath(r)} className="group flex h-full w-full flex-col overflow-hidden rounded-xl border border-line bg-white transition hover:-translate-y-0.5 hover:border-brand hover:shadow-lg">
      <div className="relative aspect-square w-full shrink-0 overflow-hidden bg-white">
        <img src={sparePartImage(r)} alt={r.label} loading="lazy" className="absolute inset-0 size-full object-contain p-4 transition duration-300 group-hover:scale-105" />
        <span className="absolute left-3 top-3 rounded bg-highlight px-2 py-0.5 text-xs font-bold text-ink">{count}</span>
      </div>
      <div className="flex min-h-[8.25rem] flex-1 flex-col border-t-4 border-transparent p-4 group-hover:border-highlight">
        <h3 className="line-clamp-2 min-h-[2.75rem] font-bold leading-snug group-hover:text-brand">{r.label}</h3>
        <span className="mt-1 line-clamp-2 min-h-[2rem] text-xs leading-snug text-ink-muted">{sub}</span>
        <span className="mt-auto pt-3 text-sm font-bold text-brand">View parts ›</span>
      </div>
    </Link>
  )
}
