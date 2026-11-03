import { Link } from 'react-router-dom'
import Logo from './Logo.jsx'
import { CATEGORIES, categoryPath } from '../data/catalogue.js'

export default function Footer() {
  return (
    <footer className="mt-20 border-t-4 border-highlight bg-night text-white/80">
      <div className="container-page grid gap-10 py-12 md:grid-cols-[1fr_2fr]">
        <div>
          <Logo white className="h-9" />
          <p className="mt-4 max-w-xs text-sm">Explore the OPEL range of power tools, cordless tools and equipment.</p>
        </div>
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-highlight">Products</h2>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-3">
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link to={categoryPath(c)} className="hover:text-white">{c.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="container-page py-5 text-xs text-white/50">© {new Date().getFullYear()} OPEL Tools</p>
      </div>
    </footer>
  )
}
