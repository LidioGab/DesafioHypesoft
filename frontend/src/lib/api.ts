// Simple API client for our backend
export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export type Categoria = {
  id: string;
  name: string;
  description?: string;
}

export type Produto = {
  id: string;
  name: string;
  description?: string;
  price: number;
  categoryId: string;
  stockQuantity: number;
  createdAt?: string;
}

export type Paged<T> = {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status} - ${text}`);
  }
  return res.json();
}

export const api = {
  // Produtos
  listProducts: (q?: { page?: number; pageSize?: number; search?: string; categoryId?: string; }) => {
    const params = new URLSearchParams();
    if (q?.page) params.set('page', String(q.page));
    if (q?.pageSize) params.set('pageSize', String(q.pageSize));
    if (q?.search) params.set('search', q.search);
    if (q?.categoryId) params.set('categoryId', q.categoryId);
    const qs = params.toString();
    return request<Paged<Produto>>(`/api/products${qs ? `?${qs}` : ''}`);
  },
  getProduct: (id: string) => request<Produto>(`/api/products/${id}`),
  createProduct: (data: Partial<Produto>) => request<Produto>(`/api/products`, { method: 'POST', body: JSON.stringify(data) }),
  updateProduct: (id: string, data: Partial<Produto>) => request<void>(`/api/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProduct: (id: string) => request<void>(`/api/products/${id}`, { method: 'DELETE' }),

  // Categorias
  listCategories: () => request<Categoria[]>(`/api/categories`),

  // Dashboard
  getDashboard: () => request<{ totalProducts: number; totalInventoryValue: number; lowStockCount: number; productsByCategory: { categoryId: string; count: number; }[] }>(`/api/dashboard`),
};
