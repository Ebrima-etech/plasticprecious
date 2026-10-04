// Types and context for role/department-based staff dashboards (mirrors preciousback/staff/dashboard.py)
import { createContext, useContext } from 'react';

export interface StaffMe {
  is_admin: boolean;
  user: { id: number; name: string; email: string };
  staff: { id: number; role: string; role_display: string; department_id: number; department: string } | null;
  permissions: string[];
  modules: string[];
}

export const StaffMeContext = createContext<StaffMe | null>(null);
export const useStaffMe = () => useContext(StaffMeContext);

// Pages non-admin staff may open; everything else in /admin is for full admins
export const STAFF_ALLOWED_PATHS = ['/admin/dashboard'];

export interface DashboardOrder {
  id: number;
  order_number: string;
  status: string;
  status_label: string;
  payment_method: string;
  total: number;
  created_at: string;
  customer: string;
  items: string[];
  delivery: { deliver_to: string; phone: string; location: string };
}

export interface StockItem {
  id: number;
  name: string;
  stock: number;
}

export interface DashboardSections {
  orders?: { counts: Record<string, number>; today: number; queue: DashboardOrder[] };
  deliveries?: { ready: number; on_the_way: number; delivered_today: number; orders: DashboardOrder[] };
  sales?: {
    today: { revenue: number; orders: number };
    last_7_days: { revenue: number; orders: number };
    last_30_days: { revenue: number; orders: number };
    previous_30_days: { revenue: number; orders: number };
    average_order_value: number;
    daily: { date: string; revenue: number; orders: number }[];
    top_products: { product_id: number; name: string; units: number; revenue: number }[];
  };
  payments?: {
    awaiting_online_payment: { orders: number; amount: number };
    cash_on_delivery_due: { orders: number; amount: number };
    by_method_30_days: { method: string; label: string; orders: number; amount: number }[];
  };
  inventory?: {
    active_products: number;
    out_of_stock_count: number;
    low_stock_count: number;
    low_stock_threshold: number;
    out_of_stock: StockItem[];
    low_stock: StockItem[];
    missing_impact: number;
  };
  customers?: {
    total: number;
    new_7_days: number;
    new_30_days: number;
    with_orders: number;
    recent: { id: number; name: string; email: string; date_joined: string }[];
  };
  impact?: {
    all_time: { plastic_diverted_kg: number; co2_saved_kg: number; products_sold: number; people_engaged: number; bottles_equivalent: number };
    this_month: { plastic_diverted_kg: number; co2_saved_kg: number; products_sold: number; people_engaged: number };
  };
  team?: {
    active: number;
    inactive: number;
    by_department: { department_id: number; name: string; count: number }[];
    by_role: { role: string; label: string; count: number }[];
    recent_hires: { name: string; role: string; department: string; hire_date: string }[];
  };
}

export interface DepartmentInfo {
  id: number;
  name: string;
  description: string;
  manager: string | null;
  member_count: number;
  budget_allocation?: number;
  members: { id: number; name: string; role: string; email: string; phone?: string }[];
}

export interface DashboardData {
  viewing: { type: 'self' | 'department' | 'staff'; name?: string; role?: string };
  modules: string[];
  sections: DashboardSections;
  department: DepartmentInfo | null;
}

export const dalasi = (value: number) =>
  `D ${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
