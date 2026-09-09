'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { API_BASE_URL } from '@/config/api';
import { setTokens } from '@/lib/auth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    password_confirm: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.password_confirm) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register/`, formData);
      setTokens(response.data.access, response.data.refresh);
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.password?.[0] || err.response?.data?.email?.[0] || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar showNavLinks={true} />
      <style>{`
        .grid-pattern {
          background-image:
            linear-gradient(90deg, rgba(16, 185, 129, 0.03) 1px, transparent 1px),
            linear-gradient(rgba(16, 185, 129, 0.03) 1px, transparent 1px);
          background-size: 40px 40px;
          background-position: 0 0, 0 0;
        }
      `}</style>

      {/* Form Section */}
      <section className="py-16 lg:py-24 bg-white relative overflow-hidden grid-pattern">
        <div className="max-w-md mx-auto px-6 relative z-10">
          {/* Card */}
          <div className="group cursor-pointer relative rounded-3xl overflow-hidden border border-slate-200 hover:border-emerald-400 flex flex-col h-full hover:-translate-y-1 bg-gradient-to-br from-white to-slate-50 backdrop-blur-sm group-hover:from-emerald-50 group-hover:to-white transition-all duration-300 p-8">
            <p className="text-center text-slate-600 text-sm mb-6">
              Get 15% off your first order on eco-friendly products
            </p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                  placeholder="you@example.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                  placeholder="••••••••"
                />
                <p className="text-xs text-slate-500 mt-1">Must be at least 8 characters</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="password_confirm"
                  value={formData.password_confirm}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex items-start gap-2">
                <input type="checkbox" id="terms" className="mt-1" required />
                <label htmlFor="terms" className="text-xs text-slate-600">
                  I agree to the{' '}
                  <a href="#" className="text-emerald-600 hover:underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-emerald-600 hover:underline">
                    Privacy Policy
                  </a>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition mt-6"
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-slate-600">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-emerald-600 font-bold hover:underline">
                  Login here
                </Link>
              </p>
            </div>

            {/* Benefits */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <p className="text-xs font-semibold text-slate-700 mb-3">🎁 Sign up benefits:</p>
              <ul className="space-y-2 text-xs text-slate-600">
                <li>✅ 15% off your first order</li>
                <li>✅ Free eco-tips newsletter</li>
                <li>✅ Early access to new products</li>
                <li>✅ Exclusive member discounts</li>
              </ul>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-slate-500 mt-6">
            We respect your privacy. Your data is secure with us.
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
}
