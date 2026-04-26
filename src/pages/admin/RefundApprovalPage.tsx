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
    <div className="space-y-6 animate-fade-in">
      <div className="rounded-xl border border-border bg-card p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Hoàn tiền</p>
        <h1 className="text-xl font-bold font-heading mt-1">Duyệt yêu cầu hoàn tiền</h1>
        <p className="text-sm text-muted-foreground mt-1">Xử lý nội bộ — không thực hiện chuyển khoản qua MoMo</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {cancels.map(c => (
          <div key={c.id} className="rounded-xl border border-border bg-card p-6 card-interactive">
            <div className="flex items-center justify-between">
              <span className={`badge ${statusBadge[c.refund_status]}`}>{statusLabel[c.refund_status]}</span>
              <span className="text-xs text-muted-foreground">{formatDateTime(c.cancelled_at)}</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-muted p-3">
                <p className="text-xs text-muted-foreground">Khách hàng</p>
                <p className="font-medium">{c.customer?.full_name}</p>
              </div>
              <div className="rounded-xl bg-muted p-3">
                <p className="text-xs text-muted-foreground">Workspace</p>
                <p className="font-medium">{c.workspace?.name}</p>
              </div>
            </div>
            <div className="mt-3 rounded-xl bg-muted p-3">
              <p className="text-xs text-muted-foreground">Lý do hủy</p>
              <p className="text-sm mt-1">{c.reason}</p>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-3">
              <div><p className="text-xs text-muted-foreground">Hoàn tiền</p><p className="font-semibold text-success">{formatVND(c.refund_amount)}</p></div>
              <div><p className="text-xs text-muted-foreground">Phần trăm</p><p className="font-semibold">{c.refund_percent}%</p></div>
              <div><p className="text-xs text-muted-foreground">Phí hủy</p><p className="font-semibold text-destructive">{formatVND(c.penalty_amount)}</p></div>
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
        <div className="rounded-xl border border-border bg-card text-center py-12 p-6">
          <FiRefreshCw className="h-12 w-12 mx-auto text-muted-foreground" />
          <p className="mt-4 font-semibold">Không có yêu cầu hoàn tiền</p>
        </div>
      )}
    </div>
  );
};

export default RefundApprovalPage;
