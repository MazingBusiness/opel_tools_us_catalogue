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

if (problems.length) {
  console.error(`Product type check failed:\n  ${problems.join('\n  ')}`)
  process.exit(1)
}
console.log(`Product types OK: ${products.length} products in ${TYPES.length} types.`)
