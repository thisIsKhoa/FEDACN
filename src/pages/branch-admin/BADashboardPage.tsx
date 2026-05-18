import React, { useMemo } from 'react';
import {
  FiGrid, FiUsers, FiTool, FiActivity, FiCalendar,
  FiArrowUpRight, FiMapPin, FiAlertCircle,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import {
  branches, workspaces, floors, users, bookings, payments,
  workspaceMaintenances,
} from '../../data/mockData';
import { formatVND } from '../../utils/formatters';

const BADashboardPage: React.FC = () => {
  const { user } = useAuth();
  const branchId = user!.branchId!;

  const branch = branches.find((b) => b.id === branchId);
  const branchFloors = floors.filter((f) => f.branch_id === branchId);
  const floorIds = branchFloors.map((f) => f.id);
  const branchWorkspaces = workspaces.filter((w) => floorIds.includes(w.floor_id));
  const branchStaff = users.filter((u) => u.role === 'staff' && u.branch_id === branchId);
  const branchBookings = bookings.filter((b) => b.branch_id === branchId);
  const todayBookings = branchBookings.filter((b) => {
    const d = new Date(b.start_at);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  });
  const activeMaintenances = workspaceMaintenances.filter(
    (m) => branchWorkspaces.some((w) => w.id === m.workspace_id) && m.status === 'active'
  );
  const branchRevenue = payments
    .filter((p) => p.status === 'paid' && branchBookings.some((b) => b.id === p.booking_id))
    .reduce((s, p) => s + p.amount, 0);

  const activeWs = branchWorkspaces.filter((w) => w.status === 'active').length;
  const maintenanceWs = branchWorkspaces.filter((w) => w.status === 'maintenance').length;

  const statCards = useMemo(() => [
    {
      icon: FiGrid, label: 'Tổng workspace', value: String(branchWorkspaces.length),
      sub: `${activeWs} hoạt động`, gradient: 'from-blue-500 to-indigo-500', glow: 'bg-blue-500/10',
    },
    {
      icon: FiActivity, label: 'Đặt chỗ hôm nay', value: String(todayBookings.length),
      sub: `${branchBookings.filter(b => b.status === 'checked_in').length} đang check-in`,
      gradient: 'from-violet-500 to-purple-500', glow: 'bg-violet-500/10',
    },
    {
      icon: FiUsers, label: 'Nhân viên', value: String(branchStaff.length),
      sub: `${branchStaff.filter(u => u.status === 'active').length} đang làm việc`,
      gradient: 'from-emerald-500 to-teal-500', glow: 'bg-emerald-500/10',
    },
    {
      icon: FiTool, label: 'Đang bảo trì', value: String(maintenanceWs),
      sub: `${activeMaintenances.length} lịch đang chạy`,
      gradient: 'from-amber-500 to-orange-500', glow: 'bg-amber-500/10',
    },
    {
      icon: FiCalendar, label: 'Doanh thu', value: formatVND(branchRevenue),
      sub: `${branchBookings.filter(b => b.status === 'completed').length} booking hoàn thành`,
      gradient: 'from-rose-500 to-pink-500', glow: 'bg-rose-500/10',
    },
  ], [branchWorkspaces, activeWs, todayBookings, branchBookings, branchStaff, maintenanceWs, activeMaintenances, branchRevenue]);

  const chartData = [
    { label: 'T2', value: 72 }, { label: 'T3', value: 85 }, { label: 'T4', value: 60 },
    { label: 'T5', value: 90 }, { label: 'T6', value: 78 }, { label: 'T7', value: 45 }, { label: 'CN', value: 30 },
  ];
  const maxChart = Math.max(...chartData.map((d) => d.value));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Quản lý chi nhánh
            </p>
            <h1 className="text-xl font-bold font-heading mt-1">Tổng quan chi nhánh</h1>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
              <FiMapPin className="h-3.5 w-3.5" />
              {branch?.name ?? branchId} — {branch?.address}
            </p>
          </div>
          {branch?.status === 'inactive' && (
            <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400">
              <FiAlertCircle className="h-4 w-4 shrink-0" />
              Chi nhánh đang tạm ngưng hoạt động
            </div>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {statCards.map((s) => (
          <div key={s.label} className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
            <div className={`absolute -top-8 -right-8 h-24 w-24 rounded-full ${s.glow} blur-2xl opacity-50 transition-opacity group-hover:opacity-100`} />
            <div className="relative">
              <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${s.gradient} text-white shadow-sm`}>
                <s.icon className="h-5 w-5" />
              </div>
              <p className="mt-4 text-2xl font-extrabold tracking-tight">{s.value}</p>
              <div className="mt-1 flex items-center justify-between gap-2">
                <p className="text-sm text-muted-foreground truncate">{s.label}</p>
                <span className="inline-flex items-center gap-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 shrink-0">
                  <FiArrowUpRight className="h-3 w-3" />
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1 truncate">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Occupancy chart */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-semibold flex items-center gap-2">
            <FiActivity className="h-4 w-4 text-primary" /> Tỷ lệ sử dụng (tuần này)
          </h2>
          <div className="mt-6 flex items-end gap-3 h-40">
            {chartData.map((d) => (
              <div key={d.label} className="flex-1 flex flex-col items-center gap-2 group">
                <span className="text-xs font-semibold text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">{d.value}%</span>
                <div
                  className="w-full rounded-t-lg transition-all duration-500"
                  style={{
                    height: `${(d.value / maxChart) * 100}%`,
                    background: d.value > 80
                      ? 'linear-gradient(to top, hsl(var(--success)), hsl(142 71% 55%))'
                      : d.value > 55
                        ? 'linear-gradient(to top, hsl(var(--primary)), hsl(221 83% 63%))'
                        : 'linear-gradient(to top, hsl(var(--warning)), hsl(38 92% 60%))',
                    borderRadius: '6px 6px 0 0',
                  }}
                />
                <span className="text-xs text-muted-foreground font-medium">{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent bookings */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-semibold flex items-center gap-2 mb-4">
            <FiCalendar className="h-4 w-4 text-primary" /> Đặt chỗ gần đây
          </h2>
          {branchBookings.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Chưa có đặt chỗ nào</p>
          ) : (
            <div className="space-y-2">
              {branchBookings.slice(0, 5).map((b) => (
                <div key={b.id} className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-3 py-2.5 text-sm">
                  <div>
                    <p className="font-mono text-xs font-semibold">{b.booking_code}</p>
                    <p className="text-xs text-muted-foreground">{new Date(b.start_at).toLocaleString('vi-VN')}</p>
                  </div>
                  <span className={`badge text-xs ${
                    b.status === 'checked_in' ? 'badge-success' :
                    b.status === 'confirmed' ? 'badge-info' :
                    b.status === 'pending_payment' ? 'badge-warning' :
                    b.status === 'completed' ? 'badge-neutral' : 'badge-neutral'
                  }`}>
                    {b.status === 'checked_in' ? 'Check-in' :
                     b.status === 'confirmed' ? 'Xác nhận' :
                     b.status === 'pending_payment' ? 'Chờ TT' :
                     b.status === 'completed' ? 'Hoàn thành' : b.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BADashboardPage;
