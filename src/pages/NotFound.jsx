import { Link } from 'react-router-dom'

export default function NotFound({ what = 'page', back = ['/products', 'Explore products'] }) {
  return (
    <div className="container-page py-24 text-center">
      <p className="font-display text-7xl text-brand">404</p>
      <h1 className="mt-4 text-2xl font-extrabold">We couldn't find that {what}.</h1>
      <Link to={back[0]} className="mt-8 inline-block bg-highlight px-6 py-3 text-sm font-bold uppercase tracking-wider text-ink hover:bg-ink hover:text-white">
        {back[1]}
      </Link>
    </div>
  )
}
