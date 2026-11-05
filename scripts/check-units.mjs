// Checks the US unit converter against known values, then lists every spec it leaves as printed.
import { readFileSync } from 'node:fs'
import { toUS } from '../src/data/units.js'
import { PRODUCTS } from '../src/data/catalogue.js'
import { isCorded } from '../src/data/units.js'
import { FILTERS, norm } from '../src/data/filters.js'

const cases = [
  ['Blade Capacity', '125mm', '4.92 in'],
  ['Blade Diameter', '110/125mm', '4.33/4.92 in'],
  ['Planning Depth', '1-4mm', '0.04-0.16 in'],
  ['Cutting Depth(cm)', '15.5', '6.1 in'],
  ['Blade diameter(mm)', '405', '15.9 in'],
  ['Net weight', '18KG', '39.7 lb'],
  ['Maximum Torque', '60Nm', '44.3 ft-lb'],
  ['Torque', '14 Nm', '124 in-lb'],
  ['Single Impacting Force', '55J', '40.6 ft-lb'],
  ['Rated Pressure', '180 Bar', '2611 PSI'],
  ['High pressure pipe compression strength', '25mpa', '3626 PSI'],
  ['Maximum Flow', '16L/min', '4.23 GPM'],
  ['Hopper capacity', '40L', '10.57 gal'],
  ['Max Flow', '1200ml/min', '40.6 fl oz/min'],
  ['Fuel Tank', '550ml', '18.6 fl oz'],
  ['High pressure pipe', '20m', '65.6 ft'],
  ['Volume', '0.17m³', '6 ft³'],
  ['Temperature', '50°C', '122 °F'],
  ['No Load Speed', '0-2600r/min', '0-2600 RPM'],
  ['Impact Rating', '0 to 3400Ipm', '0 to 3400 IPM'],
  ['Rated Voltage', '220/240V', '120V'],
  ['Voltage frequency', '220V/50HZ', '120V/60Hz'],
  ['Rated Frequency', '50/60Hz', '60Hz'],
  ['Rated Voltage(V)', '220/110', '120V'],
  ['Battery Voltage', '18V', '18V'],
  ['Vibration Frequency', '0-150Hz', '0-150Hz'],
  ['Frequency', '5100BPM', '5100BPM'],
  ['Inlet Pressure', '3.0 Bar/43Psi', '3.0 Bar/43Psi'],
  // Single-phase becomes 120V, three-phase 380-415V becomes 480V, 50Hz becomes 60Hz.
  ['Lifting Voltage', '220v/50Hz', '120V/60Hz'],
  ['Input voltage', '380v', '480V'],
  ['Phase / Voltage', '3-Phase / 380V - 415V, 50Hz', '3-Phase / 480V, 60Hz'],
  ['Voltage', 'AC 415v 3 phase', 'AC 480V 3 phase'],
  ['Working Voltage', '380v/220v', '480V/120V'],
  ['Voltage(V)', '220/380', '120V/480V'],
  ['Vlotage', '220-240V 50HZ', '120V 60Hz'],
  ['Voltage', '220v/380v/Engine', '120V/480V/Engine'],
  ['Generator Output Voltage', '230V/50Hz', '120V/240V/60Hz'],
  ['Exciting Frequency', '70HZ', '70HZ'],
  ['Control Voltage', '12V', '12V'],
  ['Input voltage', '460V', '460V'],
]
const problems = []
if (toUS('Rated Frequency', '50/60Hz', { corded: false }).value !== '50/60Hz') problems.push('a cordless charger frequency was changed to 60Hz')
// Engine machines have no mains supply, so their specs must come out of US mode unchanged.
for (const id of ['110-43', '110-25', '110-17', '110-62', '110-63']) {
  const p = PRODUCTS.find((x) => x.id === id)
  if (!p) problems.push(`engine check product ${id} is missing`)
  else if (isCorded(p)) problems.push(`${id} runs on an engine but is treated as mains powered`)
}
for (const p of PRODUCTS) {
  if (isCorded(p)) continue
  for (const [k, v] of p.specs) if (toUS(k, v, { corded: false }).value.match(/^(120V|60Hz)/) && !/^(120V|60Hz)/.test(v)) problems.push(`${p.id} ${k} changed on a cordless or gasoline tool`)
}
// Two different filter choices must never read the same in US units. Rated voltage is hidden in US mode, so it is skipped.
for (const f of FILTERS) {
  if (!f.spec || f.key === 'voltage') continue
  const seen = new Map()
  for (const p of PRODUCTS) {
    const v = f.value(p)
    if (!v) continue
    const label = toUS(f.spec, v).value
    if (seen.has(label) && norm(seen.get(label)) !== norm(v)) problems.push(`${f.label} shows "${label}" for both "${seen.get(label)}" and "${v}"`)
    seen.set(label, v)
  }
}
for (const [k, v, want] of cases) {
  const got = toUS(k, v).value
  if (got !== want) problems.push(`${k}: "${v}" gave "${got}", expected "${want}"`)
}

const products = JSON.parse(readFileSync(new URL('../src/data/products.json', import.meta.url)))
const left = new Map()
for (const p of products) {
  for (const [k, v] of Object.entries(p.specs ?? {})) {
    if (!v) continue
    const r = toUS(k, v)
    if (/NaN|undefined|Infinity/.test(r.value)) problems.push(`${p.id} ${k}: "${v}" gave "${r.value}"`)
    if (r.status === 'unhandled') left.set(`${k}: ${v}`, (left.get(`${k}: ${v}`) ?? 0) + 1)
  }
}

if (problems.length) {
  console.error(`Unit check failed:\n  ${problems.join('\n  ')}`)
  process.exit(1)
}
console.log(`Units OK: ${cases.length} conversions checked.`)
if (left.size) console.log(`Left as printed in US units (${left.size}):\n  ${[...left].map(([s, n]) => `${s}${n > 1 ? ` (x${n})` : ''}`).join('\n  ')}`)
