import raw from './spare_parts.json' with { type: 'json' }
import { findProduct, titleCase } from './catalogue.js'

// Model codes are stored as the brochure prints them ("CM-5 PRO (30PCS)"); compare without spaces, dashes or pack sizes.
export const normModel = (s) => s.toUpperCase().replace(/\(.*?\)/g, '').replace(/[\s-]+/g, '')

// scripts/check-types.mjs fails the build if a kit names an OPEL model that isn't in products.json.
export const SPARE_PARTS = raw.map((r) => {
  const tools = r.kind === 'kit' ? r.opelModels.map(findProduct) : []
  const label = r.kind === 'kit' ? `${r.opelModels.join(' / ')} Spare Parts` : titleCase(r.name)
  const fits = r.kind === 'kit' ? [...r.opelModels, ...r.refCodes] : r.fitsModels
  return { ...r, label, tools, fitsNorm: new Set(fits.map(normModel)) }
})
export const KITS = SPARE_PARTS.filter((r) => r.kind === 'kit')
export const PARTS = SPARE_PARTS.filter((r) => r.kind === 'part')

export const findSparePart = (id) => SPARE_PARTS.find((r) => r.id === id)
export const sparePartPath = (r) => `/spare-parts/${r.id}`
export const sparePartImage = (r) => `/images/parts/${r.image}`
export const kitsForProduct = (p) => KITS.filter((k) => k.opelModels.includes(p.id))

export function searchSpareParts(q) {
  const terms = q.trim().toLowerCase().split(/\s+/).filter(Boolean)
  if (!terms.length) return []
  return SPARE_PARTS.filter((r) => {
    const hay = [r.label, r.title, ...(r.parts ?? []), ...(r.features ?? []), ...(r.fitsModels ?? []), ...(r.refCodes ?? []), ...(r.codes ?? []), ...r.tools.map((t) => t.name)]
      .join(' ')
      .toLowerCase()
    return terms.every((t) => hay.includes(t) || r.fitsNorm.has(normModel(t)))
  })
}
