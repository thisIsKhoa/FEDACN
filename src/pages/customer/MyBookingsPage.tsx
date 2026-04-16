import React, { useMemo, useState } from 'react';
import { FiCalendar, FiClock, FiHash, FiMapPin, FiSearch, FiChevronDown, FiX, FiExternalLink } from 'react-icons/fi';
import { bookings, getWorkspace, getBranch, payments, getPaymentsByBooking, bookingCancellations } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { formatVND, formatDateTime, formatDate, formatTime, bookingStatusLabel, bookingStatusColor, paymentStatusLabel, durationUnitLabel } from '../../utils/formatters';

const MyBookingsPage: React.FC = () => {
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);

  const myBookings = useMemo(() => {
    let list = bookings.filter(b => b.user_id === user?.id);
    if (statusFilter !== 'all') list = list.filter(b => b.status === statusFilter);
    if (search) list = list.filter(b => b.booking_code.toLowerCase().includes(search.toLowerCase()));
    return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [user, statusFilter, search]);

  const detail = selectedBooking ? bookings.find(b => b.id === selectedBooking) : null;
  const detailWorkspace = detail ? getWorkspace(detail.workspace_id) : null;
  const detailBranch = detail ? getBranch(detail.branch_id) : null;
  const detailPayments = detail ? getPaymentsByBooking(detail.id) : [];
  const detailCancel = detail ? bookingCancellations.find(c => c.booking_id === detail.id) : null;

  const statuses = ['all', 'pending_payment', 'confirmed', 'checked_in', 'completed', 'canceled', 'expired'] as const;

  return (
    <div className="space-y-6 page-enter">
      <div className="section-card">
        <p className="section-title">Đặt chỗ của tôi</p>
        <h1 className="section-heading">Lịch sử đặt chỗ</h1>

        {/* Filters */}
        <div className="mt-4 flex flex-wrap gap-2">
          {statuses.map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`btn btn-sm ${statusFilter === s ? 'btn-primary' : 'btn-secondary'}`}>
              {s === 'all' ? 'Tất cả' : bookingStatusLabel[s]}
            </button>
          ))}
        </div>

        <div className="mt-3 relative max-w-sm">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] h-4 w-4" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Tìm mã booking..."
            className="input-field pl-10" />
        </div>
      </div>

      {/* Bookings List */}
      <div className="grid gap-4 lg:grid-cols-[1fr_400px]">
        <div className="space-y-3">
          {myBookings.map(b => {
            const ws = getWorkspace(b.workspace_id);
            const branch = getBranch(b.branch_id);
            return (
              <div key={b.id} onClick={() => setSelectedBooking(b.id)}
                className={`section-card card-interactive cursor-pointer ${selectedBooking === b.id ? '!border-[var(--brand-primary)]' : ''}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--brand-primary-light)]">
                      <FiCalendar className="h-5 w-5 text-[var(--brand-primary)]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[var(--text-main)]">{ws?.name || b.workspace_id}</p>
                      <p className="text-xs text-[var(--text-secondary)]">
                        <FiMapPin className="inline h-3 w-3 mr-1" />{branch?.name}
                      </p>
                    </div>
                  </div>
                  <span className={bookingStatusColor[b.status] + ' badge'}>{bookingStatusLabel[b.status]}</span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div>
                    <p className="text-xs text-[var(--text-tertiary)]">Mã booking</p>
                    <p className="text-sm font-mono font-semibold text-[var(--text-main)]">{b.booking_code}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-tertiary)]">Bắt đầu</p>
                    <p className="text-sm text-[var(--text-main)]">{formatDateTime(b.start_at)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-tertiary)]">Thời lượng</p>
                    <p className="text-sm text-[var(--text-main)]">{b.unit_count} {durationUnitLabel[b.unit]?.toLowerCase()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-tertiary)]">Tổng tiền</p>
                    <p className="text-sm font-semibold text-[var(--brand-primary)]">{formatVND(b.total_amount)}</p>
                  </div>
                </div>
              </div>
            );
          })}

          {myBookings.length === 0 && (
            <div className="section-card text-center py-12">
              <FiCalendar className="h-12 w-12 mx-auto text-[var(--text-tertiary)]" />
              <p className="mt-4 font-semibold">Chưa có booking nào</p>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">Khám phá không gian để đặt chỗ đầu tiên</p>
            </div>
          )}
        </div>

        {/* Detail Sidebar */}
        {detail && (
          <div className="section-card slide-in-right sticky top-24 self-start">
            <div className="flex items-center justify-between">
              <p className="section-title">Chi tiết booking</p>
              <button onClick={() => setSelectedBooking(null)} className="btn btn-ghost btn-sm"><FiX className="h-4 w-4" /></button>
            </div>

            <div className="mt-4 text-center">
              <p className="text-2xl font-mono font-bold text-[var(--brand-primary)]">{detail.booking_code}</p>
              <span className={bookingStatusColor[detail.status] + ' badge mt-2'}>{bookingStatusLabel[detail.status]}</span>
            </div>

            <div className="mt-5 space-y-3">
              <div className="rounded-xl bg-[var(--bg-surface-hover)] p-3">
                <p className="text-xs text-[var(--text-tertiary)]">Workspace</p>
                <p className="font-semibold">{detailWorkspace?.name}</p>
                <p className="text-sm text-[var(--text-secondary)]">{detailBranch?.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-[var(--bg-surface-hover)] p-3">
                  <p className="text-xs text-[var(--text-tertiary)]">Check-in</p>
                  <p className="text-sm font-semibold">{formatDateTime(detail.start_at)}</p>
                </div>
                <div className="rounded-xl bg-[var(--bg-surface-hover)] p-3">
                  <p className="text-xs text-[var(--text-tertiary)]">Check-out</p>
                  <p className="text-sm font-semibold">{formatDateTime(detail.end_at)}</p>
                </div>
              </div>

              <div className="rounded-xl bg-[var(--bg-surface-hover)] p-3 space-y-2">
                <p className="text-xs text-[var(--text-tertiary)]">Chi tiết giá</p>
                <div className="flex justify-between text-sm"><span>Giá gốc</span><span>{formatVND(detail.subtotal_amount)}</span></div>
                {detail.discount_amount > 0 && <div className="flex justify-between text-sm text-[var(--state-success)]"><span>Giảm giá</span><span>-{formatVND(detail.discount_amount)}</span></div>}
                {detail.addon_amount > 0 && <div className="flex justify-between text-sm"><span>Dịch vụ thêm</span><span>+{formatVND(detail.addon_amount)}</span></div>}
                <div className="border-t border-[var(--border-subtle)] pt-2 flex justify-between font-semibold">
                  <span>Tổng cộng</span><span className="text-[var(--brand-primary)]">{formatVND(detail.total_amount)}</span>
                </div>
              </div>

              {/* Payments */}
              {detailPayments.length > 0 && (
                <div className="rounded-xl bg-[var(--bg-surface-hover)] p-3">
                  <p className="text-xs text-[var(--text-tertiary)] mb-2">Thanh toán</p>
                  {detailPayments.map(p => (
                    <div key={p.id} className="flex items-center justify-between text-sm">
                      <span className="capitalize">{p.provider} - {p.method}</span>
                      <span className={`badge ${p.status === 'paid' ? 'badge-success' : p.status === 'pending' ? 'badge-warning' : 'badge-danger'}`}>
                        {paymentStatusLabel[p.status]}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Cancel info */}
              {detailCancel && (
                <div className="rounded-xl bg-[var(--state-danger-bg)] border border-[var(--state-danger-border)] p-3">
                  <p className="text-xs font-semibold text-[var(--state-danger)]">Đã hủy</p>
                  <p className="text-sm mt-1">Lý do: {detailCancel.reason}</p>
                  <p className="text-sm">Hoàn tiền: {formatVND(detailCancel.refund_amount)} ({detailCancel.refund_percent}%)</p>
                </div>
              )}

              {/* Actions */}
              {(detail.status === 'confirmed' || detail.status === 'pending_payment') && (
                <button className="btn btn-danger w-full btn-sm">Hủy booking</button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookingsPage;
