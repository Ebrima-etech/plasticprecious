'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';
import { getAccessToken } from '@/lib/auth';
import { SlideOver } from '@/components/admin/SlideOver';
import { ListCard } from '@/components/ios/ListCard';
import { DragHandle } from '@/components/ios/DragHandle';
import { ToggleSwitch } from '@/components/ios/ToggleSwitch';
import { CMSHeader } from '@/components/ios/CMSHeader';
import { CMSActionMenu } from '@/components/ios/CMSActionMenu';

interface Service {
  id: number;
  name: string;
  description: string;
  icon: string;
  is_active: boolean;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '📦',
    is_active: true
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const token = getAccessToken();
      const response = await axios.get(`${API_BASE_URL}/services/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setServices(response.data.results || response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch services:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    const token = getAccessToken();
    try {
      if (editingId) {
        await axios.patch(`${API_BASE_URL}/services/${editingId}/`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${API_BASE_URL}/services/`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      fetchServices();
      closeDrawer();
    } catch (error) {
      console.error('Failed to save service:', error);
    }
  };

  const openDrawer = (service?: Service) => {
    if (service) {
      setEditingId(service.id);
      setFormData({
        name: service.name,
        description: service.description,
        icon: service.icon,
        is_active: service.is_active
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', description: '', icon: '📦', is_active: true });
    }
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => {
      setEditingId(null);
      setFormData({ name: '', description: '', icon: '📦', is_active: true });
    }, 300);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    try {
      const token = getAccessToken();
      await axios.delete(`${API_BASE_URL}/services/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchServices();
    } catch (error) {
      console.error('Failed to delete service:', error);
    }
  };

  const filteredServices = services.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <CMSHeader
        title="Services"
        itemCount={filteredServices.length}
        onAddClick={() => openDrawer()}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <SlideOver
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        title={editingId ? 'Edit Service' : 'New Service'}
        description={editingId ? 'Update service details' : 'Create a new service'}
        footer={
          <>
            <button onClick={closeDrawer} className="px-6 py-2 text-slate-700 font-medium hover:bg-slate-200 rounded-lg transition">
              Cancel
            </button>
            <button onClick={handleSubmit} className="px-6 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition">
              {editingId ? 'Update' : 'Create'}
            </button>
          </>
        }
      >
        <div className="space-y-6">
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-2">Service Name *</label>
            <input
              type="text"
              placeholder="e.g., Consulting"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-2">Description</label>
            <textarea
              placeholder="Describe this service"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition resize-none h-24"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-2">Icon</label>
            <input
              type="text"
              placeholder="e.g., 🔧"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition text-2xl"
            />
          </div>
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <label className="text-sm font-medium text-slate-900">Active</label>
            <ToggleSwitch
              checked={formData.is_active}
              onChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
          </div>
        </div>
      </SlideOver>

      {loading ? (
        <div className="text-center py-12"><p className="text-slate-600">Loading...</p></div>
      ) : filteredServices.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200/60">
          <p className="text-slate-600">No services found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredServices.map((service) => (
            <ListCard key={service.id}>
              <div className="flex items-center gap-4 p-4">
                <DragHandle />
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-lg flex-shrink-0">
                  {service.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 truncate">{service.name}</h3>
                  <p className="text-xs text-slate-600 line-clamp-1 mt-1">{service.description}</p>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <ToggleSwitch
                    checked={service.is_active}
                    onChange={async (checked) => {
                      try {
                        const token = getAccessToken();
                        await axios.patch(`${API_BASE_URL}/services/${service.id}/`, { is_active: checked }, {
                          headers: { Authorization: `Bearer ${token}` }
                        });
                        fetchServices();
                      } catch (error) {
                        console.error('Failed to update:', error);
                      }
                    }}
                  />
                  <CMSActionMenu
                    onEdit={() => openDrawer(service)}
                    onDelete={() => handleDelete(service.id)}
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
