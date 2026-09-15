'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { FiMapPin, FiCalendar, FiUsers, FiGift, FiWave, FiZap, FiBook, FiTrendingUp } from 'react-icons/fi';
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
    {
      icon: FiWave,
      title: 'Beach Cleanups',
      desc: 'Join coastal collection drives',
      color: 'from-blue-500 to-cyan-600',
      darkColor: 'dark:from-blue-600 dark:to-cyan-700'
    },
    {
      icon: FiZap,
      title: 'Workshops',
      desc: 'Learn our recycling process',
      color: 'from-emerald-500 to-teal-600',
      darkColor: 'dark:from-emerald-600 dark:to-teal-700'
    },
    {
      icon: FiBook,
      title: 'Education',
      desc: 'Teach circular economy',
      color: 'from-purple-500 to-pink-600',
      darkColor: 'dark:from-purple-600 dark:to-pink-700'
    },
    {
      icon: FiTrendingUp,
      title: 'Fundraising',
      desc: 'Support our initiatives',
      color: 'from-orange-500 to-amber-600',
      darkColor: 'dark:from-orange-600 dark:to-amber-700'
    }
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
            {volunteerOptions.map((option, idx) => {
              const IconComponent = option.icon;
              return (
                <div
                  key={idx}
                  className={`bg-gradient-to-br ${option.color} rounded-3xl p-8 text-white shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer group relative overflow-hidden`}
                >
                  {/* Animated background accent */}
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white/30 transition-all duration-300">
                      <IconComponent size={32} className="text-white" />
                    </div>

                    {/* Text */}
                    <h3 className="text-2xl font-black mb-3 group-hover:translate-x-1 transition-transform duration-300">{option.title}</h3>
                    <p className="opacity-95 text-sm leading-relaxed font-medium">{option.desc}</p>

                    {/* Arrow indicator */}
                    <div className="mt-4 inline-block opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-2 transition-all duration-300">
                      <span className="text-lg font-bold">→</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Upcoming Events */}
          <div className="mb-16">
            <h2 className="text-3xl font-black text-slate-900 mb-8">Upcoming Events</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loadingEvents ? (
                <p className="text-slate-600">Loading events...</p>
              ) : events.length > 0 ? (
                events.map((event) => {
                  const spotsFilled = event.spots_filled || 0;
                  const spotsAvailable = event.spots_available || 1;
                  const spotsRemaining = spotsAvailable - spotsFilled;
                  const fillPercentage = (spotsFilled / spotsAvailable) * 100;
                  return (
                    <div key={event.id} className="bg-white border-2 border-slate-200 rounded-2xl overflow-hidden hover:shadow-2xl hover:border-emerald-400 transition-all duration-300">
                      {/* Header with Date Badge */}
                      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-6 relative">
                        <div className="absolute top-4 right-4 bg-white text-emerald-600 font-bold px-4 py-2 rounded-lg text-sm">
                          <FiCalendar className="inline mr-2" size={16} />
                          {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                        <h3 className="text-xl font-black text-white pr-24">{event.title}</h3>
                      </div>

                      {/* Body */}
                      <div className="p-6">
                        {/* Location */}
                        <div className="flex items-center gap-2 mb-4 text-slate-700">
                          <FiMapPin size={18} className="text-emerald-600" />
                          <p className="font-semibold">{event.location}</p>
                        </div>

                        {/* Spots Available */}
                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <p className="text-sm font-bold text-slate-700">Spots Remaining</p>
                            <p className="text-sm font-bold text-emerald-600">{spotsRemaining} of {spotsAvailable}</p>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full transition-all duration-300"
                              style={{ width: `${fillPercentage}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Description if available */}
                        {event.description && (
                          <p className="text-sm text-slate-600 mb-4 line-clamp-2">{event.description}</p>
                        )}

                        {/* CTA Button */}
                        <button className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 flex items-center justify-center gap-2">
                          <FiUsers size={18} />
                          Join Event
                        </button>
                      </div>
                    </div>
                  );
                })
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
