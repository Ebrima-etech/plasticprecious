'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiFileText } from 'react-icons/fi';
import { API_BASE_URL } from '@/config/api';
import { getAccessToken } from '@/lib/auth';

export default function RFQAdmin() {
  const [rfqs, setRfqs] = useState([]);

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
    } catch (err) {
      console.error('Failed to fetch RFQs:', err);
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
      console.error('Failed to update RFQ:', err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-8">
        <FiFileText className="text-purple-600 w-8 h-8" />
        <h1 className="text-3xl font-black text-slate-900">Bulk RFQs</h1>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left font-bold">Organization</th>
              <th className="px-6 py-3 text-left font-bold">Email</th>
              <th className="px-6 py-3 text-left font-bold">Quantity</th>
              <th className="px-6 py-3 text-left font-bold">Status</th>
              <th className="px-6 py-3 text-left font-bold">Action</th>
            </tr>
          </thead>
          <tbody>
            {rfqs.map((rfq: any) => (
              <tr key={rfq.id} className="border-b hover:bg-slate-50">
                <td className="px-6 py-3 font-semibold">{rfq.organization_name}</td>
                <td className="px-6 py-3 text-sm">{rfq.contact_email}</td>
                <td className="px-6 py-3">{rfq.quantity}</td>
                <td className="px-6 py-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    rfq.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    rfq.status === 'quoted' ? 'bg-green-100 text-green-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {rfq.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-3">
                  <select value={rfq.status} onChange={(e) => updateStatus(rfq.id, e.target.value)} className="px-3 py-1 border rounded text-sm">
                    <option value="pending">Pending</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="quoted">Quoted</option>
                    <option value="closed">Closed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
