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

interface Partner {
  id: number;
  name: string;
  logo_url: string;
  is_active: boolean;
}

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    logo_url: '',
    is_active: true
  });

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const token = getAccessToken();
      const response = await axios.get(`${API_BASE_URL}/partners/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPartners(response.data.results || response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch partners:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    const token = getAccessToken();
    try {
      if (editingId) {
        await axios.patch(`${API_BASE_URL}/partners/${editingId}/`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${API_BASE_URL}/partners/`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      fetchPartners();
      closeDrawer();
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  const openDrawer = (partner?: Partner) => {
    if (partner) {
      setEditingId(partner.id);
      setFormData({
        name: partner.name,
        logo_url: partner.logo_url,
        is_active: partner.is_active
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', logo_url: '', is_active: true });
    }
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => {
      setEditingId(null);
      setFormData({ name: '', logo_url: '', is_active: true });
    }, 300);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    try {
      const token = getAccessToken();
      await axios.delete(`${API_BASE_URL}/partners/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPartners();
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  const filteredPartners = partners.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <CMSHeader
        title="Partners"
        itemCount={filteredPartners.length}
        onAddClick={() => openDrawer()}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <SlideOver
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        title={editingId ? 'Edit Partner' : 'Add Partner'}
        description={editingId ? 'Update partner details' : 'Add a new partner'}
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
            <label className="text-xs font-semibold text-slate-600 block mb-2">Partner Name *</label>
            <input
              type="text"
              placeholder="e.g., Acme Corporation"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-2">Logo URL</label>
            <input
              type="url"
              placeholder="https://example.com/logo.png"
              value={formData.logo_url}
              onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
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
      ) : filteredPartners.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200/60">
          <p className="text-slate-600">No partners found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPartners.map((partner) => (
            <ListCard key={partner.id}>
              <div className="flex items-center gap-4 p-4">
                <DragHandle />

                <div className="w-28 h-14 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center p-2 flex-shrink-0 overflow-hidden">
                  {partner.logo_url ? (
                    <img src={partner.logo_url} alt={partner.name} className="h-full object-contain" />
                  ) : (
                    <div className="text-xs font-semibold text-slate-400">Logo</div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 truncate">{partner.name}</h3>
                </div>

                <div className="flex items-center gap-4 flex-shrink-0">
                  <ToggleSwitch
                    checked={partner.is_active}
                    onChange={async (checked) => {
                      try {
                        const token = getAccessToken();
                        await axios.patch(`${API_BASE_URL}/partners/${partner.id}/`, { is_active: checked }, {
                          headers: { Authorization: `Bearer ${token}` }
                        });
                        fetchPartners();
                      } catch (error) {
                        console.error('Failed to update:', error);
                      }
                    }}
                  />
                  <CMSActionMenu
                    onEdit={() => openDrawer(partner)}
                    onDelete={() => handleDelete(partner.id)}
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
