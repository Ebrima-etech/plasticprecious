'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';
import { getAccessToken } from '@/lib/auth';
import { ListCard } from '@/components/ios/ListCard';
import { DragHandle } from '@/components/ios/DragHandle';
import { CMSHeader } from '@/components/ios/CMSHeader';
import { CMSActionMenu } from '@/components/ios/CMSActionMenu';
import { MultiStepForm } from '@/components/ios/MultiStepForm';

interface ImpactMetric {
  id: number;
  label: string;
  value: string;
  description: string;
}

const FORM_STEPS = [
  { id: 'info', title: 'Metric Info', description: 'Label and value' },
  { id: 'details', title: 'Details', description: 'Description' }
];

export default function ImpactMetricsAdmin() {
  const [metrics, setMetrics] = useState<ImpactMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ label: '', value: '', description: '' });

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const token = getAccessToken();
      const response = await axios.get(`${API_BASE_URL}/impact/metrics/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMetrics(response.data.results || response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const token = getAccessToken();
    try {
      if (editingId) {
        await axios.patch(`${API_BASE_URL}/impact/metrics/${editingId}/`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${API_BASE_URL}/impact/metrics/`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      fetchMetrics();
      closeForm();
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const openForm = (metric?: ImpactMetric) => {
    if (metric) {
      setEditingId(metric.id);
      setFormData({ label: metric.label, value: metric.value, description: metric.description });
    } else {
      setEditingId(null);
      setFormData({ label: '', value: '', description: '' });
    }
    setCurrentStep(0);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setTimeout(() => {
      setEditingId(null);
      setFormData({ label: '', value: '', description: '' });
      setCurrentStep(0);
    }, 300);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    try {
      const token = getAccessToken();
      await axios.delete(`${API_BASE_URL}/impact/metrics/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMetrics();
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  const filteredMetrics = metrics.filter(m =>
    m.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <CMSHeader
        title="Impact Metrics"
        itemCount={filteredMetrics.length}
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
                  <label className="text-xs font-semibold text-slate-600 block mb-2">Metric Label *</label>
                  <input
                    type="text"
                    placeholder="e.g., Plastic Recycled"
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-2">Value *</label>
                  <input
                    type="text"
                    placeholder="e.g., 500"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
                    required
                  />
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-2">Description</label>
                  <textarea
                    placeholder="What does this metric measure?"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition resize-none h-24"
                  />
                </div>
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-20 h-16 rounded-xl bg-white border border-emerald-100 flex flex-col items-center justify-center flex-shrink-0">
                      <div className="text-xl font-bold text-emerald-800">{formData.value}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-emerald-900">{formData.label || 'Metric'}</p>
                      <p className="text-xs text-emerald-700 line-clamp-1 mt-1">{formData.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </MultiStepForm>
        </div>
      )}

      {/* Metrics List */}
      {loading ? (
        <div className="text-center py-12"><p className="text-slate-600">Loading...</p></div>
      ) : filteredMetrics.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200/60">
          <p className="text-slate-600">No impact metrics found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMetrics.map((metric) => (
            <ListCard key={metric.id}>
              <div className="flex items-center gap-4 p-4">
                <DragHandle />

                <div className="w-20 h-16 rounded-xl bg-emerald-50 border border-emerald-100 flex flex-col items-center justify-center flex-shrink-0">
                  <div className="text-xl font-bold text-emerald-800">{metric.value}</div>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 truncate">{metric.label}</h3>
                  <p className="text-xs text-slate-600 line-clamp-1 mt-1">{metric.description}</p>
                </div>

                <div className="flex-shrink-0">
                  <CMSActionMenu
                    onEdit={() => openForm(metric)}
                    onDelete={() => handleDelete(metric.id)}
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
