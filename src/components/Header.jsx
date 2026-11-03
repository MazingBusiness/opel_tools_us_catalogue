import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Logo from './Logo.jsx'
import { CATEGORIES, categoryPath, productImage, typePath } from '../data/catalogue.js'

function SearchBox({ className = '', onDone }) {
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  return (
    <form
      role="search"
      className={className}
      onSubmit={(e) => {
        e.preventDefault()
        if (!q.trim()) return
        navigate(`/search?q=${encodeURIComponent(q.trim())}`)
        setQ('')
        onDone?.()
      }}
    >
      <label className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 ring-1 ring-white/15 focus-within:bg-white focus-within:text-ink focus-within:ring-highlight">
        <svg viewBox="0 0 24 24" className="size-4 shrink-0 opacity-70" fill="none" stroke="currentColor" strokeWidth="2.2">
          <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
        </svg>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by model or tool"
          aria-label="Search products"
          className="w-full bg-transparent text-sm outline-none placeholder:text-current placeholder:opacity-60"
        />
      </label>
    </form>
  )
}

function MegaMenu({ onClose }) {
  const [active, setActive] = useState(CATEGORIES[0])
  return (
    <div className="absolute inset-x-0 top-full hidden border-t-4 border-highlight bg-white text-ink shadow-2xl lg:block">
      <div className="container-page grid grid-cols-[16rem_1fr] gap-0 py-0">
        <ul className="border-r border-line py-6">
          {CATEGORIES.map((c) => (
            <li key={c.slug}>
              <Link
                to={categoryPath(c)}
                onMouseEnter={() => setActive(c)}
                onFocus={() => setActive(c)}
                onClick={onClose}
                className={`flex items-center justify-between px-4 py-2.5 text-sm font-bold uppercase tracking-wide ${
                  active === c ? 'bg-surface-muted text-brand' : 'hover:text-brand'
                }`}
              >
                {c.label}
                <span aria-hidden>›</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="max-h-[70vh] overflow-y-auto p-8">
          <div className="mb-5 flex items-baseline justify-between">
            <h2 className="font-display text-3xl uppercase tracking-wide">{active.label}</h2>
            <Link to={categoryPath(active)} onClick={onClose} className="text-sm font-bold text-brand underline-offset-4 hover:underline">
              View all {active.products.length} products
            </Link>
          </div>
          <ul className="grid grid-cols-3 gap-4 xl:grid-cols-4">
            {active.types.map((t) => (
              <li key={t.slug}>
                <Link to={typePath(t)} onClick={onClose} className="group flex items-center gap-3 rounded-xl p-2 hover:bg-surface-muted">
                  <span className="grid size-16 shrink-0 place-items-center rounded-lg bg-surface-muted p-1.5 group-hover:bg-white">
                    <img src={productImage(t.products[0].images[0])} alt="" className="max-h-full object-contain" />
                  </span>
                  <span>
                    <span className="block text-sm font-bold leading-tight group-hover:text-brand">{t.label}</span>
                    <span className="text-xs text-ink-muted">{t.products.length} {t.products.length === 1 ? 'product' : 'products'}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function MobileMenu({ onClose }) {
  const [open, setOpen] = useState(null)
  return (
    <div className="fixed inset-0 top-16 z-40 overflow-y-auto bg-white text-ink lg:hidden">
      <div className="p-4"><SearchBox onDone={onClose} className="text-white [&_label]:bg-night" /></div>
      <ul className="divide-y divide-line border-t border-line">
        {CATEGORIES.map((c) => (
          <li key={c.slug}>
            <button
              onClick={() => setOpen(open === c ? null : c)}
              aria-expanded={open === c}
              className="flex w-full items-center justify-between px-4 py-4 text-left text-sm font-bold uppercase tracking-wide"
            >
              {c.label}
              <span className={`transition ${open === c ? 'rotate-90 text-brand' : ''}`} aria-hidden>›</span>
            </button>
            {open === c && (
              <ul className="bg-surface-muted pb-2">
                <li>
                  <Link to={categoryPath(c)} onClick={onClose} className="block px-6 py-3 text-sm font-bold text-brand">
                    All {c.label}
                  </Link>
                </li>
                {c.types.map((t) => (
                  <li key={t.slug}>
                    <Link to={typePath(t)} onClick={onClose} className="flex items-center gap-3 px-6 py-2 text-sm">
                      <img src={productImage(t.products[0].images[0])} alt="" className="size-10 rounded bg-white object-contain p-1" />
                      {t.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Header() {
  const [menu, setMenu] = useState(false)
  const [mobile, setMobile] = useState(false)
  const ref = useRef(null)
  const { pathname, search } = useLocation()

  useEffect(() => {
    setMenu(false)
    setMobile(false)
  }, [pathname, search])

  useEffect(() => {
    if (!menu) return
    const onKey = (e) => e.key === 'Escape' && setMenu(false)
    const onDown = (e) => ref.current && !ref.current.contains(e.target) && setMenu(false)
    window.addEventListener('keydown', onKey)
    window.addEventListener('mousedown', onDown)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('mousedown', onDown)
    }
  }, [menu])

  useEffect(() => {
    document.body.style.overflow = mobile ? 'hidden' : ''
  }, [mobile])

  return (
    <header ref={ref} className="sticky top-0 z-50 bg-night text-white" onMouseLeave={() => setMenu(false)}>
      <div className="container-page flex h-16 items-center gap-6">
        <button
          className="-ml-2 grid size-10 place-items-center lg:hidden"
          aria-label={mobile ? 'Close menu' : 'Open menu'}
          onClick={() => setMobile((m) => !m)}
        >
          <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2">
            {mobile ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
        <Link to="/" aria-label="OPEL home" className="shrink-0">
          <Logo white className="h-7 sm:h-8" />
        </Link>
        <nav className="hidden h-full items-stretch lg:flex">
          <button
            onClick={() => setMenu((m) => !m)}
            onMouseEnter={() => setMenu(true)}
            aria-expanded={menu}
            className={`flex items-center gap-1.5 border-b-4 px-4 pt-1 text-sm font-bold uppercase tracking-wider ${
              menu || pathname.startsWith('/product') ? 'border-highlight text-highlight' : 'border-transparent hover:text-highlight'
            }`}
          >
            Products
            <svg viewBox="0 0 24 24" className={`size-4 transition ${menu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        </nav>
        <SearchBox className="ml-auto hidden w-full max-w-sm md:block" />
        <Link to="/search" aria-label="Search" className="ml-auto grid size-10 place-items-center md:hidden">
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.2">
            <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
          </svg>
        </Link>
      </div>
      {menu && <MegaMenu onClose={() => setMenu(false)} />}
      {mobile && <MobileMenu onClose={() => setMobile(false)} />}
    </header>
  )
}
