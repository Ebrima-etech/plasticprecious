'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { FiMapPin, FiCalendar, FiUsers, FiGift } from 'react-icons/fi';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { API_BASE_URL } from '@/config/api';

interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  spots_available: number;
  spots_filled?: number;
  description?: string;
}

export default function GetInvolvedPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  const volunteerOptions = [
    { icon: '🏖️', title: 'Beach Cleanups', desc: 'Join coastal collection drives', color: 'from-blue-600 to-cyan-600' },
    { icon: '🏭', title: 'Workshops', desc: 'Learn our recycling process', color: 'from-emerald-600 to-teal-600' },
    { icon: '📚', title: 'Education', desc: 'Teach circular economy', color: 'from-purple-600 to-pink-600' },
    { icon: '💰', title: 'Fundraising', desc: 'Support our initiatives', color: 'from-orange-600 to-amber-600' }
  ];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/impact/events/`);
        const eventList = response.data.results || response.data;
        setEvents(Array.isArray(eventList) ? eventList : []);
      } catch (error) {
        console.error('Failed to fetch events:', error);
        setDefaultEvents();
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchEvents();
  }, []);

  const setDefaultEvents = () => {
    setEvents([
      { id: 1, date: 'Sep 20', title: 'Gunjur Beach Cleanup', location: 'Gunjur Beach', spots_available: 20, spots_filled: 5 },
      { id: 2, date: 'Sep 27', title: 'School Workshop', location: 'Madina Kunkunding', spots_available: 20, spots_filled: 0 },
      { id: 3, date: 'Oct 5', title: 'Material Processing Seminar', location: 'Workshop', spots_available: 15, spots_filled: 0 }
    ]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/impact/newsletter/`, { email });
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);
      setEmail('');
    } catch (error) {
      console.error('Failed to subscribe:', error);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);
      setEmail('');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar showNavLinks={true} />

      <section className="py-16 lg:py-24 bg-gradient-to-b from-emerald-50 to-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-black text-slate-900 mb-4">Get Involved</h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Join our community-driven initiative to transform coastal waste into value
            </p>
          </div>

          {/* Ways to Help */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {volunteerOptions.map((option, idx) => (
              <div key={idx} className={`bg-gradient-to-br ${option.color} rounded-2xl p-8 text-white shadow-lg hover:shadow-xl transition`}>
                <div className="text-4xl mb-4">{option.icon}</div>
                <h3 className="text-xl font-black mb-2">{option.title}</h3>
                <p className="opacity-90 text-sm">{option.desc}</p>
              </div>
            ))}
          </div>

          {/* Upcoming Events */}
          <div className="mb-16">
            <h2 className="text-3xl font-black text-slate-900 mb-8">Upcoming Events</h2>
            <div className="space-y-4">
              {loadingEvents ? (
                <p className="text-slate-600">Loading events...</p>
              ) : events.length > 0 ? (
                events.map((event) => (
                  <div key={event.id} className="bg-white border-2 border-slate-200 rounded-2xl p-6 hover:border-emerald-400 transition">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-4">
                        <div className="bg-emerald-100 text-emerald-700 font-bold px-4 py-2 rounded-lg">
                          {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{event.title}</p>
                          <p className="text-sm text-slate-600">{event.location}</p>
                        </div>
                      </div>
                      <button className="px-6 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700">
                        Register
                      </button>
                    </div>
                    <p className="text-xs text-slate-600">{event.spots_available - (event.spots_filled || 0)} spots available</p>
                  </div>
                ))
              ) : (
                <p className="text-slate-600">No upcoming events at the moment.</p>
              )}
            </div>
          </div>

          {/* Drop-off Locations */}
          <div className="bg-slate-50 rounded-3xl p-12 border-2 border-slate-200 mb-16">
            <h2 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-3">
              <FiMapPin className="text-emerald-600" />
              Plastic Drop-off Locations
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {['Gunjur', 'Kartong', 'Sanyang'].map((location) => (
                <div key={location} className="bg-white rounded-xl p-6 border border-slate-200">
                  <p className="font-bold text-slate-900 text-lg mb-2">{location}</p>
                  <p className="text-sm text-slate-600 mb-4">Open Mon-Sat, 8am-5pm</p>
                  <button className="text-emerald-600 font-bold text-sm hover:underline">Get Directions →</button>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-12 text-white text-center mb-16">
            <h2 className="text-3xl font-black mb-4">Stay Updated</h2>
            <p className="opacity-90 mb-8 max-w-2xl mx-auto">
              Subscribe to get updates on cleanup events, new workshops, and impact reports
            </p>
            {submitted ? (
              <p className="text-lg font-bold">✓ Thanks for subscribing!</p>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 px-6 py-3 rounded-lg text-slate-900 placeholder-slate-500"
                />
                <button type="submit" className="px-8 py-3 bg-white text-emerald-600 font-bold rounded-lg hover:bg-slate-100">
                  Subscribe
                </button>
              </form>
            )}
          </div>

          {/* Sponsorship */}
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-12">
            <h2 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-3">
              <FiGift className="text-emerald-600" />
              Sponsor a Desk
            </h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-slate-600 mb-6">
                  For just $150, you can fund a complete upcycled school desk delivered to a child in a rural Gambian school. Track your impact in real-time.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Funds desk production & delivery</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Supports local jobs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Certificate of impact</span>
                  </li>
                </ul>
                <button className="px-8 py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700">
                  Sponsor Now
                </button>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-8 text-center">
                <p className="text-5xl font-black text-emerald-600 mb-4">150</p>
                <p className="text-slate-600 font-semibold">Per Desk</p>
                <div className="mt-6 space-y-2 text-sm text-slate-700">
                  <p>📦 1 School Desk</p>
                  <p>👧 1 Student Empowered</p>
                  <p>🌍 5kg Plastic Recovered</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
