import React, { useMemo } from 'react';
import { FiTrendingUp, FiUsers, FiMapPin, FiDollarSign, FiCalendar, FiActivity } from 'react-icons/fi';
import { branches, bookings, payments, users, workspaces } from '../../data/mockData';
import { formatVND } from '../../utils/formatters';

const AdminDashboardPage: React.FC = () => {
  const totalRevenue = payments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
  const totalBookings = bookings.length;
  const activeBookings = bookings.filter(b => ['confirmed', 'checked_in', 'pending_payment'].includes(b.status)).length;
  const totalUsers = users.filter(u => u.role === 'customer').length;
  const totalSpaces = workspaces.length;

  const revenueByBranch = useMemo(() =>
    branches.map(b => {
      const branchBookings = bookings.filter(bk => bk.branch_id === b.id);
      const revenue = branchBookings.filter(bk => bk.status === 'completed' || bk.status === 'checked_in')
        .reduce((s, bk) => s + bk.total_amount, 0);
      const active = branchBookings.filter(bk => ['confirmed', 'checked_in'].includes(bk.status)).length;
      return { ...b, revenue, bookingCount: branchBookings.length, activeBookings: active };
    }), []);

  const chartData = [
    { label: 'T2', value: 85 }, { label: 'T3', value: 72 }, { label: 'T4', value: 90 },
    { label: 'T5', value: 65 }, { label: 'T6', value: 78 }, { label: 'T7', value: 55 }, { label: 'CN', value: 40 },
  ];
  const maxChart = Math.max(...chartData.map(d => d.value));

  return (
    <div className="space-y-6 page-enter">
      <div className="section-card">
        <p className="section-title">Quản trị hệ thống</p>
        <h1 className="section-heading">Tổng quan hệ thống</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Dashboard quản trị toàn bộ chi nhánh</p>
      </div>

      {/* Global Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { icon: FiDollarSign, label: 'Tổng doanh thu', value: formatVND(totalRevenue), color: 'text-[var(--state-success)]' },
          { icon: FiCalendar, label: 'Tổng booking', value: String(totalBookings), color: 'text-[var(--brand-primary)]' },
          { icon: FiActivity, label: 'Đang hoạt động', value: String(activeBookings), color: 'text-[var(--state-info)]' },
          { icon: FiUsers, label: 'Khách hàng', value: String(totalUsers), color: 'text-[var(--brand-secondary)]' },
          { icon: FiMapPin, label: 'Workspace', value: String(totalSpaces), color: 'text-[var(--state-warning)]' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <s.icon className={`h-5 w-5 ${s.color}`} />
            <p className="stat-value mt-3">{s.value}</p>
            <p className="stat-label">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        {/* Occupancy Chart */}
        <div className="section-card">
          <h2 className="font-semibold flex items-center gap-2">
            <FiTrendingUp className="h-4 w-4 text-[var(--brand-primary)]" /> Tỷ lệ sử dụng (tuần này)
          </h2>
          <div className="mt-6 flex items-end gap-3 h-48">
            {chartData.map(d => (
              <div key={d.label} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs font-semibold text-[var(--text-secondary)]">{d.value}%</span>
                <div className="w-full rounded-t-lg transition-all duration-500"
                  style={{ height: `${(d.value / maxChart) * 100}%`, background: d.value > 80 ? 'var(--state-success)' : d.value > 60 ? 'var(--brand-primary)' : 'var(--state-warning)' }} />
                <span className="text-xs text-[var(--text-tertiary)]">{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Branch Overview */}
        <div className="section-card">
          <h2 className="font-semibold flex items-center gap-2">
            <FiMapPin className="h-4 w-4 text-[var(--brand-primary)]" /> Theo chi nhánh
          </h2>
          <div className="mt-4 space-y-4">
            {revenueByBranch.map(b => (
              <div key={b.id} className="rounded-xl bg-[var(--bg-surface-hover)] p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{b.name}</p>
                    <p className="text-sm text-[var(--text-secondary)]">{b.address}</p>
                  </div>
                  <span className={`badge ${b.status === 'active' ? 'badge-success' : 'badge-neutral'}`}>
                    {b.status === 'active' ? 'Hoạt động' : 'Tạm ngưng'}
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-3">
                  <div>
                    <p className="text-xs text-[var(--text-tertiary)]">Doanh thu</p>
                    <p className="text-sm font-semibold text-[var(--state-success)]">{formatVND(b.revenue)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-tertiary)]">Tổng booking</p>
                    <p className="text-sm font-semibold">{b.bookingCount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-tertiary)]">Đang hoạt động</p>
                    <p className="text-sm font-semibold text-[var(--brand-primary)]">{b.activeBookings}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
