// Sidebar filters, built only from fields the catalogue actually has.
// Values are compared in a standard form ("220V", "220 V" and "220V/50Hz" all become "220v") and shown as written.

export const norm = (s) =>
  String(s)
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/\/(50|60)(\/60)?hz$/, '')
    .replace(/a\.?h\.?$/, 'ah')

const spec = (key) => (p) => p.specMap[key] ?? null
const specFilter = (key, label, specKey) => ({ key, label, spec: specKey, value: spec(specKey) })

const watts = (p) => {
  const ws = p.power.flatMap((s) => [...s.matchAll(/(\d[\d,]*)\s*W\b/gi)].map((m) => Number(m[1].replace(/,/g, ''))))
  return ws.length ? Math.max(...ws) : null
}
const POWER_BANDS = [
  [1000, 'Under 1,000 W'],
  [1500, '1,000 to 1,499 W'],
  [2000, '1,500 to 1,999 W'],
  [Infinity, '2,000 W and up'],
]

const powerSource = (p) => {
  if (p.specMap['Battery Voltage'] || p.specMap['Battery Type']) return 'Cordless'
  if (p.power.some((s) => /\d\s*cc\b/i.test(s))) return 'Gasoline'
  if (p.specMap['Rated Voltage'] || watts(p) != null) return 'Corded electric'
  return null
}

export const FILTERS = [
  { key: 'source', label: 'Power source', value: powerSource },
  { key: 'product', label: 'Product', value: (p) => p.name },
  {
    key: 'power',
    label: 'Input power',
    value: (p) => {
      const w = watts(p)
      return w == null ? null : POWER_BANDS.find(([max]) => w < max)[1]
    },
    rank: (label) => POWER_BANDS.findIndex(([, l]) => l === label),
  },
  specFilter('voltage', 'Rated voltage', 'Rated Voltage'),
  specFilter('battery', 'Battery voltage', 'Battery Voltage'),
  specFilter('battery-capacity', 'Battery capacity', 'Battery Type'),
  specFilter('chuck', 'Chuck size', 'Chuck Size'),
  specFilter('blade', 'Blade capacity', 'Blade Capacity'),
  specFilter('blade-diameter', 'Blade diameter', 'Blade Diameter'),
  specFilter('drilling', 'Drilling diameter', 'Drilling Diameter'),
  specFilter('wheel', 'Wheel size', 'Wheel Size'),
  specFilter('torque', 'Maximum torque', 'Maximum Torque'),
  specFilter('impact', 'Impact energy', 'Single Impacting Force'),
]

export const SORTS = [
  { key: 'featured', label: 'Featured' },
  { key: 'model', label: 'Model number' },
  { key: 'name', label: 'Name (A to Z)' },
  { key: 'power-desc', label: 'Power (high to low)' },
  { key: 'power-asc', label: 'Power (low to high)' },
]

const leadingNumber = (s) => parseFloat(String(s).replace(/,/g, ''))
function compareLabels(def) {
  return (a, b) => {
    if (def.rank) return def.rank(a.label) - def.rank(b.label)
    const na = leadingNumber(a.label)
    const nb = leadingNumber(b.label)
    if (!Number.isNaN(na) && !Number.isNaN(nb) && na !== nb) return na - nb
    return a.label.localeCompare(b.label)
  }
}

const valueKey = (def, p) => {
  const v = def.value(p)
  return v == null || v === '' ? null : norm(v)
}

// selected: { [filterKey]: string[] of normalized values }. Within a filter values are OR'd; across filters, AND.
export function matches(p, selected, skipKey) {
  return Object.entries(selected).every(([key, vals]) => {
    if (key === skipKey || !vals.length) return true
    const def = FILTERS.find((f) => f.key === key)
    return vals.includes(valueKey(def, p))
  })
}

// Facets that apply to this set of products. A filter only shows when its products have at least two different values.
// Each count is the number of products that would match if that value were picked alongside the other filters.
export function buildFacets(products, selected = {}) {
  return FILTERS.flatMap((def) => {
    const options = new Map()
    for (const p of products) {
      const k = valueKey(def, p)
      if (k != null && !options.has(k)) options.set(k, { key: k, label: def.value(p), count: 0 })
    }
    if (options.size < 2) return []
    for (const p of products) {
      if (!matches(p, selected, def.key)) continue
      const k = valueKey(def, p)
      if (k != null) options.get(k).count++
    }
    return [{ key: def.key, label: def.label, spec: def.spec, options: [...options.values()].sort(compareLabels(def)) }]
  })
}

// Reads filters and sort from the URL, keeping only values that exist for these products.
// `clean` is the canonical query string; when it differs from the URL, the page replaces the URL with it.
export function readQuery(params, products) {
  const facets = buildFacets(products)
  const selected = {}
  for (const f of facets) {
    const known = new Set(f.options.map((o) => o.key))
    const vals = [...new Set(params.getAll(f.key).map(norm))].filter((v) => known.has(v))
    if (vals.length) selected[f.key] = vals
  }
  const sortParam = params.get('sort')
  const sort = SORTS.some((s) => s.key === sortParam) ? sortParam : 'featured'
  return { selected, sort, clean: writeQuery(selected, sort) }
}

export function writeQuery(selected, sort) {
  const q = new URLSearchParams()
  for (const f of FILTERS) for (const v of selected[f.key] ?? []) q.append(f.key, v)
  if (sort !== 'featured') q.set('sort', sort)
  return q.toString()
}

export function sortProducts(list, sort) {
  const out = [...list]
  const w = (p) => watts(p) ?? -1
  if (sort === 'model') out.sort((a, b) => a.model.localeCompare(b.model, undefined, { numeric: true }))
  if (sort === 'name') out.sort((a, b) => a.name.localeCompare(b.name) || a.model.localeCompare(b.model, undefined, { numeric: true }))
  if (sort === 'power-desc') out.sort((a, b) => w(b) - w(a))
  if (sort === 'power-asc') out.sort((a, b) => (w(a) < 0) - (w(b) < 0) || w(a) - w(b))
  return out
}
