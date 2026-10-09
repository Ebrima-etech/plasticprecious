'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';
import { getAccessToken } from '@/lib/auth';
import { getErrorMessage } from '@/lib/api-errors';
import { useStaffMe } from '@/lib/staffDashboard';
import { AdminTableSkeleton } from '@/components/ShimmerSkeleton';

interface BudgetRow {
  id: number;
  name: string;
  is_active: boolean;
  budget: number;
  active_staff: number;
  staff_without_salary: number;
  monthly_salaries: number;
  yearly_salaries: number;
  remaining: number;
  used_percent: number | null;
}

interface BudgetData {
  assumptions: string;
  departments: BudgetRow[];
  totals: { budget: number; monthly_salaries: number; yearly_salaries: number; remaining: number; used_percent: number | null };
}

const dalasi = (value: number) => `D ${value.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;

const barColor = (percent: number | null) =>
  percent === null ? 'bg-slate-300' : percent > 100 ? 'bg-red-500' : percent > 85 ? 'bg-amber-500' : 'bg-emerald-500';

export default function BudgetPage() {
  const me = useStaffMe();
  const canEdit = !!me && (me.is_admin || me.permissions.includes('manage_staff'));
  const [data, setData] = useState<BudgetData | null>(null);
  const [error, setError] = useState('');
  const [drafts, setDrafts] = useState<Record<number, string>>({});
  const [savingId, setSavingId] = useState<number | null>(null);

  const load = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/staff/budget/`, { headers: { Authorization: `Bearer ${getAccessToken()}` } });
      setData(res.data);
      setError('');
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to load the budget overview.'));
    }
  };

  useEffect(() => {
    load();
  }, []);

  const saveBudget = async (row: BudgetRow) => {
    const value = drafts[row.id];
    const amount = parseFloat(value);
    if (value === undefined || Number.isNaN(amount) || amount < 0) {
      alert('Enter a budget of 0 or more.');
      return;
    }
    setSavingId(row.id);
    try {
      await axios.patch(
        `${API_BASE_URL}/staff/departments/${row.id}/`,
        { budget_allocation: amount.toFixed(2) },
        { headers: { Authorization: `Bearer ${getAccessToken()}` } }
      );
      setDrafts(prev => {
        const next = { ...prev };
        delete next[row.id];
        return next;
      });
      await load();
    } catch (err) {
      alert(getErrorMessage(err, 'Failed to update the budget.'));
    } finally {
      setSavingId(null);
    }
  };

  const totals = data?.totals;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Budget</h1>
        <p className="text-sm text-slate-600 mt-1">
          Each department&apos;s yearly budget compared with what its active staff cost. {data?.assumptions}
        </p>
      </div>

      {error ? (
        <div className="px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-800">{error}</div>
      ) : !data ? (
        <AdminTableSkeleton rows={5} />
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total budget (year)', value: dalasi(totals!.budget) },
              { label: 'Salaries (year)', value: dalasi(totals!.yearly_salaries), sub: `${dalasi(totals!.monthly_salaries)} / month` },
              { label: totals!.remaining < 0 ? 'Over budget' : 'Remaining', value: dalasi(Math.abs(totals!.remaining)), warn: totals!.remaining < 0 },
              { label: 'Budget used', value: totals!.used_percent === null ? '—' : `${totals!.used_percent}%` },
            ].map(card => (
              <div key={card.label} className={`rounded-2xl p-5 border ${card.warn ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200/70'}`}>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{card.label}</p>
                <p className={`text-2xl font-bold mt-3 tabular-nums ${card.warn ? 'text-red-700' : 'text-slate-900'}`}>{card.value}</p>
                {card.sub && <p className="text-xs text-slate-500 mt-1">{card.sub}</p>}
              </div>
            ))}
          </div>

          {data.departments.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200/60 text-slate-600">
              No departments yet. <Link href="/admin/staff/departments" className="text-emerald-700 font-semibold hover:underline">Create one</Link>.
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200/70 overflow-x-auto">
              <table className="w-full text-sm min-w-[820px]">
                <thead className="bg-slate-50 text-left text-xs text-slate-500 uppercase tracking-wide">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Department</th>
                    <th className="px-4 py-3 font-semibold text-right">Staff</th>
                    <th className="px-4 py-3 font-semibold">Yearly budget</th>
                    <th className="px-4 py-3 font-semibold text-right">Salaries / year</th>
                    <th className="px-4 py-3 font-semibold text-right">Remaining</th>
                    <th className="px-4 py-3 font-semibold w-48">Used</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.departments.map(row => {
                    const draft = drafts[row.id];
                    const changed = draft !== undefined && parseFloat(draft) !== row.budget;
                    return (
                      <tr key={row.id} className={row.is_active ? '' : 'opacity-60'}>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-slate-900">{row.name}</p>
                          {row.staff_without_salary > 0 && (
                            <p className="text-xs text-amber-700">{row.staff_without_salary} staff without a salary set</p>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums">{row.active_staff}</td>
                        <td className="px-4 py-3">
                          {canEdit ? (
                            <div className="flex items-center gap-2">
                              <span className="text-slate-500">D</span>
                              <input
                                type="number"
                                min={0}
                                step="0.01"
                                value={draft ?? String(row.budget)}
                                onChange={(e) => setDrafts({ ...drafts, [row.id]: e.target.value })}
                                className="w-32 px-2 py-1.5 rounded-lg border border-slate-200 text-right tabular-nums"
                                aria-label={`Yearly budget for ${row.name}`}
                              />
                              <button
                                onClick={() => saveBudget(row)}
                                disabled={!changed || savingId === row.id}
                                className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold disabled:opacity-30"
                              >
                                Save
                              </button>
                            </div>
                          ) : (
                            <span className="tabular-nums">{dalasi(row.budget)}</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums">
                          {dalasi(row.yearly_salaries)}
                          <span className="block text-xs text-slate-500">{dalasi(row.monthly_salaries)} / month</span>
                        </td>
                        <td className={`px-4 py-3 text-right tabular-nums font-semibold ${row.remaining < 0 ? 'text-red-600' : 'text-slate-900'}`}>
                          {row.remaining < 0 ? `−${dalasi(Math.abs(row.remaining))}` : dalasi(row.remaining)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                              <div className={`h-full rounded-full ${barColor(row.used_percent)}`} style={{ width: `${Math.min(100, row.used_percent ?? 0)}%` }} />
                            </div>
                            <span className="text-xs tabular-nums text-slate-600 w-12 text-right">
                              {row.used_percent === null ? 'No budget' : `${row.used_percent}%`}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          <p className="text-xs text-slate-500">
            Salaries come from each staff member&apos;s record in Staff. Inactive staff aren&apos;t counted.
          </p>
        </>
      )}
    </div>
  );
}
