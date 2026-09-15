'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiDownload, FiSearch, FiUsers } from 'react-icons/fi';
import { API_BASE_URL } from '@/config/api';
import { getAccessToken } from '@/lib/auth';

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

interface Event {
  id: number;
  title: string;
  date: string;
  registrations: Registration[];
}

export default function RegistrationsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const token = getAccessToken();
      const eventsRes = await axios.get(`${API_BASE_URL}/impact/events/`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const eventsList = eventsRes.data.results || eventsRes.data;

      // Fetch registrations for each event
      const eventsWithRegistrations = await Promise.all(
        eventsList.map(async (event: any) => {
          try {
            const regsRes = await axios.get(
              `${API_BASE_URL}/impact/events/${event.id}/registrations/`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            return {
              ...event,
              registrations: regsRes.data.results || regsRes.data || []
            };
          } catch {
            return { ...event, registrations: [] };
          }
        })
      );

      setEvents(eventsWithRegistrations);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch registrations:', err);
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Event,Name,Email,Phone,Why Join,Confirmed,Date\n';

    events.forEach(event => {
      event.registrations.forEach(reg => {
        const row = [
          event.title,
          reg.name,
          reg.email,
          reg.phone,
          `"${reg.why_join.replace(/"/g, '""')}"`,
          reg.is_confirmed ? 'Yes' : 'No',
          new Date(reg.registered_at).toLocaleDateString()
        ].join(',');
        csvContent += row + '\n';
      });
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `registrations-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredEvents = events.map(event => ({
    ...event,
    registrations: event.registrations.filter(reg =>
      reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.phone.includes(searchTerm)
    )
  })).filter(event => selectedEvent === null || event.id === selectedEvent);

  const totalRegistrations = filteredEvents.reduce((sum, e) => sum + e.registrations.length, 0);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-8">
        <FiUsers className="text-emerald-600 w-8 h-8" />
        <h1 className="text-3xl font-black text-slate-900">Event Registrations</h1>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border-2 border-slate-200 p-6">
          <p className="text-sm text-slate-600 font-semibold">Total Events</p>
          <p className="text-3xl font-black text-emerald-600">{events.length}</p>
        </div>
        <div className="bg-white rounded-lg border-2 border-slate-200 p-6">
          <p className="text-sm text-slate-600 font-semibold">Total Registrations</p>
          <p className="text-3xl font-black text-emerald-600">{events.reduce((sum, e) => sum + e.registrations.length, 0)}</p>
        </div>
        <div className="bg-white rounded-lg border-2 border-slate-200 p-6">
          <p className="text-sm text-slate-600 font-semibold">Filtered Results</p>
          <p className="text-3xl font-black text-emerald-600">{totalRegistrations}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-4 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border-2 border-slate-200 rounded-lg focus:border-emerald-500 focus:outline-none"
          />
        </div>
        <select
          value={selectedEvent || ''}
          onChange={(e) => setSelectedEvent(e.target.value ? parseInt(e.target.value) : null)}
          className="px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-emerald-500 focus:outline-none"
        >
          <option value="">All Events</option>
          {events.map(event => (
            <option key={event.id} value={event.id}>{event.title}</option>
          ))}
        </select>
        <button
          onClick={exportToCSV}
          className="px-6 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition flex items-center gap-2"
        >
          <FiDownload size={18} />
          Export CSV
        </button>
      </div>

      {/* Registrations Table */}
      {loading ? (
        <p className="text-center text-slate-600">Loading registrations...</p>
      ) : filteredEvents.length > 0 ? (
        <div className="space-y-8">
          {filteredEvents.map(event => (
            <div key={event.id}>
              <h2 className="text-xl font-bold text-slate-900 mb-4">{event.title}</h2>
              {event.registrations.length > 0 ? (
                <div className="overflow-x-auto border-2 border-slate-200 rounded-lg">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left font-bold text-slate-900">Name</th>
                        <th className="px-6 py-3 text-left font-bold text-slate-900">Email</th>
                        <th className="px-6 py-3 text-left font-bold text-slate-900">Phone</th>
                        <th className="px-6 py-3 text-left font-bold text-slate-900">Why Join</th>
                        <th className="px-6 py-3 text-left font-bold text-slate-900">Status</th>
                        <th className="px-6 py-3 text-left font-bold text-slate-900">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {event.registrations.map(reg => (
                        <tr key={reg.id} className="border-b hover:bg-slate-50">
                          <td className="px-6 py-3 text-slate-900 font-semibold">{reg.name}</td>
                          <td className="px-6 py-3 text-slate-600">{reg.email}</td>
                          <td className="px-6 py-3 text-slate-600">{reg.phone}</td>
                          <td className="px-6 py-3 text-slate-600 max-w-xs truncate">{reg.why_join}</td>
                          <td className="px-6 py-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              reg.is_confirmed
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {reg.is_confirmed ? 'Confirmed' : 'Pending'}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-slate-600 text-sm">
                            {new Date(reg.registered_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-slate-600">No registrations for this event.</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-slate-600">No registrations found.</p>
      )}
    </div>
  );
}
