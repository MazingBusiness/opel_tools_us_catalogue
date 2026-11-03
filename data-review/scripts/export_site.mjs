// Export verified products (review.status === "ok") from data-review/ into the site.
// Usage: npm run export:data
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '../..')
const SRC_JSON = path.join(root, 'data-review/data/products.json')
const SRC_IMG = path.join(root, 'data-review/public/images/products')
const OUT_JSON = path.join(root, 'src/data/products.json')
const OUT_IMG = path.join(root, 'public/images/products')

const ok = JSON.parse(fs.readFileSync(SRC_JSON, 'utf8'))
  .filter((p) => p.review.status === 'ok')
  .map(({ review, ...p }) => p)

const fail = (msg) => { console.error(`export failed: ${msg}`); process.exit(1) }
const ids = new Set()
for (const p of ok) {
  if (!p.id || !p.model || !p.name) fail(`product missing id/model/name: ${JSON.stringify(p).slice(0, 80)}`)
  if (ids.has(p.id)) fail(`duplicate id ${p.id}`)
  ids.add(p.id)
  for (const f of p.images) if (!fs.existsSync(path.join(SRC_IMG, f))) fail(`${p.id}: image not found ${f}`)
}

const keep = new Set(ok.flatMap((p) => p.images))
fs.mkdirSync(OUT_IMG, { recursive: true })
for (const f of fs.readdirSync(OUT_IMG)) if (!keep.has(f)) fs.unlinkSync(path.join(OUT_IMG, f))
for (const f of keep) fs.copyFileSync(path.join(SRC_IMG, f), path.join(OUT_IMG, f))
fs.writeFileSync(OUT_JSON, JSON.stringify(ok, null, 2) + '\n')
console.log(`exported ${ok.length} products, ${keep.size} images`)
