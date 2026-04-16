import React, { useMemo } from 'react';
import { FiActivity, FiUsers, FiCalendar, FiDollarSign, FiAlertTriangle, FiClock, FiCheckCircle, FiTrendingUp } from 'react-icons/fi';
import { bookings, payments, checkinLogs, workspaces, getWorkspace, getBranch, getUser } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { formatVND, formatTime, formatDate, bookingStatusLabel, bookingStatusColor } from '../../utils/formatters';

const OperationsDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const branchId = user?.branchId || 'branch-0001';
  const branch = getBranch(branchId);

  const branchBookings = useMemo(() => bookings.filter(b => b.branch_id === branchId), [branchId]);
  const todayBookings = branchBookings.filter(b => {
    const d = new Date(b.start_at);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  });

  const activeCheckins = checkinLogs.filter(ci => !ci.checkout_at);
  const pendingPayments = payments.filter(p => p.status === 'pending');
  const confirmedToday = todayBookings.filter(b => b.status === 'confirmed' || b.status === 'checked_in');
  const totalRevenue = branchBookings.filter(b => b.status === 'completed' || b.status === 'checked_in')
    .reduce((s, b) => s + b.total_amount, 0);

  const branchWorkspaces = workspaces.filter(ws => {
    const floor = ws.floor_id;
    return true; // simplified - in real app would look up floor → branch
  });

  return (
    <div className="space-y-6 page-enter">
      <div className="section-card">
        <div className="flex items-start justify-between">
          <div>
            <p className="section-title">Quản lý vận hành</p>
            <h1 className="section-heading">Dashboard - {branch?.name}</h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">Tổng quan hoạt động hôm nay</p>
          </div>
          <div className="flex items-center gap-2 badge badge-success">
            <span className="h-2 w-2 rounded-full bg-[var(--state-success)] status-pulse" />
            Đang hoạt động
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="stat-card">
          <FiCalendar className="h-5 w-5 text-[var(--brand-primary)]" />
          <p className="stat-value mt-3">{todayBookings.length}</p>
          <p className="stat-label">Booking hôm nay</p>
        </div>
        <div className="stat-card">
          <FiCheckCircle className="h-5 w-5 text-[var(--state-success)]" />
          <p className="stat-value mt-3">{activeCheckins.length}</p>
          <p className="stat-label">Đang check-in</p>
        </div>
        <div className="stat-card">
          <FiClock className="h-5 w-5 text-[var(--state-warning)]" />
          <p className="stat-value mt-3">{pendingPayments.length}</p>
          <p className="stat-label">Chờ thanh toán</p>
        </div>
        <div className="stat-card">
          <FiDollarSign className="h-5 w-5 text-[var(--state-success)]" />
          <p className="stat-value mt-3">{formatVND(totalRevenue)}</p>
          <p className="stat-label">Doanh thu</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        {/* Today's timeline */}
        <div className="section-card">
          <h2 className="font-semibold flex items-center gap-2">
            <FiActivity className="h-4 w-4 text-[var(--brand-primary)]" /> Booking hôm nay
          </h2>
          <div className="mt-4 space-y-3">
            {confirmedToday.length === 0 ? (
              <p className="text-sm text-[var(--text-secondary)] text-center py-8">Không có booking nào hôm nay</p>
            ) : confirmedToday.map(b => {
              const ws = getWorkspace(b.workspace_id);
              const customer = getUser(b.user_id);
              return (
                <div key={b.id} className="flex items-center gap-4 rounded-xl bg-[var(--bg-surface-hover)] p-4 transition hover:bg-[var(--brand-primary-light)]">
                  <div className="text-center shrink-0">
                    <p className="text-lg font-bold text-[var(--brand-primary)]">{formatTime(b.start_at)}</p>
                    <p className="text-xs text-[var(--text-tertiary)]">{formatTime(b.end_at)}</p>
                  </div>
                  <div className="h-10 w-px bg-[var(--border-subtle)]" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{ws?.name}</p>
                    <p className="text-sm text-[var(--text-secondary)]">{customer?.full_name} · {b.booking_code}</p>
                  </div>
                  <span className={`badge ${bookingStatusColor[b.status]}`}>{bookingStatusLabel[b.status]}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Alerts & Quick Actions */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="section-card">
            <h2 className="font-semibold flex items-center gap-2">
              <FiTrendingUp className="h-4 w-4 text-[var(--brand-primary)]" /> Thao tác nhanh
            </h2>
            <div className="mt-4 grid gap-3">
              <button className="btn btn-primary w-full">
                <FiCheckCircle className="h-4 w-4" /> Check-in bằng mã booking
              </button>
              <button className="btn btn-secondary w-full">
                <FiDollarSign className="h-4 w-4" /> Xác nhận thanh toán tiền mặt
              </button>
              <button className="btn btn-secondary w-full">
                <FiCalendar className="h-4 w-4" /> Tạo booking walk-in
              </button>
            </div>
          </div>

          {/* Alerts */}
          <div className="section-card">
            <h2 className="font-semibold flex items-center gap-2">
              <FiAlertTriangle className="h-4 w-4 text-[var(--state-warning)]" /> Cảnh báo
            </h2>
            <div className="mt-4 space-y-3">
              {pendingPayments.length > 0 && (
                <div className="rounded-xl bg-[var(--state-warning-bg)] border border-[var(--state-warning-border)] p-3">
                  <p className="text-sm font-semibold text-[var(--state-warning)]">{pendingPayments.length} thanh toán đang chờ xác nhận</p>
                </div>
              )}
              {activeCheckins.length > 0 && (
                <div className="rounded-xl bg-[var(--state-info-bg)] border border-[var(--state-info-border)] p-3">
                  <p className="text-sm font-semibold text-[var(--state-info)]">{activeCheckins.length} khách đang sử dụng không gian</p>
                </div>
              )}
              <div className="rounded-xl bg-[var(--state-danger-bg)] border border-[var(--state-danger-border)] p-3">
                <p className="text-sm font-semibold text-[var(--state-danger)]">Workspace HD-05 đang bảo trì</p>
                <p className="text-xs text-[var(--text-secondary)] mt-1">Dự kiến hoàn thành trong 24 giờ</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperationsDashboardPage;
