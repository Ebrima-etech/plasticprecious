'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';
import { getToken } from '@/lib/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardBody, CardHeader, CardFooter } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';

interface ProductFormProps {
  productId?: number;
}

interface Category {
  id: number;
  name: string;
}

export default function ProductForm({ productId }: ProductFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    is_active: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLoadingForm, setIsLoadingForm] = useState(!!productId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken();
        if (!token) {
          setError('Not authenticated. Please login first.');
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };

        try {
          const catRes = await axios.get(`${API_BASE_URL}/categories/`, { headers });
          setCategories(catRes.data.results || catRes.data || []);
        } catch (err: any) {
          if (err.response?.status === 401) {
            setError('Session expired. Please login again.');
            return;
          }
          console.error('Failed to fetch categories:', err);
        }

        if (productId) {
          const prodRes = await axios.get(`${API_BASE_URL}/products/${productId}/`, { headers });
          setFormData({
            name: prodRes.data.name,
            description: prodRes.data.description,
            price: prodRes.data.price,
            stock: prodRes.data.stock,
            category: prodRes.data.category,
            is_active: prodRes.data.is_active,
          });
          if (prodRes.data.image) {
            setImagePreview(prodRes.data.image);
          }
        }
      } catch (err) {
        setError('Failed to load form data');
        console.error(err);
      } finally {
        setIsLoadingForm(false);
      }
    };

    fetchData();
  }, [productId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    if (name === 'image' && type === 'file') {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? (e.target as any).checked : value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = getToken();
      const headers = { Authorization: `Bearer ${token}` };

      const submitFormData = new FormData();
      submitFormData.append('name', formData.name);
      submitFormData.append('description', formData.description);
      submitFormData.append('price', formData.price);
      submitFormData.append('stock', formData.stock);
      submitFormData.append('category', formData.category);
      submitFormData.append('is_active', String(formData.is_active));

      if (imageFile) {
        submitFormData.append('image', imageFile);
      }

      if (productId) {
        await axios.put(`${API_BASE_URL}/products/${productId}/`, submitFormData, {
          headers: { ...headers, 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await axios.post(`${API_BASE_URL}/products/`, submitFormData, {
          headers: { ...headers, 'Content-Type': 'multipart/form-data' },
        });
      }

      router.push('/admin/products');
    } catch (err: any) {
      const errorData = err.response?.data;
      if (typeof errorData === 'object' && errorData !== null) {
        const errorMessages = Object.entries(errorData)
          .map(([key, value]) => `${key}: ${value}`)
          .join(', ');
        setError(errorMessages || 'Failed to save product');
      } else {
        setError(errorData?.detail || errorData?.error || 'Failed to save product');
      }
    } finally {
      setLoading(false);
    }
  };

  if (isLoadingForm) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      <Card shadow="base">
        <CardHeader className="border-b border-neutral-100">
          <h1 className="text-2xl font-bold text-neutral-900">
            {productId ? 'Edit Product' : 'Add New Product'}
          </h1>
        </CardHeader>

        <CardBody className="space-y-6">
          {error && (
            <div className="p-4 bg-error/10 border border-error text-error rounded-lg text-sm">
              {error}
            </div>
          )}

          <Input
            label="Product Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="e.g., Recycled Plastic Chair"
          />

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-2.5 border border-neutral-200 rounded-md font-normal text-neutral-900 placeholder-neutral-400 transition-all duration-normal focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Product description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price (D)"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              required
              step="0.01"
              placeholder="0.00"
            />

            <Input
              label="Stock"
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleChange}
              required
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-neutral-200 rounded-md font-normal text-neutral-900 transition-all duration-normal focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Product Image
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-neutral-200 rounded-md font-normal text-neutral-900 transition-all duration-normal focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            {imagePreview && (
              <div className="mt-4">
                <p className="text-sm font-medium text-neutral-700 mb-2">Preview:</p>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-w-xs h-auto rounded-lg border border-neutral-200"
                />
              </div>
            )}
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="w-4 h-4 text-primary-600 rounded border-neutral-200"
            />
            <span className="text-neutral-900 font-medium">Active (visible to customers)</span>
          </label>
        </CardBody>

        <CardFooter className="flex gap-3">
          <Button
            type="submit"
            size="lg"
            isLoading={loading}
            className="flex-1"
          >
            {productId ? 'Update Product' : 'Create Product'}
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
