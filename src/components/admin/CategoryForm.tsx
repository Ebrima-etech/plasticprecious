'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';
import { getToken } from '@/lib/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardBody, CardHeader, CardFooter } from '@/components/ui/Card';

interface CategoryFormProps {
  categoryId?: number;
}

export default function CategoryForm({ categoryId }: CategoryFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (categoryId) {
      const fetchCategory = async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/categories/${categoryId}/`);
          setFormData({ name: response.data.name });
        } catch (err) {
          setError('Failed to load category');
        }
      };
      fetchCategory();
    }
  }, [categoryId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ name: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = getToken();
      const headers = { Authorization: `Bearer ${token}` };

      if (categoryId) {
        await axios.put(`${API_BASE_URL}/categories/${categoryId}/`, formData, { headers });
      } else {
        await axios.post(`${API_BASE_URL}/categories/`, formData, { headers });
      }

      router.push('/admin/categories');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      <Card shadow="base">
        <CardHeader className="border-b border-neutral-100">
          <h1 className="text-2xl font-bold text-neutral-900">
            {categoryId ? 'Edit Category' : 'Add New Category'}
          </h1>
        </CardHeader>

        <CardBody className="space-y-6">
          {error && (
            <div className="p-4 bg-error/10 border border-error text-error rounded-lg text-sm">
              {error}
            </div>
          )}

          <Input
            label="Category Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="e.g., Recycled Plastic Containers"
          />
        </CardBody>

        <CardFooter className="flex gap-3">
          <Button
            type="submit"
            size="lg"
            isLoading={loading}
            className="flex-1"
          >
            {categoryId ? 'Update Category' : 'Create Category'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={() => router.back()}
            className="flex-1"
          >
            Cancel
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
