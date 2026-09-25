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

interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  description: string;
  spots_available: number;
  is_published: boolean;
}

const FORM_STEPS = [
  { id: 'details', title: 'Event Details', description: 'Title, date, and location' },
  { id: 'settings', title: 'Settings', description: 'Capacity and visibility' }
];

export default function EventsAdmin() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    description: '',
    spots_available: 20,
    is_published: true
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const token = getAccessToken();
      const response = await axios.get(`${API_BASE_URL}/impact/events/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvents(response.data.results || response.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch events:', err);
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const token = getAccessToken();
    try {
      if (editingId) {
        await axios.patch(`${API_BASE_URL}/impact/events/${editingId}/`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${API_BASE_URL}/impact/events/`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      fetchEvents();
      closeForm();
    } catch (err) {
      console.error('Failed to save event:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const openForm = (event?: Event) => {
    if (event) {
      setEditingId(event.id);
      setFormData({
        title: event.title,
        date: event.date,
        location: event.location,
        description: event.description,
        spots_available: event.spots_available,
        is_published: event.is_published
      });
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        date: '',
        location: '',
        description: '',
        spots_available: 20,
        is_published: true
      });
    }
    setCurrentStep(0);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setTimeout(() => {
      setEditingId(null);
      setFormData({
        title: '',
        date: '',
        location: '',
        description: '',
        spots_available: 20,
        is_published: true
      });
      setCurrentStep(0);
    }, 300);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    try {
      const token = getAccessToken();
      await axios.delete(`${API_BASE_URL}/impact/events/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchEvents();
    } catch (err) {
      console.error('Failed to delete event:', err);
    }
  };

  const filteredEvents = events.filter(e =>
    e.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getMonthDay = (dateStr: string) => {
    if (!dateStr) return { month: '—', date: '—' };
    const d = new Date(dateStr);
    return {
      month: d.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
      date: d.getDate()
    };
  };

  return (
    <div className="space-y-6">
      <CMSHeader
        title="Events"
        itemCount={filteredEvents.length}
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
                  <label className="text-xs font-semibold text-slate-600 block mb-2">Event Title *</label>
                  <input
                    type="text"
                    placeholder="e.g., Recycling Workshop"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-2">Date *</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-2">Location *</label>
                    <input
                      type="text"
                      placeholder="e.g., Downtown Hall"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-2">Description</label>
                  <textarea
                    placeholder="Event description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition resize-none h-20"
                  />
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-2">Available Spots</label>
                  <input
                    type="number"
                    placeholder="e.g., 50"
                    value={formData.spots_available}
                    onChange={(e) => setFormData({ ...formData, spots_available: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
                  />
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                  <label className="text-sm font-medium text-slate-900">Published</label>
                  <ToggleSwitch
                    checked={formData.is_published}
                    onChange={(checked) => setFormData({ ...formData, is_published: checked })}
                  />
                </div>
                <div className="p-4 bg-slate-100 border border-slate-200 rounded-xl">
                  <p className="text-xs text-slate-600 mb-3">Preview:</p>
                  <div className="flex items-center gap-3">
                    {formData.date && (
                      <div className="w-14 h-16 rounded-xl bg-white border border-slate-200 flex flex-col items-center justify-center flex-shrink-0">
                        <div className="text-xs font-bold text-slate-700">{getMonthDay(formData.date).month}</div>
                        <div className="text-lg font-bold text-slate-900">{getMonthDay(formData.date).date}</div>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900">{formData.title || 'Event'}</p>
                      <p className="text-xs text-slate-600">{formData.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </MultiStepForm>
        </div>
      )}

      {/* Events List */}
      {loading ? (
        <div className="text-center py-12"><p className="text-slate-600">Loading...</p></div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200/60">
          <p className="text-slate-600">No events found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredEvents.map((event) => (
            <ListCard key={event.id}>
              <div className="flex items-center gap-4 p-4">
                <DragHandle />

                {(() => {
                  const md = getMonthDay(event.date);
                  return (
                    <div className="w-14 h-16 rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center flex-shrink-0">
                      <div className="text-xs font-bold text-red-600">{md.month}</div>
                      <div className="text-lg font-bold text-slate-900">{md.date}</div>
                    </div>
                  );
                })()}

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 truncate">{event.title}</h3>
                  <p className="text-xs text-slate-600 mt-1">{event.location}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                      {event.spots_available} spots
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 flex-shrink-0">
                  <ToggleSwitch
                    checked={event.is_published}
                    onChange={async (checked) => {
                      try {
                        const token = getAccessToken();
                        await axios.patch(`${API_BASE_URL}/impact/events/${event.id}/`, { is_published: checked }, {
                          headers: { Authorization: `Bearer ${token}` }
                        });
                        fetchEvents();
                      } catch (error) {
                        console.error('Failed to update:', error);
                      }
                    }}
                  />
                  <CMSActionMenu
                    onEdit={() => openForm(event)}
                    onDelete={() => handleDelete(event.id)}
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
