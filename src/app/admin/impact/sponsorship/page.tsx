'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';
import { getAccessToken } from '@/lib/auth';
import { ListCard } from '@/components/ios/ListCard';
import { CMSHeader } from '@/components/ios/CMSHeader';
import { CMSActionMenu } from '@/components/ios/CMSActionMenu';

interface Sponsorship {
  id: number;
  sponsor_name: string;
  sponsor_email: string;
  item_type: string;
  items_count: number;
  amount: string;
  created_at: string;
}

export default function SponsorshipAdmin() {
  const [sponsorships, setSponsorships] = useState<Sponsorship[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchSponsorships();
  }, []);

  const fetchSponsorships = async () => {
    try {
      const token = getAccessToken();
      const response = await axios.get(`${API_BASE_URL}/impact/sponsorship/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSponsorships(response.data.results || response.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch sponsorships:', err);
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    try {
      const token = getAccessToken();
      await axios.delete(`${API_BASE_URL}/impact/sponsorship/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchSponsorships();
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  const filteredSponsorships = sponsorships.filter(s =>
    s.sponsor_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.item_type.toLowerCase().includes(searchQuery.toLowerCase())
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
        title="Sponsorships"
        itemCount={filteredSponsorships.length}
        onAddClick={() => {}}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Sponsorships List */}
      {loading ? (
        <div className="text-center py-12"><p className="text-slate-600">Loading...</p></div>
      ) : filteredSponsorships.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200/60">
          <p className="text-slate-600">No sponsorships found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredSponsorships.map((sponsorship) => (
            <ListCard key={sponsorship.id}>
              <div className="flex items-start justify-between p-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900">{sponsorship.sponsor_name}</h3>
                  <p className="text-xs text-slate-600">{sponsorship.sponsor_email}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                      {sponsorship.item_type}
                    </span>
                    <span className="text-xs font-medium bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      {sponsorship.items_count} items
                    </span>
                  </div>
                  {sponsorship.amount && (
                    <p className="text-xs font-medium text-slate-900 mt-2">
                      Value: D {parseFloat(sponsorship.amount).toLocaleString()}
                    </p>
                  )}
                  <p className="text-xs text-slate-500 mt-2">
                    {formatDate(sponsorship.created_at)}
                  </p>
                </div>

                <div className="flex-shrink-0 ml-4">
                  <CMSActionMenu
                    onEdit={() => {}}
                    onDelete={() => handleDelete(sponsorship.id)}
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
