import { useEffect, useState } from 'react'
import './styles/index.css'

function Sidebar() {
  const items = [
    { label: 'Dashboard', href: '#/' },
    { label: 'Statistics', href: '#/stats' },
    { label: 'My Shop', href: '#/shop' },
    { label: 'Products', href: '#/products' },
    { label: 'Customers', href: '#/customers' },
    { label: 'Invoice', href: '#/invoice' },
    { label: 'Messages', href: '#/messages' },
    { label: 'Settings', href: '#/settings' },
  ]
  return (
    <aside className="w-64 p-6 bg-white h-full rounded-2xl shadow-sm">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)]" />
        <span className="font-semibold">ShopSense</span>
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
          <div className="text-sm mb-2 font-medium">Try ShopSense Pro</div>
          <button className="w-full bg-[var(--color-primary)] text-white rounded-lg py-2 text-sm">Upgrade Plan</button>
        </div>
      </div>
    </aside>
  )
}

function Topbar() {
  return (
    <header className="flex items-center justify-between p-6">
      <div className="flex items-center gap-3">
        <div className="font-semibold">UnitedMen</div>
        <nav className="hidden md:flex gap-4 text-sm text-gray-600">
          <a href="#/" className="font-medium">Overview</a>
          <a href="#/products">Product List</a>
          <a href="#/inventory">Inventory Management</a>
          <a href="#/sales">Sales Performance</a>
          <a href="#/marketing">Marketing</a>
          <a href="#/feedback">Customer Feedback</a>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-9 h-9 rounded-full bg-gray-200" />
      </div>
    </header>
  )
}

function StatCard({ title, value, sub }: { title: string, value: string, sub?: string }) {
  return (
    <div className="card p-5">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-semibold mt-2">{value}</div>
      {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
    </div>
  )
}

function RecentActivities() {
  const rows = [
    { name: 'Linen Shirt', type: 'Stock Adjustment', detail: 'Stock adjusted from 100 to 90', date: 'June 29, 2024' },
    { name: 'Jeans Jacket', type: 'New Product', detail: 'Price: $65.00, Stock: 70', date: 'June 29, 2024' },
    { name: 'Linen Shirt', type: 'Customer Review', detail: '“Great quality and fit”', date: 'June 28, 2024' },
  ]
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="font-medium">Recent Activities</div>
        <div className="flex gap-2 text-sm">
          <input className="border rounded-lg px-3 py-1.5 text-sm" placeholder="Search" />
          <button className="border rounded-lg px-3 py-1.5">Filter</button>
        </div>
      </div>
      <div className="divide-y">
        {rows.map((r, i) => (
          <div key={i} className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-gray-200" />
              <div>
                <div className="font-medium text-sm">{r.name}</div>
                <div className="text-xs text-gray-500">{r.detail}</div>
              </div>
            </div>
            <div className="text-xs text-gray-500">{r.date}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Products" value="586" sub="+5 from last month" />
        <StatCard title="Average Rating" value="4.8" sub="+0.2 from last month" />
        <StatCard title="Sales Trends" value="↗ 18.5%" sub="from last month" />
        <StatCard title="Low Stock" value="5" sub="under 50 items" />
      </div>
      <RecentActivities />
    </div>
  )
}

function Products() {
  return (
    <div className="card p-5">Products page (placeholder)</div>
  )
}

function RouterView() {
  const [hash, setHash] = useState(window.location.hash || '#/')
  useEffect(() => {
    const onHash = () => setHash(window.location.hash || '#/')
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  if (hash.startsWith('#/products')) return <Products />
  return <Dashboard />
}

export default function App() {
  return (
    <div className="h-full p-6">
      <div className="grid grid-cols-[16rem_1fr] gap-6 h-full">
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
