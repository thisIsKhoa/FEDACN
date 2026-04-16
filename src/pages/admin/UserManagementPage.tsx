import React, { useState } from 'react';
import { FiUsers, FiSearch, FiEdit2, FiShield } from 'react-icons/fi';
import { users, getBranch } from '../../data/mockData';

const UserManagementPage: React.FC = () => {
  const [roleFilter, setRoleFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = users.filter(u => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (search && !u.full_name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const roleLabel: Record<string, string> = { admin: 'Quản trị viên', staff: 'Nhân viên', customer: 'Khách hàng' };
  const roleBadge: Record<string, string> = { admin: 'badge-danger', staff: 'badge-info', customer: 'badge-neutral' };

  return (
    <div className="space-y-6 page-enter">
      <div className="section-card">
        <p className="section-title">Quản lý người dùng</p>
        <h1 className="section-heading">Người dùng hệ thống</h1>
        <div className="mt-4 flex flex-wrap gap-3 items-center">
          <div className="flex gap-2">
            {['all', 'customer', 'staff', 'admin'].map(r => (
              <button key={r} onClick={() => setRoleFilter(r)}
                className={`btn btn-sm ${roleFilter === r ? 'btn-primary' : 'btn-secondary'}`}>
                {r === 'all' ? 'Tất cả' : roleLabel[r]}
              </button>
            ))}
          </div>
          <div className="relative flex-1 min-w-[200px]">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] h-4 w-4" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Tìm theo tên hoặc email..."
              className="input-field pl-10" />
          </div>
        </div>
      </div>

      <div className="section-card overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr><th>Người dùng</th><th>Vai trò</th><th>Chi nhánh</th><th>Hạng</th><th>Trạng thái</th><th></th></tr>
          </thead>
          <tbody>
            {filtered.map(u => {
              const branch = u.branch_id ? getBranch(u.branch_id) : null;
              return (
                <tr key={u.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-secondary)] flex items-center justify-center text-white text-sm font-bold shrink-0">
                        {u.full_name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{u.full_name}</p>
                        <p className="text-xs text-[var(--text-secondary)]">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td><span className={`badge ${roleBadge[u.role]}`}><FiShield className="h-3 w-3" /> {roleLabel[u.role]}</span></td>
                  <td>{branch ? branch.name : <span className="text-[var(--text-tertiary)]">—</span>}</td>
                  <td><span className={`badge ${u.membership_tier === 'premium' ? 'badge-warning' : 'badge-neutral'}`}>{u.membership_tier === 'premium' ? 'Premium' : 'Tiêu chuẩn'}</span></td>
                  <td><span className={`badge ${u.status === 'active' ? 'badge-success' : 'badge-danger'}`}>{u.status === 'active' ? 'Hoạt động' : 'Tạm khóa'}</span></td>
                  <td><button className="btn btn-ghost btn-sm"><FiEdit2 className="h-3.5 w-3.5" /></button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagementPage;
