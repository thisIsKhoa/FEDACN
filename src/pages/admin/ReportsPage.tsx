import React from 'react';
import { FiBarChart2, FiDownload, FiPieChart, FiTrendingUp } from 'react-icons/fi';
import { branches, bookings, payments } from '../../data/mockData';
import { formatVND } from '../../utils/formatters';

const ReportsPage: React.FC = () => {
  const totalRevenue = payments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
  const totalBookings = bookings.length;
  const completedBookings = bookings.filter(b => b.status === 'completed').length;
  const canceledBookings = bookings.filter(b => b.status === 'canceled').length;

  const byType = [
    { type: 'Bàn làm việc', count: bookings.filter(b => b.workspace_id.includes('ws-000') && Number(b.workspace_id.slice(-1)) <= 8).length, revenue: 450000 },
    { type: 'Phòng họp', count: 2, revenue: 800000 },
    { type: 'Văn phòng riêng', count: 1, revenue: 1450000 },
  ];

  const months = ['T1', 'T2', 'T3', 'T4'];
  const monthlyRevenue = [2800000, 3500000, 4200000, totalRevenue];
  const maxRev = Math.max(...monthlyRevenue);

  return (
    <div className="space-y-6 page-enter">
      <div className="section-card">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="section-title">Báo cáo</p>
            <h1 className="section-heading">Phân tích & Thống kê</h1>
          </div>
          <button className="btn btn-secondary btn-sm"><FiDownload className="h-4 w-4" /> Xuất CSV</button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <div className="stat-card"><p className="stat-value" style={{ color: 'var(--state-success)' }}>{formatVND(totalRevenue)}</p><p className="stat-label">Tổng doanh thu</p></div>
        <div className="stat-card"><p className="stat-value">{totalBookings}</p><p className="stat-label">Tổng booking</p></div>
        <div className="stat-card"><p className="stat-value" style={{ color: 'var(--brand-primary)' }}>{completedBookings}</p><p className="stat-label">Hoàn thành</p></div>
        <div className="stat-card"><p className="stat-value" style={{ color: 'var(--state-danger)' }}>{canceledBookings}</p><p className="stat-label">Đã hủy</p></div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <div className="section-card">
          <h2 className="font-semibold flex items-center gap-2"><FiTrendingUp className="h-4 w-4 text-[var(--brand-primary)]" /> Doanh thu theo tháng</h2>
          <div className="mt-6 flex items-end gap-4 h-48">
            {months.map((m, i) => (
              <div key={m} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs font-semibold text-[var(--text-secondary)]">{formatVND(monthlyRevenue[i])}</span>
                <div className="w-full rounded-t-lg bg-gradient-to-t from-[var(--brand-primary)] to-[var(--brand-secondary)] transition-all duration-500"
                  style={{ height: `${(monthlyRevenue[i] / maxRev) * 100}%` }} />
                <span className="text-xs text-[var(--text-tertiary)]">{m}/2026</span>
              </div>
            ))}
          </div>
        </div>

        {/* By Type */}
        <div className="section-card">
          <h2 className="font-semibold flex items-center gap-2"><FiPieChart className="h-4 w-4 text-[var(--brand-primary)]" /> Theo loại workspace</h2>
          <div className="mt-6 space-y-4">
            {byType.map(t => (
              <div key={t.type} className="rounded-xl bg-[var(--bg-surface-hover)] p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{t.type}</span>
                  <span className="text-sm font-semibold text-[var(--brand-primary)]">{formatVND(t.revenue)}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-[var(--text-secondary)]">
                  <span>{t.count} booking</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-[var(--border-subtle)] overflow-hidden">
                  <div className="h-full rounded-full bg-[var(--brand-primary)]" style={{ width: `${(t.count / totalBookings) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Branch Comparison */}
      <div className="section-card">
        <h2 className="font-semibold flex items-center gap-2"><FiBarChart2 className="h-4 w-4 text-[var(--brand-primary)]" /> So sánh chi nhánh</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>Chi nhánh</th><th>Tổng booking</th><th>Doanh thu</th><th>Tỷ lệ hoàn thành</th></tr></thead>
            <tbody>
              {branches.map(b => {
                const bBookings = bookings.filter(bk => bk.branch_id === b.id);
                const bRevenue = bBookings.filter(bk => bk.status === 'completed' || bk.status === 'checked_in').reduce((s, bk) => s + bk.total_amount, 0);
                const completionRate = bBookings.length > 0 ? Math.round((bBookings.filter(bk => bk.status === 'completed').length / bBookings.length) * 100) : 0;
                return (
                  <tr key={b.id}>
                    <td className="font-medium">{b.name}</td>
                    <td>{bBookings.length}</td>
                    <td className="font-semibold text-[var(--state-success)]">{formatVND(bRevenue)}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 rounded-full bg-[var(--border-subtle)] overflow-hidden max-w-[100px]">
                          <div className="h-full rounded-full bg-[var(--state-success)]" style={{ width: `${completionRate}%` }} />
                        </div>
                        <span className="text-sm">{completionRate}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
