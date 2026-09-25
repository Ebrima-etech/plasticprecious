'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import { HiOutlineEllipsisVertical, HiOutlineEye, HiOutlineEyeSlash } from 'react-icons/hi2';
import { API_BASE_URL } from '@/config/api';
import { getAccessToken } from '@/lib/auth';
import { ListCard } from '@/components/ios/ListCard';
import { DragHandle } from '@/components/ios/DragHandle';
import { ToggleSwitch } from '@/components/ios/ToggleSwitch';

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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Hero Slides</h1>
          <p className="text-sm text-slate-600 mt-1">{slides.length} slides</p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setFormData({ title: '', description: '', image_url: '', slide_type: 'main', order: 0, is_active: true });
          }}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-4 py-2 font-medium shadow-sm transition-all"
        >
          <FiPlus className="w-5 h-5" />
          Add Slide
        </button>
      </div>

      {/* Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 flex items-end md:items-center justify-end md:justify-center">
          <div className="bg-white w-full max-w-md rounded-t-2xl md:rounded-2xl shadow-2xl animate-in slide-in-from-right-full md:zoom-in-95 duration-300">
            <div className="flex items-center justify-between p-6 border-b border-slate-200/80">
              <h2 className="text-xl font-semibold text-slate-900">{editingId ? 'Edit Slide' : 'New Slide'}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-slate-100 rounded-full transition">
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-2">Title *</label>
                <input
                  type="text"
                  placeholder="Slide headline"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-2">Description</label>
                <textarea
                  placeholder="Slide description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition resize-none h-24"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-2">Image URL *</label>
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-2">Type</label>
                <select
                  value={formData.slide_type}
                  onChange={(e) => setFormData({ ...formData, slide_type: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
                >
                  <option value="main">Main Heading</option>
                  <option value="description">Description</option>
                </select>
              </div>
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <label className="text-sm font-medium text-slate-900">Publish</label>
                <ToggleSwitch
                  checked={formData.is_active}
                  onChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
              </div>
              <div className="flex gap-3 pt-6 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-3 text-slate-700 font-medium rounded-xl hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition"
                >
                  {editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Slides List */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-slate-600">Loading slides...</p>
        </div>
      ) : slides.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200/60">
          <p className="text-slate-600">No slides yet. Create your first slide to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {slides.map((slide) => (
            <ListCard key={slide.id}>
              <div className="flex items-center gap-4 p-4">
                {/* Drag Handle */}
                <DragHandle />

                {/* Thumbnail */}
                <div className="w-28 h-16 rounded-xl bg-slate-100 border border-slate-200/50 flex-shrink-0 overflow-hidden">
                  {slide.image_url ? (
                    <img
                      src={slide.image_url}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <span className="text-xs">No image</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 truncate">{slide.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-1">{slide.description || 'No description'}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      {slide.slide_type === 'main' ? 'Main' : 'Description'}
                    </span>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex items-center gap-4 flex-shrink-0">
                  <ToggleSwitch
                    checked={slide.is_active}
                    onChange={async (checked) => {
                      try {
                        const token = getAccessToken();
                        await axios.patch(`${API_BASE_URL}/hero-slides/${slide.id}/`, { is_active: checked }, {
                          headers: { Authorization: `Bearer ${token}` }
                        });
                        fetchSlides();
                      } catch (error) {
                        console.error('Failed to update slide:', error);
                      }
                    }}
                  />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(slide)}
                      className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                      title="Edit"
                    >
                      <FiEdit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(slide.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Delete"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </ListCard>
          ))}
        </div>
      )}
    </div>
  );
}
