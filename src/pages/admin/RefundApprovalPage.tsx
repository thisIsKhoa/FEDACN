import React from 'react';
import { FiRefreshCw, FiCheck, FiX } from 'react-icons/fi';
import { bookingCancellations, bookings, getUser, getWorkspace } from '../../data/mockData';
import { formatVND, formatDateTime } from '../../utils/formatters';

const RefundApprovalPage: React.FC = () => {
  const cancels = bookingCancellations.map(bc => {
    const bk = bookings.find(b => b.id === bc.booking_id);
    const ws = bk ? getWorkspace(bk.workspace_id) : null;
    const customer = bk ? getUser(bk.user_id) : null;
    return { ...bc, booking: bk, workspace: ws, customer };
  });

  const statusBadge: Record<string, string> = { none: 'badge-neutral', pending: 'badge-warning', confirmed: 'badge-success', rejected: 'badge-danger' };
  const statusLabel: Record<string, string> = { none: 'Không hoàn', pending: 'Chờ duyệt', confirmed: 'Đã duyệt', rejected: 'Từ chối' };

  return (
    <div className="space-y-6 page-enter">
      <div className="section-card">
        <p className="section-title">Hoàn tiền</p>
        <h1 className="section-heading">Duyệt yêu cầu hoàn tiền</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Xử lý nội bộ — không thực hiện chuyển khoản qua MoMo</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {cancels.map(c => (
          <div key={c.id} className="section-card card-interactive">
            <div className="flex items-center justify-between">
              <span className={`badge ${statusBadge[c.refund_status]}`}>{statusLabel[c.refund_status]}</span>
              <span className="text-xs text-[var(--text-tertiary)]">{formatDateTime(c.cancelled_at)}</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-[var(--bg-surface-hover)] p-3">
                <p className="text-xs text-[var(--text-tertiary)]">Khách hàng</p>
                <p className="font-medium">{c.customer?.full_name}</p>
              </div>
              <div className="rounded-xl bg-[var(--bg-surface-hover)] p-3">
                <p className="text-xs text-[var(--text-tertiary)]">Workspace</p>
                <p className="font-medium">{c.workspace?.name}</p>
              </div>
            </div>
            <div className="mt-3 rounded-xl bg-[var(--bg-surface-hover)] p-3">
              <p className="text-xs text-[var(--text-tertiary)]">Lý do hủy</p>
              <p className="text-sm mt-1">{c.reason}</p>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-3">
              <div><p className="text-xs text-[var(--text-tertiary)]">Hoàn tiền</p><p className="font-semibold text-[var(--state-success)]">{formatVND(c.refund_amount)}</p></div>
              <div><p className="text-xs text-[var(--text-tertiary)]">Phần trăm</p><p className="font-semibold">{c.refund_percent}%</p></div>
              <div><p className="text-xs text-[var(--text-tertiary)]">Phí hủy</p><p className="font-semibold text-[var(--state-danger)]">{formatVND(c.penalty_amount)}</p></div>
            </div>
            {c.refund_status === 'pending' && (
              <div className="mt-4 flex gap-2">
                <button className="btn btn-primary flex-1 btn-sm"><FiCheck className="h-4 w-4" /> Duyệt</button>
                <button className="btn btn-danger btn-sm"><FiX className="h-4 w-4" /> Từ chối</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {cancels.length === 0 && (
        <div className="section-card text-center py-12">
          <FiRefreshCw className="h-12 w-12 mx-auto text-[var(--text-tertiary)]" />
          <p className="mt-4 font-semibold">Không có yêu cầu hoàn tiền</p>
        </div>
      )}
    </div>
  );
};

export default RefundApprovalPage;
