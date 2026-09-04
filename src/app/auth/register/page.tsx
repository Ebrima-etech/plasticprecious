'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { API_BASE_URL } from '@/config/api';
import { setTokens } from '@/lib/auth';

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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <h1 className="text-3xl font-bold text-green-600">♻️ Plasticprecious</h1>
          </Link>
          <p className="text-gray-600 text-lg">Join our sustainability movement</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-2 text-center text-gray-900">Create Account</h2>
          <p className="text-center text-gray-600 text-sm mb-6">
            Get 15% off your first order on eco-friendly products
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                placeholder="you@example.com"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                placeholder="••••••••"
              />
              <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="password_confirm"
                value={formData.password_confirm}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-start gap-2">
              <input type="checkbox" id="terms" className="mt-1" required />
              <label htmlFor="terms" className="text-xs text-gray-600">
                I agree to the{' '}
                <a href="#" className="text-green-600 hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-green-600 hover:underline">
                  Privacy Policy
                </a>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition mt-6"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-green-600 font-semibold hover:underline">
                Login here
              </Link>
            </p>
          </div>

          {/* Benefits */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs font-semibold text-gray-700 mb-3">🎁 Sign up benefits:</p>
            <ul className="space-y-2 text-xs text-gray-600">
              <li>✅ 15% off your first order</li>
              <li>✅ Free eco-tips newsletter</li>
              <li>✅ Early access to new products</li>
              <li>✅ Exclusive member discounts</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-6">
          We respect your privacy. Your data is secure with us.
        </p>
      </div>
    </div>
  );
}
