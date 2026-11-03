import raw from './products.json' with { type: 'json' }
import { TYPES } from './types.js'

const SPEC_KEY_FIXES = { 'No-Load Speed': 'No Load Speed', 'Battery type': 'Battery Type' }

// Spelling slips from the printed brochure, fixed for display only. Search still matches the original.
const NAME_FIXES = [
  [/\bplanner\b/gi, 'Planer'],
  [/\brachet\b/gi, 'Ratchet'],
  [/\bcompresser\b/gi, 'Compressor'],
  [/\bchain saw\b/gi, 'Chainsaw'],
]
const capitalize = (s) => s.replace(/(^|[\s/(])([a-z])/g, (_, pre, c) => pre + c.toUpperCase())
const displayName = (name) => capitalize(NAME_FIXES.reduce((s, [re, to]) => s.replace(re, to), name))

export const titleCase = (s) =>
  s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()).replace(/Equipments\b/, 'Equipment')
const slugify = (s) => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

const typeOf = new Map(TYPES.flatMap((t) => t.models.map((m) => [m, t])))

// The brochure sometimes wraps a spec value onto its own line; extraction puts it in notes and leaves the spec empty.
function normalize(p) {
  const notes = [...(p.notes ?? [])]
  const specs = Object.entries(p.specs)
    .map(([k, v]) => [SPEC_KEY_FIXES[k] ?? k, v || notes.shift() || ''])
    .filter(([, v]) => v)
  return {
    ...p,
    name: displayName(p.name),
    brochureName: p.name,
    power: p.power ?? [],
    specs,
    specMap: Object.fromEntries(specs),
    notes,
  }
}

const all = raw.map(normalize)

export const CATEGORIES = [...new Set(all.map((p) => p.category))].map((name) => {
  const label = titleCase(name)
  return { name, label, slug: slugify(label), types: [], products: [] }
})
const categoryByName = new Map(CATEGORIES.map((c) => [c.name, c]))

for (const t of TYPES) {
  const category = categoryByName.get(t.category)
  category.types.push({ slug: t.slug, label: t.label, category, products: [] })
}

// scripts/check-types.mjs fails the build if a product has no type, so every product lands somewhere.
export const PRODUCTS = all.map((p) => {
  const t = typeOf.get(p.id)
  const category = categoryByName.get(p.category)
  const type = category.types.find((x) => x.slug === t.slug)
  const product = { ...p, categoryInfo: category, type }
  type.products.push(product)
  category.products.push(product)
  return product
})

export const findCategory = (slug) => CATEGORIES.find((c) => c.slug === slug)
export const findType = (category, slug) => category?.types.find((t) => t.slug === slug)
export const findProduct = (id) => PRODUCTS.find((p) => p.id === id)
export const productImage = (file) => `/images/products/${file}`
export const categoryPath = (c) => `/products/${c.slug}`
export const typePath = (t) => `/products/${t.category.slug}/${t.slug}`
export const productPath = (p) => `/product/${encodeURIComponent(p.id)}`

export function searchProducts(list, q) {
  const terms = q.trim().toLowerCase().split(/\s+/).filter(Boolean)
  if (!terms.length) return []
  return list.filter((p) => {
    const hay = [p.model, p.name, p.brochureName, p.categoryInfo.label, p.type.label, ...p.power, ...p.specs.flat()]
      .join(' ')
      .toLowerCase()
    return terms.every((t) => hay.includes(t))
  })
}
