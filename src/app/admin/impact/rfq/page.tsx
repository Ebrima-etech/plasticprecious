'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';
import { getAccessToken } from '@/lib/auth';
import { ListCard } from '@/components/ios/ListCard';
import { CMSHeader } from '@/components/ios/CMSHeader';
import { CMSActionMenu } from '@/components/ios/CMSActionMenu';

interface RFQ {
  id: number;
  requester_name: string;
  requester_company: string;
  category: string;
  budget: number | null;
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
    r.requester_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'approved':
        return 'bg-emerald-100 text-emerald-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
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
        <div className="text-center py-12"><p className="text-slate-600">Loading...</p></div>
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
                  <h3 className="font-semibold text-slate-900">{rfq.requester_name}</h3>
                  <p className="text-xs text-slate-600">{rfq.requester_company}</p>
                  <p className="text-xs text-slate-600 mt-1">{rfq.category}</p>
                  {rfq.budget && (
                    <p className="text-xs font-medium text-slate-900 mt-2">
                      Budget: D {rfq.budget.toLocaleString()}
                    </p>
                  )}
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
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
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
