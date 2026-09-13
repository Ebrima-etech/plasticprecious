'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiGift } from 'react-icons/fi';
import { API_BASE_URL } from '@/config/api';
import { getAccessToken } from '@/lib/auth';

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

  useEffect(function fetchData() {
    fetchSponsorships();
  }, []);

  async function fetchSponsorships() {
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
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-8">
        <FiGift className="text-pink-600 w-8 h-8" />
        <h1 className="text-3xl font-black text-slate-900">Sponsorships</h1>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-emerald-50 rounded-lg p-6 border border-emerald-200">
          <p className="text-sm text-emerald-600 font-bold">Total Sponsorships</p>
          <p className="text-3xl font-black text-emerald-700 mt-2">{sponsorships.length}</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
          <p className="text-sm text-blue-600 font-bold">Total Desks</p>
          <p className="text-3xl font-black text-blue-700 mt-2">{sponsorships.reduce(function(sum, s) { return sum + s.items_count; }, 0)}</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
          <p className="text-sm text-purple-600 font-bold">Total Revenue</p>
          <p className="text-3xl font-black text-purple-700 mt-2">D {sponsorships.reduce(function(sum, s) { return sum + parseFloat(s.amount); }, 0).toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left font-bold">Sponsor</th>
              <th className="px-6 py-3 text-left font-bold">Email</th>
              <th className="px-6 py-3 text-left font-bold">Item</th>
              <th className="px-6 py-3 text-left font-bold">Qty</th>
              <th className="px-6 py-3 text-left font-bold">Amount</th>
              <th className="px-6 py-3 text-left font-bold">Date</th>
            </tr>
          </thead>
          <tbody>
            {sponsorships.map(function(sponsor) {
              return (
                <tr key={sponsor.id} className="border-b hover:bg-slate-50">
                  <td className="px-6 py-3 font-semibold">{sponsor.sponsor_name}</td>
                  <td className="px-6 py-3 text-sm">{sponsor.sponsor_email}</td>
                  <td className="px-6 py-3">{sponsor.item_type}</td>
                  <td className="px-6 py-3">{sponsor.items_count}</td>
                  <td className="px-6 py-3 font-bold">D {sponsor.amount}</td>
                  <td className="px-6 py-3 text-sm text-slate-600">{new Date(sponsor.created_at).toLocaleDateString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
