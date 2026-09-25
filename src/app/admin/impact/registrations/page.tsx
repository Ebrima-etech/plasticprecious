'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';
import { getAccessToken } from '@/lib/auth';
import { ListCard } from '@/components/ios/ListCard';
import { ToggleSwitch } from '@/components/ios/ToggleSwitch';
import { CMSHeader } from '@/components/ios/CMSHeader';
import { CMSActionMenu } from '@/components/ios/CMSActionMenu';

interface Registration {
  id: number;
  name: string;
  email: string;
  phone: string;
  why_join: string;
  is_confirmed: boolean;
  registered_at: string;
  event?: {
    id: number;
    title: string;
    date: string;
  };
}

export default function RegistrationsAdmin() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const token = getAccessToken();
      const response = await axios.get(`${API_BASE_URL}/impact/registrations/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRegistrations(response.data.results || response.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch registrations:', err);
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    try {
      const token = getAccessToken();
      await axios.delete(`${API_BASE_URL}/impact/registrations/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchRegistrations();
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  const handleToggleConfirm = async (id: number, confirmed: boolean) => {
    try {
      const token = getAccessToken();
      await axios.patch(`${API_BASE_URL}/impact/registrations/${id}/`, { is_confirmed: confirmed }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchRegistrations();
    } catch (err) {
      console.error('Failed to update:', err);
    }
  };

  const filteredRegistrations = registrations.filter(r =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <CMSHeader
        title="Event Registrations"
        itemCount={filteredRegistrations.length}
        onAddClick={() => {}}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Registrations List */}
      {loading ? (
        <div className="text-center py-12"><p className="text-slate-600">Loading...</p></div>
      ) : filteredRegistrations.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200/60">
          <p className="text-slate-600">No registrations found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRegistrations.map((reg) => (
            <ListCard key={reg.id}>
              <div className="flex items-start justify-between p-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900">{reg.name}</h3>
                  <p className="text-xs text-slate-600 mt-1">{reg.email}</p>
                  <p className="text-xs text-slate-600">{reg.phone}</p>
                  {reg.why_join && (
                    <p className="text-xs text-slate-600 mt-2 italic">"{reg.why_join}"</p>
                  )}
                  <div className="flex gap-2 mt-3">
                    <span className="text-xs font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                      {formatDate(reg.registered_at)}
                    </span>
                    {reg.event && (
                      <span className="text-xs font-medium bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                        {reg.event.title}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                  <ToggleSwitch
                    checked={reg.is_confirmed}
                    onChange={(checked) => handleToggleConfirm(reg.id, checked)}
                  />
                  <CMSActionMenu
                    onEdit={() => {}}
                    onDelete={() => handleDelete(reg.id)}
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
