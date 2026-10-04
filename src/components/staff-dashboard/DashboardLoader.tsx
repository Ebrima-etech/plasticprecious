'use client';

import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';
import { getAccessToken } from '@/lib/auth';
import { getErrorMessage } from '@/lib/api-errors';
import { AdminDashboardSkeleton } from '@/components/ShimmerSkeleton';
import { DashboardData } from '@/lib/staffDashboard';
import StaffDashboard from './StaffDashboard';

interface DashboardLoaderProps {
  // Admin previews: show a department's or a staff member's dashboard
  params?: { department?: number | string; staff?: number | string };
  greeting?: (data: DashboardData) => string | undefined;
  subtitle?: (data: DashboardData) => string | undefined;
}

export default function DashboardLoader({ params, greeting, subtitle }: DashboardLoaderProps) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState('');
  const paramKey = JSON.stringify(params || {});

  const load = useCallback(async () => {
    setError('');
    try {
      const res = await axios.get(`${API_BASE_URL}/staff/dashboard/`, {
        headers: { Authorization: `Bearer ${getAccessToken()}` },
        params: JSON.parse(paramKey),
      });
      setData(res.data);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to load the dashboard.'));
    }
  }, [paramKey]);

  useEffect(() => {
    setData(null);
    load();
  }, [load]);

  if (error) {
    return <div className="px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-800">{error}</div>;
  }
  if (!data) return <AdminDashboardSkeleton />;

  return <StaffDashboard data={data} onChanged={load} greeting={greeting?.(data)} subtitle={subtitle?.(data)} />;
}
