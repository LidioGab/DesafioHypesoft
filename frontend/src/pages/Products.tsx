import { useEffect, useMemo, useState } from 'react'
import { api, type Produto, type Categoria } from '../lib/api'

export default function ProductsPage() {
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [items, setItems] = useState<Produto[]>([])
	const [total, setTotal] = useState(0)
	const [page, setPage] = useState(1)
	const [pageSize] = useState(10)
	const [search, setSearch] = useState('')
	const [categoryId, setCategoryId] = useState('')
	const [categories, setCategories] = useState<Categoria[]>([])

	const pages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize])

	useEffect(() => {
		let cancelled = false
		setLoading(true)
		setError(null)
		Promise.all([
			api.listProducts({ page, pageSize, search: search || undefined, categoryId: categoryId || undefined }),
			categories.length ? Promise.resolve(categories) : api.listCategories(),
		]).then(([res, cats]) => {
			if (cancelled) return
			setItems(res.items)
			setTotal(res.totalCount)
			if (!categories.length) setCategories(cats)
		}).catch(err => {
			if (cancelled) return
			setError(err.message || 'Erro ao carregar produtos')
		}).finally(() => !cancelled && setLoading(false))
		return () => { cancelled = true }
	}, [page, pageSize, search, categoryId])

	return (
		<div className="space-y-4">
			<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
				<div>
					<h1 className="text-lg font-semibold">Produtos</h1>
					<p className="text-sm text-gray-500">Gerencie o catálogo de periféricos</p>
				</div>
				<div className="flex gap-2">
					<input value={search} onChange={e => { setPage(1); setSearch(e.target.value) }} className="border rounded-lg px-3 py-2 text-sm w-48" placeholder="Buscar" />
					<select value={categoryId} onChange={e => { setPage(1); setCategoryId(e.target.value) }} className="border rounded-lg px-3 py-2 text-sm">
						<option value="">Todas categorias</option>
						{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
					</select>
					<button className="bg-[var(--color-primary)] text-white rounded-lg px-3 py-2 text-sm">Novo produto</button>
				</div>
			</div>

			<div className="card overflow-hidden">
				<div className="overflow-auto">
					<table className="w-full text-sm">
						<thead>
							<tr className="text-left text-gray-500">
								<th className="py-3 px-4">Produto</th>
								<th className="py-3 px-4">Categoria</th>
								<th className="py-3 px-4">Preço</th>
								<th className="py-3 px-4">Estoque</th>
								<th className="py-3 px-4 text-right">Ações</th>
							</tr>
						</thead>
						<tbody>
							{loading && (
								<tr><td className="py-6 px-4 text-center text-gray-500" colSpan={5}>Carregando...</td></tr>
							)}
							{error && !loading && (
								<tr><td className="py-6 px-4 text-center text-red-600" colSpan={5}>{error}</td></tr>
							)}
							{!loading && !error && items.length === 0 && (
								<tr><td className="py-6 px-4 text-center text-gray-500" colSpan={5}>Nenhum produto encontrado</td></tr>
							)}
							{!loading && !error && items.map(p => (
								<tr key={p.id} className="border-t">
									<td className="py-3 px-4">{p.name}</td>
									<td className="py-3 px-4">{categories.find(c => c.id === p.categoryId)?.name || '—'}</td>
									<td className="py-3 px-4">{p.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
									<td className="py-3 px-4">{p.stockQuantity}</td>
									<td className="py-3 px-4 text-right">
										<button className="text-indigo-600 hover:underline mr-2">Editar</button>
										<button className="text-red-600 hover:underline">Excluir</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<div className="flex items-center justify-between p-3 border-t text-sm">
					<div>Mostrando {(items.length && (page - 1) * pageSize + 1) || 0} - {(page - 1) * pageSize + items.length} de {total}</div>
					<div className="flex items-center gap-2">
						<button disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="border rounded px-2 py-1 disabled:opacity-50">Anterior</button>
						<span className="min-w-10 text-center">{page}/{pages}</span>
						<button disabled={page >= pages} onClick={() => setPage(p => Math.min(pages, p + 1))} className="border rounded px-2 py-1 disabled:opacity-50">Próxima</button>
					</div>
				</div>
			</div>
		</div>
	)
}
