'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { API_BASE_URL } from '@/config/api';
import { getToken } from '@/lib/auth';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { AlertDialog } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';

interface Category {
  id: number;
  name: string;
  description?: string;
  created_at: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, categoryId: 0, isDeleting: false });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/categories/`);
        setCategories(response.data.results || response.data || []);
      } catch (err: any) {
        setError('Failed to load categories');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleDeleteClick = (id: number) => {
    setDeleteModal({ isOpen: true, categoryId: id, isDeleting: false });
  };

  const confirmDelete = async () => {
    setDeleteModal((prev) => ({ ...prev, isDeleting: true }));
    try {
      const token = getToken();
      await axios.delete(`${API_BASE_URL}/categories/${deleteModal.categoryId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(categories.filter((c) => c.id !== deleteModal.categoryId));
      setDeleteModal({ isOpen: false, categoryId: 0, isDeleting: false });
    } catch (err) {
      setError('Failed to delete category');
      setDeleteModal({ isOpen: false, categoryId: 0, isDeleting: false });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-neutral-600 font-medium">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-neutral-900">Categories</h1>
          <p className="text-neutral-600 mt-2">Organize your products by category</p>
        </div>
        <Link href="/admin/categories/new">
          <Button size="lg">
            ➕ Add Category
          </Button>
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-error/10 border border-error text-error rounded-lg">
          {error}
        </div>
      )}

      {categories.length === 0 ? (
        <Card shadow="sm">
          <CardBody>
            <EmptyState
              title="No categories yet"
              description="Create your first category to organize products"
              action={{ label: 'Add Category', onClick: () => window.location.href = '/admin/categories/new' }}
            />
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card key={category.id} hover shadow="sm">
              <CardBody>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-neutral-900">{category.name}</h3>
                    <p className="text-sm text-neutral-600 mt-1">
                      Created {new Date(category.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {category.description && (
                  <p className="text-neutral-600 mb-4 text-sm">{category.description}</p>
                )}
                <div className="flex gap-3 pt-4 border-t border-neutral-100">
                  <Link href={`/admin/categories/${category.id}/edit`} className="flex-1">
                    <Button variant="secondary" size="sm" className="w-full">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteClick(category.id)}
                    className="flex-1"
                  >
                    Delete
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={deleteModal.isOpen}
        title="Delete Category?"
        message="This action cannot be undone. The category will be permanently deleted."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        type="error"
        isLoading={deleteModal.isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, categoryId: 0, isDeleting: false })}
      />
    </div>
  );
}
