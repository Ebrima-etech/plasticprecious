'use client';
import { ListCardGridSkeleton } from '@/components/ShimmerSkeleton';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';
import { getAccessToken } from '@/lib/auth';
import { ListCard } from '@/components/ios/ListCard';
import { CMSHeader } from '@/components/ios/CMSHeader';
import { CMSActionMenu } from '@/components/ios/CMSActionMenu';

interface RFQ {
  id: number;
  contact_person_name: string;
  organization_name: string;
  contact_email: string;
  contact_phone: string;
  product_category: string;
  quantity: number;
  custom_requirements: string;
  status: string;
  created_at: string;
}

export default function RFQAdmin() {
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchRFQs();
  }, []);

  const fetchRFQs = async () => {
    try {
      const token = getAccessToken();
      const response = await axios.get(`${API_BASE_URL}/impact/rfq/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRfqs(response.data.results || response.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch RFQs:', err);
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      const token = getAccessToken();
      await axios.patch(`${API_BASE_URL}/impact/rfq/${id}/`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchRFQs();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    try {
      const token = getAccessToken();
      await axios.delete(`${API_BASE_URL}/impact/rfq/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchRFQs();
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  const filteredRfqs = rfqs.filter(r =>
    (r.contact_person_name?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
    (r.organization_name?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
    (r.product_category?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
    (r.contact_email?.toLowerCase().includes(searchQuery.toLowerCase()) || false)
  );

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800';
      case 'quoted':
        return 'bg-emerald-100 text-emerald-800';
      case 'closed':
        return 'bg-slate-100 text-slate-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      <CMSHeader
        title="RFQs"
        itemCount={filteredRfqs.length}
        onAddClick={() => {}}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* RFQs List */}
      {loading ? (
        <ListCardGridSkeleton count={5} />
      ) : filteredRfqs.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200/60">
          <p className="text-slate-600">No RFQs found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRfqs.map((rfq) => (
            <ListCard key={rfq.id}>
              <div className="flex items-start justify-between p-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded">
                      RFQ #{rfq.id}
                    </span>
                  </div>
                  <h3 className="font-semibold text-slate-900">{rfq.contact_person_name}</h3>
                  <p className="text-xs text-slate-600">{rfq.organization_name}</p>
                  <p className="text-xs text-slate-600">{rfq.contact_email}</p>
                  <p className="text-xs text-slate-600">{rfq.contact_phone}</p>
                  <p className="text-xs text-slate-600 mt-1">Category: {rfq.product_category}</p>
                  <p className="text-xs font-medium text-slate-900 mt-2">
                    Quantity: {rfq.quantity} units
                  </p>
                  <p className="text-xs text-slate-500 mt-2">
                    {new Date(rfq.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                  <select
                    value={rfq.status}
                    onChange={(e) => updateStatus(rfq.id, e.target.value)}
                    className={`text-xs font-semibold px-3 py-1 rounded-full border-0 cursor-pointer transition ${getStatusColor(rfq.status)}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="quoted">Quoted</option>
                    <option value="closed">Closed</option>
                  </select>
                  <CMSActionMenu
                    onEdit={() => {}}
                    onDelete={() => handleDelete(rfq.id)}
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
