import React, { useState } from 'react';
import { FiSearch, FiCode } from 'react-icons/fi';
import { auditLogs, getUser } from '../../data/mockData';
import { formatDateTime } from '../../utils/formatters';

const AuditLogPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = auditLogs.filter(l => {
    if (!search) return true;
    return l.action.toLowerCase().includes(search.toLowerCase()) || l.target_table.toLowerCase().includes(search.toLowerCase());
  }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const actionColor: Record<string, string> = {
    CREATE_BOOKING: 'badge-success', CHECKIN: 'badge-info', UPDATE_PRICE: 'badge-warning',
    CONFIRM_PAYMENT: 'badge-success', CANCEL_BOOKING: 'badge-danger',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="rounded-xl border border-border bg-card p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Kiểm toán</p>
        <h1 className="text-xl font-bold font-heading mt-1">Nhật ký hệ thống</h1>
        <div className="mt-4 relative max-w-md">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm theo hành động hoặc bảng..." className="input-field !pl-10" />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 overflow-x-auto">
        <table className="data-table">
          <thead><tr><th>Thời gian</th><th>Người thực hiện</th><th>Vai trò</th><th>Hành động</th><th>Bảng</th><th>ID</th><th></th></tr></thead>
          <tbody>
            {filtered.map(l => {
              const actor = getUser(l.actor_user_id);
              return (
                <React.Fragment key={l.id}>
                  <tr className="cursor-pointer" onClick={() => setExpandedId(expandedId === l.id ? null : l.id)}>
                    <td className="text-sm">{formatDateTime(l.created_at)}</td>
                    <td className="font-medium">{actor?.full_name || l.actor_user_id}</td>
                    <td><span className="badge badge-neutral capitalize">{l.actor_role}</span></td>
                    <td><span className={`badge ${actionColor[l.action] || 'badge-neutral'}`}>{l.action}</span></td>
                    <td className="font-mono text-xs">{l.target_table}</td>
                    <td className="font-mono text-xs">{l.target_id}</td>
                    <td><FiCode className={`h-4 w-4 transition-transform ${expandedId === l.id ? 'rotate-90' : ''}`} /></td>
                  </tr>
                  {expandedId === l.id && (
                    <tr><td colSpan={7} className="!bg-muted"><pre className="text-xs font-mono overflow-x-auto p-2">{JSON.stringify(l.metadata, null, 2)}</pre></td></tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditLogPage;
