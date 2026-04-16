import React, { useState } from 'react';
import { FiHash, FiCheckCircle, FiAlertCircle, FiLogIn, FiLogOut, FiClock } from 'react-icons/fi';
import { bookings, checkinLogs, getWorkspace, getUser } from '../../data/mockData';
import { formatDateTime, formatTime, bookingStatusLabel } from '../../utils/formatters';

const CheckInPage: React.FC = () => {
  const [code, setCode] = useState('');
  const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const activeCheckins = checkinLogs.filter(ci => !ci.checkout_at).map(ci => {
    const bk = bookings.find(b => b.id === ci.booking_id);
    const ws = bk ? getWorkspace(bk.workspace_id) : null;
    const customer = bk ? getUser(bk.user_id) : null;
    return { ...ci, booking: bk, workspace: ws, customer };
  });

  const handleCheckin = () => {
    setLoading(true);
    setTimeout(() => {
      const bk = bookings.find(b => b.booking_code.toUpperCase() === code.toUpperCase().trim());
      if (!bk) {
        setResult({ type: 'error', message: 'Không tìm thấy booking với mã này' });
      } else if (bk.status !== 'confirmed') {
        setResult({ type: 'error', message: `Booking ở trạng thái "${bookingStatusLabel[bk.status]}" - không thể check-in` });
      } else if (checkinLogs.some(ci => ci.booking_id === bk.id && !ci.checkout_at)) {
        setResult({ type: 'error', message: 'Booking này đã được check-in rồi' });
      } else {
        setResult({ type: 'success', message: `Check-in thành công! ${getWorkspace(bk.workspace_id)?.name} - ${getUser(bk.user_id)?.full_name}` });
      }
      setLoading(false);
    }, 800);
  };

  const handleCheckout = (ciId: string) => {
    const ci = checkinLogs.find(c => c.id === ciId);
    if (ci) ci.checkout_at = new Date().toISOString();
    setResult({ type: 'success', message: 'Check-out thành công!' });
  };

  return (
    <div className="space-y-6 page-enter">
      <div className="section-card">
        <p className="section-title">Check-in / Check-out</p>
        <h1 className="section-heading">Quản lý check-in</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Nhập mã booking để check-in khách hàng</p>
      </div>

      {/* Check-in form */}
      <div className="section-card max-w-xl">
        <h2 className="font-semibold flex items-center gap-2">
          <FiLogIn className="h-4 w-4 text-[var(--brand-primary)]" /> Check-in mới
        </h2>
        <div className="mt-4 flex gap-3">
          <div className="relative flex-1">
            <FiHash className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] h-4 w-4" />
            <input type="text" value={code} onChange={e => setCode(e.target.value.toUpperCase())}
              placeholder="Nhập mã booking (VD: WH-A3K7P2)"
              className="input-field pl-10 font-mono text-lg tracking-wider uppercase"
              onKeyDown={e => e.key === 'Enter' && handleCheckin()} />
          </div>
          <button onClick={handleCheckin} disabled={!code.trim() || loading} className="btn btn-primary">
            {loading ? <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FiCheckCircle className="h-4 w-4" />}
            Check-in
          </button>
        </div>

        {result && (
          <div className={`mt-4 rounded-xl p-4 flex items-start gap-3 slide-in-up ${
            result.type === 'success' ? 'bg-[var(--state-success-bg)] border border-[var(--state-success-border)]' : 'bg-[var(--state-danger-bg)] border border-[var(--state-danger-border)]'
          }`}>
            {result.type === 'success'
              ? <FiCheckCircle className="h-5 w-5 text-[var(--state-success)] shrink-0 mt-0.5" />
              : <FiAlertCircle className="h-5 w-5 text-[var(--state-danger)] shrink-0 mt-0.5" />}
            <p className={`text-sm font-medium ${result.type === 'success' ? 'text-[var(--state-success)]' : 'text-[var(--state-danger)]'}`}>
              {result.message}
            </p>
          </div>
        )}
      </div>

      {/* Active check-ins */}
      <div className="section-card">
        <h2 className="font-semibold flex items-center gap-2">
          <FiClock className="h-4 w-4 text-[var(--state-success)]" /> Đang check-in ({activeCheckins.length})
        </h2>
        <div className="mt-4">
          {activeCheckins.length === 0 ? (
            <p className="text-sm text-[var(--text-secondary)] text-center py-8">Không có khách nào đang check-in</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Khách hàng</th>
                    <th>Mã booking</th>
                    <th>Workspace</th>
                    <th>Check-in lúc</th>
                    <th>Dự kiến kết thúc</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {activeCheckins.map(ci => (
                    <tr key={ci.id}>
                      <td className="font-medium">{ci.customer?.full_name}</td>
                      <td className="font-mono">{ci.booking?.booking_code}</td>
                      <td>{ci.workspace?.name}</td>
                      <td>{formatDateTime(ci.checkin_at)}</td>
                      <td>{ci.booking ? formatTime(ci.booking.end_at) : '—'}</td>
                      <td>
                        <button onClick={() => handleCheckout(ci.id)} className="btn btn-danger btn-sm">
                          <FiLogOut className="h-3.5 w-3.5" /> Check-out
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckInPage;
