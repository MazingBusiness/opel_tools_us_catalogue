// Fails when a product has no type, sits in two types, or a type lists a model that isn't in the data.
import { readFileSync } from 'node:fs'
import { TYPES } from '../src/data/types.js'

const products = JSON.parse(readFileSync(new URL('../src/data/products.json', import.meta.url)))
const byId = new Map(products.map((p) => [p.id, p]))
const problems = []
const seen = new Map()
const slugs = new Set()

for (const t of TYPES) {
  const key = `${t.category}/${t.slug}`
  if (slugs.has(key)) problems.push(`duplicate type slug ${key}`)
  slugs.add(key)
  for (const m of t.models) {
    const p = byId.get(m)
    if (!p) problems.push(`${key} lists model ${m}, which is not in products.json`)
    else if (p.category !== t.category) problems.push(`${m} is in ${p.category} but listed under ${key}`)
    if (seen.has(m)) problems.push(`${m} is in both ${seen.get(m)} and ${key}`)
    seen.set(m, key)
  }
}
for (const p of products) if (!seen.has(p.id)) problems.push(`${p.id} (${p.name}, ${p.category}) has no type`)

// Ids are web addresses (/product/:id), so they must be safe in a URL and unique even ignoring case.
const lowerIds = new Map()
for (const p of products) {
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(p.id)) problems.push(`product id "${p.id}" has a character that isn't safe in a web address`)
  const k = p.id.toLowerCase()
  if (lowerIds.has(k)) problems.push(`product ids "${lowerIds.get(k)}" and "${p.id}" differ only in upper and lower case`)
  lowerIds.set(k, p.id)
  if (p.model !== p.id) problems.push(`product ${p.id} has model ${p.model}; id and model must match`)
}

const models = products.map((p) => p.model)
for (const m of new Set(models.filter((m, i) => models.indexOf(m) !== i))) problems.push(`model number ${m} is used by more than one product`)

const spares = JSON.parse(readFileSync(new URL('../src/data/spare_parts.json', import.meta.url)))
const spareIds = new Set()
for (const r of spares) {
  if (spareIds.has(r.id)) problems.push(`duplicate spare part id ${r.id}`)
  spareIds.add(r.id)
  if (r.kind === 'kit') {
    if (!r.opelModels.length) problems.push(`spare kit ${r.id} names no OPEL model`)
    for (const m of r.opelModels) if (!byId.has(m)) problems.push(`spare kit ${r.id} names model ${m}, which is not in products.json`)
  }
}

if (problems.length) {
  console.error(`Product type check failed:\n  ${problems.join('\n  ')}`)
  process.exit(1)
}
console.log(`Product types OK: ${products.length} products in ${TYPES.length} types, ${spares.length} spare part entries.`)
