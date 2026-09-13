'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiCalendar } from 'react-icons/fi';
import { API_BASE_URL } from '@/config/api';
import { getAccessToken } from '@/lib/auth';

export default function EventsAdmin() {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({ title: '', date: '', location: '', description: '', spots_available: 20 });

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
    } catch (err) {
      console.error('Failed to fetch events:', err);
    }
  };

  const handleSave = async () => {
    try {
      const token = getAccessToken();
      await axios.post(`${API_BASE_URL}/impact/events/`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormData({ title: '', date: '', location: '', description: '', spots_available: 20 });
      fetchEvents();
    } catch (err) {
      console.error('Failed to save event:', err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-8">
        <FiCalendar className="text-blue-600 w-8 h-8" />
        <h1 className="text-3xl font-black text-slate-900">Manage Events</h1>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <h2 className="font-bold text-slate-900 mb-4">Add New Event</h2>
        <div className="space-y-4">
          <input type="text" placeholder="Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
          <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
          <input type="text" placeholder="Location" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
          <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 border rounded-lg h-24" />
          <button onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg">Add Event</button>
        </div>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left font-bold">Event</th>
              <th className="px-6 py-3 text-left font-bold">Date</th>
              <th className="px-6 py-3 text-left font-bold">Location</th>
              <th className="px-6 py-3 text-left font-bold">Spots</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event: any) => (
              <tr key={event.id} className="border-b hover:bg-slate-50">
                <td className="px-6 py-3 font-semibold">{event.title}</td>
                <td className="px-6 py-3">{event.date}</td>
                <td className="px-6 py-3">{event.location}</td>
                <td className="px-6 py-3">{event.spots_available - event.spots_filled}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
