import { Link, Navigate, useSearchParams } from 'react-router-dom'
import { CATEGORIES, categoryPath, findProduct, productImage, productPath, typePath } from '../data/catalogue.js'

export default function Home() {
  const [params] = useSearchParams()
  // Old brochure links looked like /?p=4&product=5229; send those to the product page.
  const old = params.get('product')
  if (old) {
    const p = findProduct(old)
    return <Navigate replace to={p ? productPath(p) : '/'} />
  }

  const hero = CATEGORIES[0]
  return (
    <>
      <section className="relative overflow-hidden bg-night text-white">
        <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-gradient-to-l from-brand/40 to-transparent md:block" />
        <div className="container-page relative grid items-center gap-10 py-14 md:grid-cols-2 md:py-20">
          <div>
            <span className="inline-block bg-highlight px-3 py-1 text-xs font-bold uppercase tracking-widest text-ink">OPEL Tools</span>
            <h1 className="mt-5 font-display text-5xl uppercase leading-[0.95] sm:text-7xl">
              Explore the<br /><span className="text-brand-bright">OPEL</span> range
            </h1>
            <p className="mt-5 max-w-md text-white/75">
              Power tools, cordless tools and equipment across {CATEGORIES.length} categories.
            </p>
            <div className="mt-8">
              <Link to="/products" className="inline-block bg-highlight px-6 py-3 text-sm font-bold uppercase tracking-wider text-ink hover:bg-white">
                Explore products
              </Link>
            </div>
          </div>
          <div className="relative mx-auto flex w-full max-w-lg justify-center">
            <div className="absolute inset-x-8 inset-y-16 rounded-full bg-brand/30 blur-3xl" />
            <img
              src="/images/hero-range.webp"
              alt="OPEL SELECT tools, including a vacuum cleaner, drill, impact wrench, heat gun, angle grinder, and diamond blades"
              className="relative max-h-[34rem] w-auto max-w-full object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </section>

      <section className="container-page py-14">
        <h2 className="font-display text-4xl uppercase">Browse by category</h2>
        <ul className="card-grid mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {CATEGORIES.map((c) => (
            <li key={c.slug}>
              <Link to={categoryPath(c)} className="group flex h-full w-full flex-col overflow-hidden rounded-xl border border-line hover:border-brand hover:shadow-lg">
                <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-surface-muted">
                  <img src={productImage(c.products[0].images[0])} alt="" loading="lazy" className="absolute inset-0 size-full object-contain p-5 transition group-hover:scale-105" />
                </div>
                <div className="flex flex-1 flex-col border-t-4 border-transparent p-4 group-hover:border-highlight">
                  <h3 className="line-clamp-2 min-h-[2.75rem] font-bold leading-snug uppercase tracking-wide group-hover:text-brand">{c.label}</h3>
                  <p className="mt-auto pt-1 text-xs text-ink-muted">{c.products.length} products</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-surface-muted py-14">
        <div className="container-page">
          <h2 className="font-display text-4xl uppercase">Popular in {hero.label}</h2>
          <ul className="mt-8 flex flex-wrap gap-3">
            {hero.types.map((t) => (
              <li key={t.slug}>
                <Link to={typePath(t)} className="flex items-center gap-3 rounded-full border border-line bg-white py-1.5 pl-1.5 pr-5 text-sm font-bold hover:border-brand hover:text-brand">
                  <img src={productImage(t.products[0].images[0])} alt="" className="size-9 rounded-full bg-surface-muted object-contain p-1" />
                  {t.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
