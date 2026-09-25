'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';
import { getAccessToken } from '@/lib/auth';
import { ListCard } from '@/components/ios/ListCard';
import { DragHandle } from '@/components/ios/DragHandle';
import { ToggleSwitch } from '@/components/ios/ToggleSwitch';
import { CMSHeader } from '@/components/ios/CMSHeader';
import { CMSActionMenu } from '@/components/ios/CMSActionMenu';
import { MultiStepForm } from '@/components/ios/MultiStepForm';

interface HeroSlide {
  id: number;
  title: string;
  description: string;
  image_url: string;
  slide_type: string;
  is_active: boolean;
}

const FORM_STEPS = [
  { id: 'basic', title: 'Basic Info', description: 'Title and description' },
  { id: 'media', title: 'Media', description: 'Upload slide image' },
  { id: 'settings', title: 'Settings', description: 'Visibility and type' }
];

export default function HeroSlidesPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    slide_type: 'hero',
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

  const handleSubmit = async () => {
    setSubmitting(true);
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
      closeForm();
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const openForm = (slide?: HeroSlide) => {
    if (slide) {
      setEditingId(slide.id);
      setFormData({
        title: slide.title,
        description: slide.description,
        image_url: slide.image_url,
        slide_type: slide.slide_type,
        is_active: slide.is_active
      });
    } else {
      setEditingId(null);
      setFormData({ title: '', description: '', image_url: '', slide_type: 'hero', is_active: true });
    }
    setCurrentStep(0);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setTimeout(() => {
      setEditingId(null);
      setFormData({ title: '', description: '', image_url: '', slide_type: 'hero', is_active: true });
      setCurrentStep(0);
    }, 300);
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
      console.error('Failed to delete:', error);
    }
  };

  const filteredSlides = slides.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <CMSHeader
        title="Hero Slides"
        itemCount={filteredSlides.length}
        onAddClick={() => openForm()}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Inline Multi-Step Form */}
      {isFormOpen && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
          <MultiStepForm
            steps={FORM_STEPS}
            currentStep={currentStep}
            onStepChange={setCurrentStep}
            onSubmit={handleSubmit}
            onCancel={closeForm}
            submitLabel={editingId ? 'Update' : 'Create'}
            loading={submitting}
          >
            {currentStep === 0 && (
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-2">Title *</label>
                  <input
                    type="text"
                    placeholder="e.g., Transform Your Waste"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-2">Description</label>
                  <textarea
                    placeholder="Slide description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition resize-none h-24"
                  />
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-2">Image URL</label>
                  <input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
                  />
                </div>
                {formData.image_url && (
                  <div className="relative w-36 h-20 rounded-xl overflow-hidden border border-slate-200 flex-shrink-0">
                    <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-2">Slide Type</label>
                  <select
                    value={formData.slide_type}
                    onChange={(e) => setFormData({ ...formData, slide_type: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
                  >
                    <option value="hero">Hero</option>
                    <option value="promo">Promotional</option>
                    <option value="featured">Featured</option>
                  </select>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                  <label className="text-sm font-medium text-slate-900">Active</label>
                  <ToggleSwitch
                    checked={formData.is_active}
                    onChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                </div>
              </div>
            )}
          </MultiStepForm>
        </div>
      )}

      {/* Slides List */}
      {loading ? (
        <div className="text-center py-12"><p className="text-slate-600">Loading...</p></div>
      ) : filteredSlides.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200/60">
          <p className="text-slate-600">No hero slides found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredSlides.map((slide) => (
            <ListCard key={slide.id}>
              <div className="flex items-center gap-4 p-4">
                <DragHandle />

                <div className="w-36 h-20 rounded-xl border border-slate-200 flex-shrink-0 overflow-hidden bg-slate-100">
                  {slide.image_url ? (
                    <img src={slide.image_url} alt={slide.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      No image
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 truncate">{slide.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-1 mt-1">{slide.description}</p>
                  <span className="inline-block text-xs font-medium bg-slate-100 text-slate-700 px-2 py-1 rounded-full mt-2">
                    {slide.slide_type}
                  </span>
                </div>

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
                        console.error('Failed to update:', error);
                      }
                    }}
                  />
                  <CMSActionMenu
                    onEdit={() => openForm(slide)}
                    onDelete={() => handleDelete(slide.id)}
                  />
                </div>
              </div>
            </ListCard>
          ))}
        </div>
      )}
    </div>
  );
}
