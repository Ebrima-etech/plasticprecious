'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import { API_BASE_URL } from '@/config/api';
import { getAccessToken } from '@/lib/auth';

interface HeroSlide {
  id: number;
  title: string;
  description: string;
  image_url: string;
  slide_type: string;
  order: number;
  is_active: boolean;
}

export default function HeroSlidesPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    slide_type: 'main',
    order: 0,
    is_active: true
  });

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const token = getAccessToken();
      const response = await axios.get(`${API_BASE_URL}/hero-slides/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSlides(response.data.results || response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch hero slides:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getAccessToken();

    try {
      if (editingId) {
        await axios.patch(`${API_BASE_URL}/hero-slides/${editingId}/`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${API_BASE_URL}/hero-slides/`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      fetchSlides();
      setShowForm(false);
      setEditingId(null);
      setFormData({ title: '', description: '', image_url: '', slide_type: 'main', order: 0, is_active: true });
    } catch (error) {
      console.error('Failed to save hero slide:', error);
    }
  };

  const handleEdit = (slide: HeroSlide) => {
    setFormData({
      title: slide.title,
      description: slide.description,
      image_url: slide.image_url,
      slide_type: slide.slide_type,
      order: slide.order,
      is_active: slide.is_active
    });
    setEditingId(slide.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    try {
      const token = getAccessToken();
      await axios.delete(`${API_BASE_URL}/hero-slides/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchSlides();
    } catch (error) {
      console.error('Failed to delete hero slide:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-slate-900">Hero Slides</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setFormData({ title: '', description: '', image_url: '', slide_type: 'main', order: 0, is_active: true });
          }}
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
        >
          <FiPlus /> Add Slide
        </button>
      </div>

      {showForm && (
        <div className="bg-white border-2 border-slate-200 rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-bold">{editingId ? 'Edit' : 'Add'} Hero Slide</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
            <input
              type="url"
              placeholder="Image URL"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
            <select
              value={formData.slide_type}
              onChange={(e) => setFormData({ ...formData, slide_type: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="main">Main Heading Slide</option>
              <option value="description">Description Slide</option>
            </select>
            <input
              type="number"
              placeholder="Order"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border rounded-lg"
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              />
              <span>Active</span>
            </label>
            <div className="flex gap-2">
              <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700">
                Save
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-slate-300 text-slate-900 px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-2">
          {slides.map((slide) => (
            <div key={slide.id} className="bg-white border-2 border-slate-200 rounded-lg p-4 flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-bold text-slate-900">{slide.title}</h3>
                <p className="text-sm text-slate-600">{slide.slide_type} • Order: {slide.order}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(slide)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <FiEdit2 />
                </button>
                <button
                  onClick={() => handleDelete(slide.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
