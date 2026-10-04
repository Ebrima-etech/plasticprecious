'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';
import { getAccessToken } from '@/lib/auth';
import DashboardLoader from '@/components/staff-dashboard/DashboardLoader';
import { HiOutlineBuildingOffice2, HiOutlineUser } from 'react-icons/hi2';

interface Department {
  id: number;
  name: string;
  staff_count?: number;
  is_active: boolean;
}

interface StaffMember {
  id: number;
  user_data?: { first_name: string; last_name: string; email: string };
  role_display: string;
  department_name: string;
  is_active: boolean;
}

type Selection = { type: 'department' | 'staff'; id: number } | null;

export default function TeamDashboardsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [tab, setTab] = useState<'department' | 'staff'>('department');
  const [selection, setSelection] = useState<Selection>(null);

  useEffect(() => {
    const headers = { Authorization: `Bearer ${getAccessToken()}` };
    Promise.all([
      axios.get(`${API_BASE_URL}/staff/departments/`, { headers, params: { page_size: 200 } }),
      axios.get(`${API_BASE_URL}/staff/staff/`, { headers, params: { page_size: 500 } }),
    ])
      .then(([deptRes, staffRes]) => {
        const depts: Department[] = deptRes.data.results || deptRes.data;
        setDepartments(depts);
        setStaff(staffRes.data.results || staffRes.data);
        if (depts.length) setSelection({ type: 'department', id: depts[0].id });
      })
      .catch(err => console.error('Failed to load departments/staff:', err));
  }, []);

  const staffName = (s: StaffMember) => `${s.user_data?.first_name ?? ''} ${s.user_data?.last_name ?? ''}`.trim() || s.user_data?.email || `Staff #${s.id}`;
  const items = tab === 'department'
    ? departments.map(d => ({ id: d.id, label: d.name, sub: `${d.staff_count ?? 0} staff${d.is_active ? '' : ' · inactive'}` }))
    : staff.map(s => ({ id: s.id, label: staffName(s), sub: `${s.role_display} · ${s.department_name}${s.is_active ? '' : ' · inactive'}` }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Team Dashboards</h1>
        <p className="text-sm text-slate-600 mt-1">
          See exactly what each department and staff member sees on their dashboard. Sections come from the permissions set in Staff.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="lg:col-span-1 space-y-3">
          <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-slate-100">
            {(['department', 'staff'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-semibold transition ${tab === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}
              >
                {t === 'department' ? <HiOutlineBuildingOffice2 className="w-4 h-4" /> : <HiOutlineUser className="w-4 h-4" />}
                {t === 'department' ? 'Departments' : 'Staff'}
              </button>
            ))}
          </div>
          <div className="bg-white rounded-2xl border border-slate-200/70 divide-y divide-slate-100 max-h-[70vh] overflow-y-auto">
            {items.length === 0 ? (
              <p className="p-4 text-sm text-slate-500">{tab === 'department' ? 'No departments yet.' : 'No staff members yet.'}</p>
            ) : (
              items.map(item => {
                const active = selection?.type === tab && selection.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelection({ type: tab, id: item.id })}
                    className={`w-full text-left px-4 py-3 transition ${active ? 'bg-emerald-50' : 'hover:bg-slate-50'}`}
                  >
                    <span className={`block text-sm font-semibold ${active ? 'text-emerald-800' : 'text-slate-900'}`}>{item.label}</span>
                    <span className="block text-xs text-slate-500">{item.sub}</span>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        <div className="lg:col-span-3">
          {selection ? (
            <DashboardLoader
              key={`${selection.type}-${selection.id}`}
              params={{ [selection.type]: selection.id }}
              greeting={(data) => data.viewing.name}
              subtitle={(data) =>
                data.viewing.type === 'department'
                  ? `Department dashboard · combines what its ${data.department?.member_count ?? 0} active members can see`
                  : `${data.viewing.role ?? ''} · what this person sees when they sign in`
              }
            />
          ) : (
            <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-200/60 text-slate-600">
              Choose a department or staff member.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
