'use client';

import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { API_BASE_URL } from '@/config/api';
import { getToken } from '@/lib/auth';
import { AdminTableSkeleton } from '@/components/ShimmerSkeleton';
import { ActionMenu } from '@/components/admin/ActionMenu';
import { formatCurrency, getStockStatus } from '@/lib/format-utils';
import { FiSearch, FiImage, FiEye, FiEdit2, FiTrash2, FiCopy } from 'react-icons/fi';
import { HiOutlineShoppingBag } from 'react-icons/hi2';

interface Product {
  id: number;
  name: string;
  price: string;
  stock: number;
  category: number | string;
  category_name?: string;
  is_active: boolean;
  created_at: string;
  image?: string;
  images_count?: number;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, productId: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken();
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch all products (handle pagination)
        let allProducts: Product[] = [];
        let nextUrl = `${API_BASE_URL}/products/?limit=1000&offset=0`;
        while (nextUrl) {
          const productsRes = await axios.get(nextUrl);
          const pageProducts = productsRes.data.results || productsRes.data || [];
          if (!Array.isArray(pageProducts)) {
            break;
          }
          allProducts = [...allProducts, ...pageProducts];
          nextUrl = productsRes.data.next || null;

          if (!nextUrl && productsRes.data.results && productsRes.data.count > allProducts.length) {
            const nextOffset = allProducts.length;
            nextUrl = `${API_BASE_URL}/products/?limit=1000&offset=${nextOffset}`;
          }
        }
        setProducts(allProducts);

        // Fetch all categories (handle pagination)
        try {
          let allCategories: { id: number; name: string }[] = [];
          let catNextUrl = `${API_BASE_URL}/categories/?limit=1000&offset=0`;
          while (catNextUrl) {
            const categoriesRes = await axios.get(catNextUrl, { headers });
            const pageCategories = categoriesRes.data.results || categoriesRes.data || [];
            if (!Array.isArray(pageCategories)) {
              break;
            }
            allCategories = [...allCategories, ...pageCategories];
            catNextUrl = categoriesRes.data.next || null;

            if (!catNextUrl && categoriesRes.data.results && categoriesRes.data.count > allCategories.length) {
              const nextOffset = allCategories.length;
              catNextUrl = `${API_BASE_URL}/categories/?limit=1000&offset=${nextOffset}`;
            }
          }
          setCategories(allCategories);
        } catch {
          // Categories fetch failed, continue without them
        }
      } catch (err: any) {
        setError('Failed to load products');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const token = getToken();
        await axios.delete(`${API_BASE_URL}/products/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(products.filter((p) => p.id !== id));
      } catch (err) {
        setError('Failed to delete product');
      }
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.category_name && product.category_name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStock = stockFilter === 'all' ||
      (stockFilter === 'in-stock' && product.stock > 0) ||
      (stockFilter === 'low-stock' && product.stock > 0 && product.stock <= 10) ||
      (stockFilter === 'out-of-stock' && product.stock === 0);

    const matchesCategory = categoryFilter === 'all' || product.category === parseInt(categoryFilter);

    return matchesSearch && matchesStock && matchesCategory;
  });

  const debouncedSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="w-32 h-8 bg-gray-200 rounded shimmer-loading mb-2"></div>
            <div className="w-48 h-4 bg-gray-200 rounded shimmer-loading"></div>
          </div>
          <div className="w-40 h-10 bg-gray-200 rounded shimmer-loading"></div>
        </div>
        <div className="flex gap-3">
          <div className="flex-1 h-10 bg-gray-200 rounded shimmer-loading"></div>
          <div className="w-40 h-10 bg-gray-200 rounded shimmer-loading"></div>
          <div className="w-40 h-10 bg-gray-200 rounded shimmer-loading"></div>
        </div>
        <AdminTableSkeleton rows={8} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <HiOutlineShoppingBag className="text-emerald-600 w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Products</h1>
              <p className="text-sm text-slate-600 mt-0.5">{filteredProducts.length} products available</p>
            </div>
          </div>
        </div>
        <Link href="/admin/products/new">
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-4 rounded-lg transition text-sm shadow-sm">
            + Add Product
          </button>
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium">
          {error}
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search name, category, SKU..."
            value={searchQuery}
            onChange={(e) => debouncedSearch(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
          <FiSearch className="absolute right-3 top-2.5 w-5 h-5 text-slate-400" />
        </div>

        <select
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        >
          <option value="all">All Stock</option>
          <option value="in-stock">In Stock</option>
          <option value="low-stock">Low Stock</option>
          <option value="out-of-stock">Out of Stock</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
          <p className="text-slate-600 font-medium">No products found</p>
          <p className="text-sm text-slate-500 mt-1">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50/50 border-b border-slate-200/80 h-12">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-900 uppercase tracking-wide">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-900 uppercase tracking-wide">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-900 uppercase tracking-wide">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-900 uppercase tracking-wide">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-900 uppercase tracking-wide">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-900 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredProducts.map((product) => {
                  const stockStatus = getStockStatus(product.stock);
                  return (
                    <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0 border border-slate-200 overflow-hidden">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            ) : (
                              <FiImage className="w-6 h-6 text-slate-400" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate">{product.name}</p>
                            {product.images_count && (
                              <p className="text-xs text-slate-500 mt-0.5">{product.images_count} photos</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{product.category_name || '—'}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-900 font-tabular-nums">{formatCurrency(product.price)}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${stockStatus.color}`}>
                          {stockStatus.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                          Published
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <ActionMenu
                          actions={[
                            { label: 'View', icon: <FiEye className="w-4 h-4" />, onClick: () => {} },
                            { label: 'Edit', icon: <FiEdit2 className="w-4 h-4" />, onClick: () => window.location.href = `/admin/products/${product.id}/edit` },
                            { label: 'Duplicate', icon: <FiCopy className="w-4 h-4" />, onClick: () => {} },
                            { label: 'Delete', icon: <FiTrash2 className="w-4 h-4" />, variant: 'danger', onClick: () => handleDelete(product.id) }
                          ]}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
