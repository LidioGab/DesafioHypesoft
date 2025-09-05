import { useEffect, useState } from 'react'
import './styles/index.css'
import DashboardPage from './pages/Dashboard'
import ProductsPage from './pages/Products'

function Sidebar() {
  const items = [
    { label: 'Dashboard', href: '#/' },
    { label: 'Produtos', href: '#/products' },
    { label: 'Categorias', href: '#/categories' },
    { label: 'Estoque', href: '#/inventory' },
    { label: 'Relatórios', href: '#/reports' },
    { label: 'Configurações', href: '#/settings' },
  ]
  return (
    <aside className="w-64 p-6 bg-white h-full rounded-2xl shadow-sm max-md:hidden">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)]" />
        <span className="font-semibold">HypeStore</span>
      </div>
      <nav className="space-y-2">
        {items.map(i => (
          <a key={i.href} href={i.href} className="block px-3 py-2 rounded-lg hover:bg-gray-100 text-sm">
            {i.label}
          </a>
        ))}
      </nav>
      <div className="mt-auto pt-6">
        <div className="p-4 bg-indigo-50 rounded-xl">
          <div className="text-sm mb-2 font-medium">Plano Profissional</div>
          <button className="w-full bg-[var(--color-primary)] text-white rounded-lg py-2 text-sm">Assinar</button>
        </div>
      </div>
    </aside>
  )
}

function Topbar() {
  return (
    <header className="flex items-center justify-between p-6">
      <div className="flex items-center gap-3">
        <button className="md:hidden w-9 h-9 rounded-lg bg-gray-100" onClick={() => { location.hash = '#/menu' }} aria-label="Abrir menu" />
        <div className="font-semibold">HypeStore</div>
        <nav className="hidden md:flex gap-4 text-sm text-gray-600">
          <a href="#/" className="font-medium">Visão geral</a>
          <a href="#/products">Produtos</a>
          <a href="#/inventory">Estoque</a>
          <a href="#/reports">Relatórios</a>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-9 h-9 rounded-full bg-gray-200" />
      </div>
    </header>
  )
}

// (cards e atividade recente agora vivem nas páginas dedicadas)

function RouterView() {
  const [hash, setHash] = useState(window.location.hash || '#/')
  useEffect(() => {
    const onHash = () => setHash(window.location.hash || '#/')
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  if (hash.startsWith('#/products')) return <ProductsPage />
  return <DashboardPage />
}

export default function App() {
  return (
    <div className="h-full p-6">
      <div className="grid grid-cols-1 md:grid-cols-[16rem_1fr] gap-6 h-full">
        <Sidebar />
        <main className="h-full">
          <div className="card h-full p-0">
            <Topbar />
            <div className="px-6 pb-6">
              <RouterView />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
