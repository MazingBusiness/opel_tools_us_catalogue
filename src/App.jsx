import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import AllProducts from './pages/AllProducts.jsx'
import Category from './pages/Category.jsx'
import TypeListing from './pages/TypeListing.jsx'
import Product from './pages/Product.jsx'
import Search from './pages/Search.jsx'
import NotFound from './pages/NotFound.jsx'
import SpareParts from './pages/SpareParts.jsx'
import SparePart from './pages/SparePart.jsx'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<AllProducts />} />
          <Route path="/products/:category" element={<Category />} />
          <Route path="/products/:category/:type" element={<TypeListing />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/spare-parts" element={<SpareParts />} />
          <Route path="/spare-parts/:id" element={<SparePart />} />
          <Route path="/search" element={<Search />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
