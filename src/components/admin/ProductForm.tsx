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
import { AdminFormSkeleton } from '@/components/ShimmerSkeleton';

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
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
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
            setImagePreviews([prodRes.data.image]);
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

  const [dragActive, setDragActive] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    if (name === 'image' && type === 'file') {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        handleFilesSelected(Array.from(files));
      }
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? (e.target as any).checked : value,
      });
    }
  };

  const handleFilesSelected = (newFiles: File[]) => {
    setImageFiles(newFiles);

    const previews: string[] = [];
    let loadedCount = 0;

    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        previews.push(reader.result as string);
        loadedCount++;
        if (loadedCount === newFiles.length) {
          setImagePreviews(previews);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFilesSelected(Array.from(files).filter(f => f.type.startsWith('image/')));
    }
  };

  const removeImage = (idx: number) => {
    setImageFiles(imageFiles.filter((_, i) => i !== idx));
    setImagePreviews(imagePreviews.filter((_, i) => i !== idx));
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

      if (imageFiles.length > 0) {
        submitFormData.append('image', imageFiles[0]);
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
    return <AdminFormSkeleton />;
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
            <label className="block text-sm font-medium text-neutral-700 mb-3">
              Product Images
            </label>

            {/* Drag & Drop Area */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative w-full px-6 py-8 border-2 border-dashed rounded-lg transition-all duration-200 ${
                dragActive
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-neutral-300 bg-neutral-50 hover:border-primary-400'
              }`}
            >
              <input
                type="file"
                name="image"
                accept="image/*"
                multiple
                onChange={handleChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />

              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-neutral-400 mb-2" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h24a4 4 0 004-4V20m-8-12l-3.172-3.172a2 2 0 00-2.828 0L28 8m0 0l8 8m-8-8v20" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="text-sm font-medium text-neutral-900">
                  Drag and drop images here, or click to select
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  PNG, JPG, GIF up to 10MB each
                </p>
              </div>
            </div>

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-neutral-900">
                    Selected Images ({imagePreviews.length})
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setImageFiles([]);
                      setImagePreviews([]);
                    }}
                    className="text-xs text-red-600 hover:text-red-700 font-medium"
                  >
                    Clear All
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {imagePreviews.map((preview, idx) => (
                    <div key={idx} className="group relative rounded-lg overflow-hidden border border-neutral-200 bg-neutral-50">
                      {/* Image */}
                      <img
                        src={preview}
                        alt={`Preview ${idx + 1}`}
                        className="w-full h-24 object-cover"
                      />

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="flex items-center justify-center w-7 h-7 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs transition"
                          title="Remove image"
                        >
                          ×
                        </button>
                      </div>

                      {/* Badge */}
                      <div className="absolute top-1 right-1 bg-primary-600 text-white text-xs font-semibold px-2 py-1 rounded">
                        {idx + 1}
                      </div>

                      {/* File Info */}
                      <div className="text-xs text-neutral-600 px-2 py-1 bg-neutral-50 border-t border-neutral-200 truncate">
                        {imageFiles[idx]?.name || `Image ${idx + 1}`}
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-neutral-500 mt-2">
                  💡 Tip: The first image will be used as the primary product image
                </p>
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
