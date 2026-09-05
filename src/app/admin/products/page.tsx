'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { API_BASE_URL } from '@/config/api';
import { getToken } from '@/lib/auth';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { AlertDialog } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';

interface Product {
  id: number;
  name: string;
  price: string;
  stock: number;
  category: number;
  is_active: boolean;
  created_at: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, productId: 0, isDeleting: false });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = getToken();
        const response = await axios.get(`${API_BASE_URL}/products/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(response.data.results || response.data || []);
      } catch (err: any) {
        setError('Failed to load products');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDeleteClick = (id: number) => {
    setDeleteModal({ isOpen: true, productId: id, isDeleting: false });
  };

  const confirmDelete = async () => {
    setDeleteModal((prev) => ({ ...prev, isDeleting: true }));
    try {
      const token = getToken();
      await axios.delete(`${API_BASE_URL}/products/${deleteModal.productId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.filter((p) => p.id !== deleteModal.productId));
      setDeleteModal({ isOpen: false, productId: 0, isDeleting: false });
    } catch (err) {
      setError('Failed to delete product');
      setDeleteModal({ isOpen: false, productId: 0, isDeleting: false });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-neutral-600 font-medium">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-neutral-900">Products</h1>
          <p className="text-neutral-600 mt-2">Manage your product catalog</p>
        </div>
        <Link href="/admin/products/new">
          <Button size="lg">
            ➕ Add Product
          </Button>
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-error/10 border border-error text-error rounded-lg">
          {error}
        </div>
      )}

      {products.length === 0 ? (
        <Card shadow="sm">
          <CardBody>
            <EmptyState
              title="No products yet"
              description="Create your first product to get started"
              action={{ label: 'Add Product', onClick: () => window.location.href = '/admin/products/new' }}
            />
          </CardBody>
        </Card>
      ) : (
        <Card shadow="base">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Price</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Stock</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4 text-neutral-900 font-medium">{product.name}</td>
                    <td className="px-6 py-4 text-neutral-600">
                      D {parseFloat(product.price).toLocaleString('en-GM')}
                    </td>
                    <td className="px-6 py-4 text-neutral-600">{product.stock} units</td>
                    <td className="px-6 py-4">
                      <Badge variant={product.is_active ? 'success' : 'neutral'} size="sm">
                        {product.is_active ? '✓ Active' : '○ Inactive'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        <Link href={`/admin/products/${product.id}/edit`}>
                          <Button variant="secondary" size="sm">
                            Edit
                          </Button>
                        </Link>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteClick(product.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={deleteModal.isOpen}
        title="Delete Product?"
        message="This action cannot be undone. The product will be permanently deleted."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        type="error"
        isLoading={deleteModal.isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, productId: 0, isDeleting: false })}
      />
    </div>
  );
}
