import { useEffect, useMemo, useState } from 'react'
import { api, type Categoria } from '../lib/api'

export default function DashboardPage() {
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [data, setData] = useState<{ totalProducts: number; totalInventoryValue: number; lowStockCount: number; productsByCategory: { categoryId: string; count: number; }[] } | null>(null)
	const [categories, setCategories] = useState<Categoria[]>([])
	const catName = useMemo(() => Object.fromEntries(categories.map(c => [c.id, c.name])), [categories])

	useEffect(() => {
		let cancelled = false
		setLoading(true)
		setError(null)
			Promise.all([api.getDashboard(), api.listCategories()]).then(([d, cats]) => {
			if (cancelled) return
				setData(d)
				setCategories(cats)
		}).catch(err => {
			if (cancelled) return
			setError(err.message || 'Erro ao carregar dashboard')
		}).finally(() => !cancelled && setLoading(false))
		return () => { cancelled = true }
	}, [])

	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="card p-5">
					<div className="text-sm text-gray-500">Produtos</div>
					<div className="text-2xl font-semibold mt-2">{data?.totalProducts ?? '—'}</div>
				</div>
				<div className="card p-5">
					<div className="text-sm text-gray-500">Valor em estoque</div>
					<div className="text-2xl font-semibold mt-2">{data ? data.totalInventoryValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '—'}</div>
				</div>
				<div className="card p-5">
					<div className="text-sm text-gray-500">Baixo estoque</div>
					<div className="text-2xl font-semibold mt-2">{data?.lowStockCount ?? '—'}</div>
				</div>
				<div className="card p-5">
					<div className="text-sm text-gray-500">Status</div>
					<div className="text-2xl font-semibold mt-2">{loading ? 'Carregando...' : (error ? 'Erro' : 'OK')}</div>
				</div>
			</div>

			<div className="card p-5">
				<div className="font-medium mb-3">Produtos por categoria</div>
				{!data && loading && <div className="text-gray-500">Carregando...</div>}
				{error && !loading && <div className="text-red-600">{error}</div>}
				{data && !loading && (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
									{data.productsByCategory.map((c) => (
							<div key={c.categoryId} className="border rounded-lg p-3">
											<div className="text-sm text-gray-500">{catName[c.categoryId] || c.categoryId}</div>
								<div className="text-xl font-semibold">{c.count}</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	)
}
