import { setUnits, useUnits } from './units.js'

export default function UnitsToggle({ className = '' }) {
  const units = useUnits()
  return (
    <div role="group" aria-label="Units" className={`inline-flex rounded-full p-0.5 text-xs font-bold ring-1 ring-current/25 ${className}`}>
      {[['us', 'US'], ['metric', 'Metric']].map(([u, label]) => (
        <button
          key={u}
          aria-pressed={units === u}
          onClick={() => setUnits(u)}
          className={`rounded-full px-3 py-1 ${units === u ? 'bg-highlight text-ink' : 'opacity-70 hover:opacity-100'}`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
