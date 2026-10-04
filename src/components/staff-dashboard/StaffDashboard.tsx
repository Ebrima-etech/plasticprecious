'use client';

import { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';
import { getAccessToken } from '@/lib/auth';
import { getErrorMessage } from '@/lib/api-errors';
import { formatKg, formatAmount } from '@/lib/impact';
import { DashboardData, DashboardOrder, StockItem, dalasi } from '@/lib/staffDashboard';
import {
  HiOutlineTruck, HiOutlineShoppingCart, HiOutlineCurrencyDollar, HiOutlineCreditCard, HiOutlineCube,
  HiOutlineUsers, HiOutlineSparkles, HiOutlineUserGroup, HiOutlineBuildingOffice2, HiOutlinePhone, HiOutlineMapPin,
} from 'react-icons/hi2';

const authHeaders = () => ({ headers: { Authorization: `Bearer ${getAccessToken()}` } });

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700',
  payment_pending: 'bg-orange-50 text-orange-700',
  processing: 'bg-sky-50 text-sky-700',
  shipped: 'bg-violet-50 text-violet-700',
  delivered: 'bg-emerald-50 text-emerald-700',
  cancelled: 'bg-slate-100 text-slate-600',
};

const ORDER_STATUSES = [
  ['pending', 'Pending'], ['payment_pending', 'Payment Pending'], ['processing', 'Processing'],
  ['shipped', 'Shipped'], ['delivered', 'Delivered'], ['cancelled', 'Cancelled'],
] as const;

function Section({ icon: Icon, title, children, action }: { icon: React.ElementType; title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <section className="bg-white rounded-2xl border border-slate-200/70 p-6">
      <div className="flex items-center justify-between gap-3 mb-5">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900 uppercase tracking-wide">
          <Icon className="w-5 h-5 text-emerald-600" /> {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function Stat({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-xl bg-slate-50 border border-slate-200/70 px-4 py-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-xl font-bold text-slate-900 tabular-nums">{value}</p>
      {sub && <p className="text-[11px] text-slate-500 mt-0.5">{sub}</p>}
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-slate-500 py-4 text-center">{children}</p>;
}

function StatusPill({ order }: { order: DashboardOrder }) {
  return (
    <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLES[order.status] || STATUS_STYLES.cancelled}`}>
      {order.status_label}
    </span>
  );
}

function StockRow({ item, onSave, busy }: { item: StockItem; onSave: (id: number, stock: number) => void; busy: boolean }) {
  const [value, setValue] = useState(String(item.stock));
  const changed = value !== String(item.stock) && value !== '';
  return (
    <div className="flex items-center justify-between gap-3 py-2.5">
      <Link href={`/shop/${item.id}`} className="text-sm font-medium text-slate-800 hover:text-emerald-700 truncate">{item.name}</Link>
      <div className="flex items-center gap-2 flex-shrink-0">
        <input
          type="number"
          min={0}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-20 px-2 py-1.5 rounded-lg border border-slate-200 text-sm text-right"
          aria-label={`Stock for ${item.name}`}
        />
        <button
          onClick={() => onSave(item.id, parseInt(value, 10))}
          disabled={!changed || busy}
          className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold disabled:opacity-30"
        >
          Save
        </button>
      </div>
    </div>
  );
}

interface StaffDashboardProps {
  data: DashboardData;
  onChanged: () => void;
  greeting?: string;
  subtitle?: string;
}

export default function StaffDashboard({ data, onChanged, greeting, subtitle }: StaffDashboardProps) {
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);
  const { sections, department } = data;

  const act = async (key: string, request: () => Promise<unknown>, success: string) => {
    setBusy(key);
    setMessage(null);
    try {
      await request();
      setMessage({ type: 'ok', text: success });
      onChanged();
    } catch (err) {
      setMessage({ type: 'error', text: getErrorMessage(err, 'That did not work. Please try again.') });
    } finally {
      setBusy(null);
    }
  };

  const setOrderStatus = (order: DashboardOrder, status: string) =>
    act(`order-${order.id}`, () => axios.post(`${API_BASE_URL}/staff/dashboard/orders/${order.id}/status/`, { status }, authHeaders()),
      `Order ${order.order_number} marked as ${ORDER_STATUSES.find(s => s[0] === status)?.[1].toLowerCase()}.`);

  const setStock = (id: number, stock: number) =>
    act(`stock-${id}`, () => axios.post(`${API_BASE_URL}/staff/dashboard/products/${id}/stock/`, { stock }, authHeaders()), 'Stock updated.');

  const nothingToShow = data.modules.length === 0;
  const sales = sections.sales;
  const salesChange = sales && sales.previous_30_days.revenue > 0
    ? Math.round(((sales.last_30_days.revenue - sales.previous_30_days.revenue) / sales.previous_30_days.revenue) * 100)
    : null;
  const maxDaily = Math.max(1, ...(sales?.daily || []).map(d => d.revenue));

  return (
    <div className="space-y-6">
      {(greeting || subtitle) && (
        <div className="rounded-2xl bg-gradient-to-br from-emerald-700 to-teal-800 text-white p-6">
          {greeting && <h1 className="text-2xl font-bold">{greeting}</h1>}
          {subtitle && <p className="text-emerald-100 text-sm mt-1">{subtitle}</p>}
        </div>
      )}

      {message && (
        <div className={`px-4 py-3 rounded-xl text-sm border ${message.type === 'ok' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-700'}`}>
          {message.text}
        </div>
      )}

      {/* Deliveries (drivers / deliverers) */}
      {sections.deliveries && (
        <Section icon={HiOutlineTruck} title="Deliveries">
          <div className="grid grid-cols-3 gap-3 mb-5">
            <Stat label="Ready to go" value={sections.deliveries.ready} />
            <Stat label="On the way" value={sections.deliveries.on_the_way} />
            <Stat label="Delivered today" value={sections.deliveries.delivered_today} />
          </div>
          {sections.deliveries.orders.length === 0 ? (
            <Empty>No deliveries waiting. 🎉</Empty>
          ) : (
            <div className="space-y-3">
              {sections.deliveries.orders.map(order => (
                <div key={order.id} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-500">{order.order_number}</span>
                        <StatusPill order={order} />
                      </div>
                      <p className="font-semibold text-slate-900 mt-1">{order.delivery.deliver_to || order.customer}</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600 mt-1">
                        {order.delivery.location && <span className="inline-flex items-center gap-1"><HiOutlineMapPin className="w-4 h-4" />{order.delivery.location}</span>}
                        {order.delivery.phone && (
                          <a href={`tel:${order.delivery.phone}`} className="inline-flex items-center gap-1 text-emerald-700 hover:underline">
                            <HiOutlinePhone className="w-4 h-4" />{order.delivery.phone}
                          </a>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{order.items.join(', ')}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">{dalasi(order.total)}</p>
                      {order.payment_method === 'cod' && <p className="text-xs font-semibold text-amber-700">Collect cash</p>}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    {order.status === 'processing' && (
                      <button
                        onClick={() => setOrderStatus(order, 'shipped')}
                        disabled={busy === `order-${order.id}`}
                        className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 disabled:opacity-50"
                      >
                        Out for delivery
                      </button>
                    )}
                    <button
                      onClick={() => setOrderStatus(order, 'delivered')}
                      disabled={busy === `order-${order.id}`}
                      className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50"
                    >
                      Mark delivered
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>
      )}

      {/* Orders */}
      {sections.orders && (
        <Section icon={HiOutlineShoppingCart} title="Orders" action={<span className="text-xs text-slate-500">{sections.orders.today} placed today</span>}>
          <div className="flex flex-wrap gap-2 mb-5">
            {ORDER_STATUSES.map(([key, label]) => (
              <span key={key} className={`px-3 py-1.5 rounded-full text-xs font-semibold ${STATUS_STYLES[key]}`}>
                {label}: {sections.orders!.counts[key] ?? 0}
              </span>
            ))}
          </div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Needs attention (oldest first)</p>
          {sections.orders.queue.length === 0 ? (
            <Empty>No pending or processing orders.</Empty>
          ) : (
            <div className="divide-y divide-slate-100">
              {sections.orders.queue.map(order => (
                <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900">
                      <span className="font-mono text-xs text-slate-500 mr-2">{order.order_number}</span>{order.customer}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {order.items.join(', ')} · {dalasi(order.total)} · {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <select
                    value={order.status}
                    disabled={busy === `order-${order.id}`}
                    onChange={(e) => setOrderStatus(order, e.target.value)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-semibold border border-slate-200 ${STATUS_STYLES[order.status] || ''}`}
                    aria-label={`Status of order ${order.order_number}`}
                  >
                    {ORDER_STATUSES.map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                  </select>
                </div>
              ))}
            </div>
          )}
        </Section>
      )}

      {/* Sales */}
      {sales && (
        <Section icon={HiOutlineCurrencyDollar} title="Sales">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <Stat label="Today" value={dalasi(sales.today.revenue)} sub={`${sales.today.orders} orders`} />
            <Stat label="Last 7 days" value={dalasi(sales.last_7_days.revenue)} sub={`${sales.last_7_days.orders} orders`} />
            <Stat
              label="Last 30 days"
              value={dalasi(sales.last_30_days.revenue)}
              sub={salesChange === null ? `${sales.last_30_days.orders} orders` : `${salesChange >= 0 ? '+' : ''}${salesChange}% vs previous 30 days`}
            />
            <Stat label="Average order" value={dalasi(sales.average_order_value)} sub="last 30 days" />
          </div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Revenue, last 14 days</p>
          <div className="flex items-end gap-1.5 h-32">
            {sales.daily.map(day => (
              <div key={day.date} className="flex-1 h-full flex flex-col justify-end" title={`${day.date}: ${dalasi(day.revenue)} (${day.orders} orders)`}>
                <div className="w-full rounded-t bg-emerald-500" style={{ height: `${Math.max(day.revenue ? 4 : 0, (day.revenue / maxDaily) * 100)}%` }} />
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>{sales.daily[0]?.date}</span>
            <span>{sales.daily[sales.daily.length - 1]?.date}</span>
          </div>
          {sales.top_products.length > 0 && (
            <>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mt-6 mb-2">Top products, last 30 days</p>
              <div className="divide-y divide-slate-100">
                {sales.top_products.map(p => (
                  <div key={p.product_id} className="flex justify-between py-2 text-sm">
                    <span className="text-slate-800">{p.name}</span>
                    <span className="text-slate-600 tabular-nums">{p.units} sold · {dalasi(p.revenue)}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </Section>
      )}

      {/* Payments */}
      {sections.payments && (
        <Section icon={HiOutlineCreditCard} title="Payments">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
            <Stat
              label="Awaiting online payment"
              value={dalasi(sections.payments.awaiting_online_payment.amount)}
              sub={`${sections.payments.awaiting_online_payment.orders} orders`}
            />
            <Stat
              label="Cash on delivery still to collect"
              value={dalasi(sections.payments.cash_on_delivery_due.amount)}
              sub={`${sections.payments.cash_on_delivery_due.orders} orders`}
            />
          </div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Paid orders by method, last 30 days</p>
          {sections.payments.by_method_30_days.length === 0 ? (
            <Empty>No paid orders in the last 30 days.</Empty>
          ) : (
            <div className="divide-y divide-slate-100">
              {sections.payments.by_method_30_days.map(m => (
                <div key={m.method} className="flex justify-between py-2 text-sm">
                  <span className="text-slate-800">{m.label}</span>
                  <span className="text-slate-600 tabular-nums">{m.orders} orders · {dalasi(m.amount)}</span>
                </div>
              ))}
            </div>
          )}
        </Section>
      )}

      {/* Inventory */}
      {sections.inventory && (
        <Section icon={HiOutlineCube} title="Inventory">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
            <Stat label="Active products" value={sections.inventory.active_products} />
            <Stat label="Out of stock" value={sections.inventory.out_of_stock_count} />
            <Stat label="Low stock" value={sections.inventory.low_stock_count} sub={`${sections.inventory.low_stock_threshold} or fewer left`} />
            <Stat label="Missing impact data" value={sections.inventory.missing_impact} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {(['out_of_stock', 'low_stock'] as const).map(key => (
              <div key={key}>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">{key === 'out_of_stock' ? 'Out of stock' : 'Running low'}</p>
                {sections.inventory![key].length === 0 ? (
                  <Empty>Nothing here.</Empty>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {sections.inventory![key].map(item => (
                      <StockRow key={item.id} item={item} onSave={setStock} busy={busy === `stock-${item.id}`} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Customers */}
      {sections.customers && (
        <Section icon={HiOutlineUsers} title="Customers">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
            <Stat label="Customers" value={formatAmount(sections.customers.total, 0)} />
            <Stat label="New this week" value={sections.customers.new_7_days} />
            <Stat label="New in 30 days" value={sections.customers.new_30_days} />
            <Stat label="Have ordered" value={sections.customers.with_orders} />
          </div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Latest sign-ups</p>
          <div className="divide-y divide-slate-100">
            {sections.customers.recent.map(c => (
              <div key={c.id} className="flex justify-between gap-3 py-2 text-sm">
                <span className="text-slate-800 truncate">{c.name} <span className="text-slate-500">· {c.email}</span></span>
                <span className="text-slate-500 flex-shrink-0">{new Date(c.date_joined).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Impact */}
      {sections.impact && (
        <Section icon={HiOutlineSparkles} title="Impact">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Stat label="Plastic diverted" value={formatKg(sections.impact.all_time.plastic_diverted_kg)} sub={`${formatKg(sections.impact.this_month.plastic_diverted_kg)} this month`} />
            <Stat label="CO₂ saved" value={formatKg(sections.impact.all_time.co2_saved_kg)} sub={`${formatKg(sections.impact.this_month.co2_saved_kg)} this month`} />
            <Stat label="Products sold" value={formatAmount(sections.impact.all_time.products_sold, 0)} sub={`${sections.impact.this_month.products_sold} this month`} />
            <Stat label="People engaged" value={formatAmount(sections.impact.all_time.people_engaged, 0)} sub={`${sections.impact.this_month.people_engaged} this month`} />
          </div>
        </Section>
      )}

      {/* Team */}
      {sections.team && (
        <Section icon={HiOutlineUserGroup} title="Team">
          <div className="grid grid-cols-2 gap-3 mb-5">
            <Stat label="Active staff" value={sections.team.active} />
            <Stat label="Inactive" value={sections.team.inactive} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-sm">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">By department</p>
              {sections.team.by_department.map(d => (
                <div key={d.department_id} className="flex justify-between py-1.5"><span>{d.name}</span><span className="tabular-nums text-slate-600">{d.count}</span></div>
              ))}
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">By role</p>
              {sections.team.by_role.map(r => (
                <div key={r.role} className="flex justify-between py-1.5"><span>{r.label}</span><span className="tabular-nums text-slate-600">{r.count}</span></div>
              ))}
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Recent hires</p>
              {sections.team.recent_hires.map(h => (
                <div key={`${h.name}-${h.hire_date}`} className="py-1.5">
                  <p className="text-slate-800">{h.name}</p>
                  <p className="text-xs text-slate-500">{h.role} · {h.department} · {h.hire_date}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* Department */}
      {department && (
        <Section icon={HiOutlineBuildingOffice2} title={`${department.name} department`}>
          {department.description && <p className="text-sm text-slate-600 mb-4">{department.description}</p>}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-5">
            <Stat label="Team members" value={department.member_count} />
            <Stat label="Manager" value={department.manager || '—'} />
            {department.budget_allocation !== undefined && <Stat label="Budget" value={dalasi(department.budget_allocation)} />}
          </div>
          <div className="divide-y divide-slate-100">
            {department.members.map(member => (
              <div key={member.id} className="flex flex-wrap justify-between gap-2 py-2.5 text-sm">
                <span className="font-medium text-slate-800">{member.name} <span className="font-normal text-slate-500">· {member.role}</span></span>
                <span className="text-slate-500">
                  <a href={`mailto:${member.email}`} className="hover:text-emerald-700">{member.email}</a>
                  {member.phone ? <> · <a href={`tel:${member.phone}`} className="hover:text-emerald-700">{member.phone}</a></> : null}
                </span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {nothingToShow && !department && (
        <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-200/60">
          <p className="text-slate-700 font-medium">No dashboard sections yet.</p>
          <p className="text-sm text-slate-500 mt-1">Ask an admin to give you permissions in the Staff section.</p>
        </div>
      )}
    </div>
  );
}
