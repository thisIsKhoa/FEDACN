import React, { useMemo } from 'react';
import { FiActivity, FiCalendar, FiDollarSign, FiAlertTriangle, FiClock, FiCheckCircle, FiTrendingUp, FiInbox } from 'react-icons/fi';
import { bookings, payments, checkinLogs, workspaces, getWorkspace, getBranch, getUser } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { formatVND, formatTime, bookingStatusLabel, bookingStatusColor } from '../../utils/formatters';
import { EmptyState } from '../../components/ui/EmptyState';

const OperationsDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const branchId = user?.branchId || 'branch-0001';
  const branch = getBranch(branchId);

  const branchBookings = useMemo(() => bookings.filter(b => b.branch_id === branchId), [branchId]);
  const todayBookings = branchBookings.filter(b => new Date(b.start_at).toDateString() === new Date().toDateString());
  const activeCheckins = checkinLogs.filter(ci => !ci.checkout_at);
  const pendingPayments = payments.filter(p => p.status === 'pending');
  const confirmedToday = todayBookings.filter(b => b.status === 'confirmed' || b.status === 'checked_in');
  const totalRevenue = branchBookings.filter(b => b.status === 'completed' || b.status === 'checked_in').reduce((s, b) => s + b.total_amount, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Quản lý vận hành</p>
            <h1 className="text-xl font-bold font-heading mt-1">Dashboard - {branch?.name}</h1>
            <p className="text-sm text-muted-foreground mt-1">Tổng quan hoạt động hôm nay</p>
          </div>
          <div className="flex items-center gap-2 badge badge-success">
            <span className="h-2 w-2 rounded-full bg-green-500 status-pulse" /> Đang hoạt động
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="stat-card"><FiCalendar className="h-5 w-5 text-primary" /><p className="stat-value mt-3">{todayBookings.length}</p><p className="stat-label">Booking hôm nay</p></div>
        <div className="stat-card"><FiCheckCircle className="h-5 w-5 text-success" /><p className="stat-value mt-3">{activeCheckins.length}</p><p className="stat-label">Đang check-in</p></div>
        <div className="stat-card"><FiClock className="h-5 w-5 text-warning" /><p className="stat-value mt-3">{pendingPayments.length}</p><p className="stat-label">Chờ thanh toán</p></div>
        <div className="stat-card"><FiDollarSign className="h-5 w-5 text-success" /><p className="stat-value mt-3">{formatVND(totalRevenue)}</p><p className="stat-label">Doanh thu</p></div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-semibold flex items-center gap-2"><FiActivity className="h-4 w-4 text-primary" /> Booking hôm nay</h2>
          <div className="mt-4 space-y-3">
            {confirmedToday.length === 0 ? (
              <EmptyState 
                icon={FiInbox} 
                title="Chưa có booking" 
                description="Không có booking nào được xác nhận trong hôm nay." 
                className="py-12"
              />
            ) : confirmedToday.map(b => {
              const ws = getWorkspace(b.workspace_id);
              const customer = getUser(b.user_id);
              return (
                <div key={b.id} className="flex items-center gap-4 rounded-xl bg-muted p-4 transition hover:bg-primary/5">
                  <div className="text-center shrink-0">
                    <p className="text-lg font-bold text-primary">{formatTime(b.start_at)}</p>
                    <p className="text-xs text-muted-foreground">{formatTime(b.end_at)}</p>
                  </div>
                  <div className="h-10 w-px bg-border" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{ws?.name}</p>
                    <p className="text-sm text-muted-foreground">{customer?.full_name} · {b.booking_code}</p>
                  </div>
                  <span className={`badge ${bookingStatusColor[b.status]}`}>{bookingStatusLabel[b.status]}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-semibold flex items-center gap-2"><FiTrendingUp className="h-4 w-4 text-primary" /> Thao tác nhanh</h2>
            <div className="mt-4 grid gap-3">
              <button className="btn btn-primary w-full"><FiCheckCircle className="h-4 w-4" /> Check-in bằng mã booking</button>
              <button className="btn btn-secondary w-full"><FiDollarSign className="h-4 w-4" /> Xác nhận thanh toán tiền mặt</button>
              <button className="btn btn-secondary w-full"><FiCalendar className="h-4 w-4" /> Tạo booking walk-in</button>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-semibold flex items-center gap-2"><FiAlertTriangle className="h-4 w-4 text-warning" /> Cảnh báo</h2>
            <div className="mt-4 space-y-3">
              {pendingPayments.length > 0 && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950 p-3">
                  <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">{pendingPayments.length} thanh toán đang chờ xác nhận</p>
                </div>
              )}
              {activeCheckins.length > 0 && (
                <div className="rounded-xl border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950 p-3">
                  <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">{activeCheckins.length} khách đang sử dụng không gian</p>
                </div>
              )}
              <div className="rounded-xl border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950 p-3">
                <p className="text-sm font-semibold text-red-700 dark:text-red-400">Workspace HD-05 đang bảo trì</p>
                <p className="text-xs text-muted-foreground mt-1">Dự kiến hoàn thành trong 24 giờ</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperationsDashboardPage;
