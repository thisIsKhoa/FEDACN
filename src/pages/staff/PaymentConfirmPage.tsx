import React, { useMemo, useState } from 'react';
import { FiDollarSign, FiCheck, FiX } from 'react-icons/fi';
import { payments, bookings, getWorkspace, getUser } from '../../data/mockData';
import { formatVND, formatDateTime } from '../../utils/formatters';

const PaymentConfirmPage: React.FC = () => {
  const [confirming, setConfirming] = useState<string | null>(null);

  const pendingCash = useMemo(() =>
    payments.filter(p => p.status === 'pending').map(p => {
      const bk = bookings.find(b => b.id === p.booking_id);
      const ws = bk ? getWorkspace(bk.workspace_id) : null;
      const customer = bk ? getUser(bk.user_id) : null;
      return { ...p, booking: bk, workspace: ws, customer };
    }), []);

  const handleConfirm = (paymentId: string) => {
    setConfirming(paymentId);
    setTimeout(() => setConfirming(null), 1500);
  };

  return (
    <div className="space-y-6 page-enter">
      <div className="section-card">
        <p className="section-title">Xác nhận thanh toán</p>
        <h1 className="section-heading">Thanh toán tiền mặt</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Xác nhận các khoản thanh toán tiền mặt từ khách hàng</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pendingCash.map(p => (
          <div key={p.id} className="section-card card-interactive">
            <div className="flex items-center justify-between">
              <span className="badge badge-warning">Chờ xác nhận</span>
              <span className="text-xs text-[var(--text-tertiary)] font-mono">{p.order_id}</span>
            </div>

            <div className="mt-4">
              <p className="text-2xl font-bold text-[var(--brand-primary)]">{formatVND(p.amount)}</p>
              <p className="text-sm text-[var(--text-secondary)] mt-1 capitalize">{p.provider} · {p.method}</p>
            </div>

            <div className="mt-4 space-y-2 rounded-xl bg-[var(--bg-surface-hover)] p-3">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-tertiary)]">Khách hàng</span>
                <span className="font-medium">{p.customer?.full_name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-tertiary)]">Workspace</span>
                <span className="font-medium">{p.workspace?.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-tertiary)]">Booking</span>
                <span className="font-mono">{p.booking?.booking_code}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-tertiary)]">Thời gian tạo</span>
                <span>{formatDateTime(p.created_at)}</span>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button onClick={() => handleConfirm(p.id)}
                disabled={confirming === p.id}
                className="btn btn-primary flex-1 btn-sm">
                {confirming === p.id ? (
                  <><span className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Đang xử lý...</>
                ) : (
                  <><FiCheck className="h-4 w-4" /> Xác nhận đã thu</>
                )}
              </button>
              <button className="btn btn-ghost btn-sm"><FiX className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>

      {pendingCash.length === 0 && (
        <div className="section-card text-center py-12">
          <FiDollarSign className="h-12 w-12 mx-auto text-[var(--text-tertiary)]" />
          <p className="mt-4 font-semibold">Không có thanh toán nào cần xác nhận</p>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">Tất cả thanh toán đã được xử lý</p>
        </div>
      )}
    </div>
  );
};

export default PaymentConfirmPage;
