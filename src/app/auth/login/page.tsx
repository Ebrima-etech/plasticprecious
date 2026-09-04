'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { API_BASE_URL } from '@/config/api';
import { setTokens } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login/`, {
        email,
        password,
      });

      setTokens(response.data.access, response.data.refresh);
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
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
          <p className="text-gray-600 text-lg">Welcome back</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">Login to Your Account</h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Password
                </label>
                <a href="#" className="text-xs text-green-600 hover:underline">
                  Forgot password?
                </a>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition mt-6"
            >
              {loading ? 'Logging in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link href="/auth/register" className="text-green-600 font-semibold hover:underline">
                Sign up here
              </Link>
            </p>
          </div>

          {/* Info Box */}
          <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-xs text-gray-600">
              <strong>Demo Mode:</strong> Use any email and password to test the platform. Your account will be automatically created.
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-6">
          Your privacy is important to us. Login is secure and encrypted.
        </p>
      </div>
    </div>
  );
}
