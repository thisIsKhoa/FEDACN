import React, { useState } from 'react';
import { FiSearch, FiEdit2, FiShield, FiUsers, FiCheckCircle, FiXCircle, FiStar } from 'react-icons/fi';
import { users, getBranch } from '../../data/mockData';
import { EmptyState } from '../../components/ui/EmptyState';
import { Skeleton } from '../../components/ui/Skeleton';

const UserManagementPage: React.FC = () => {
  const [roleFilter, setRoleFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    // Simulate network delay to demonstrate Skeleton loaders
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filtered = users.filter(u => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (search && !u.full_name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const roleLabel: Record<string, string> = { admin: 'Quản trị viên', staff: 'Nhân viên', customer: 'Khách hàng' };
  const roleBadge: Record<string, string> = { admin: 'badge-danger', staff: 'badge-info', customer: 'badge-neutral' };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="rounded-xl border border-border bg-card p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Quản lý người dùng</p>
        <h1 className="text-xl font-bold font-heading mt-1">Người dùng hệ thống</h1>
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
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Tìm theo tên hoặc email..."
              className="input-field !pl-10" />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr><th>Người dùng</th><th>Vai trò</th><th>Chi nhánh</th><th>Hạng</th><th>Trạng thái</th><th></th></tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={`skel-${i}`}>
                  <td><div className="flex items-center gap-3"><Skeleton className="h-9 w-9 rounded-xl" /><div className="space-y-2"><Skeleton className="h-4 w-32" /><Skeleton className="h-3 w-24" /></div></div></td>
                  <td><Skeleton className="h-6 w-24 rounded-full" /></td>
                  <td><Skeleton className="h-4 w-20" /></td>
                  <td><Skeleton className="h-6 w-20 rounded-full" /></td>
                  <td><Skeleton className="h-6 w-24 rounded-full" /></td>
                  <td><Skeleton className="h-8 w-8 rounded-lg" /></td>
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12">
                  <EmptyState 
                    icon={FiUsers} 
                    title="Không tìm thấy người dùng" 
                    description={search ? `Không có kết quả nào cho "${search}"` : "Hệ thống chưa có người dùng nào trong nhóm này."} 
                  />
                </td>
              </tr>
            ) : (
              filtered.map(u => {
                const branch = u.branch_id ? getBranch(u.branch_id) : null;
                return (
                  <tr key={u.id}>
                    <td className="max-w-[200px]">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                          {u.full_name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium truncate" title={u.full_name}>{u.full_name}</p>
                          <p className="text-xs text-muted-foreground truncate" title={u.email}>{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td><span className={`badge ${roleBadge[u.role]}`}><FiShield className="h-3 w-3" /> {roleLabel[u.role]}</span></td>
                    <td className="max-w-[150px]"><div className="truncate" title={branch?.name}>{branch ? branch.name : <span className="text-muted-foreground">—</span>}</div></td>
                    <td>
                      <span className={`badge ${u.membership_tier === 'premium' ? 'badge-warning' : 'badge-neutral'}`}>
                        {u.membership_tier === 'premium' && <FiStar className="h-3.5 w-3.5" />}
                        {u.membership_tier === 'premium' ? 'Premium' : 'Tiêu chuẩn'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${u.status === 'active' ? 'badge-success' : 'badge-danger'}`}>
                        {u.status === 'active' ? <FiCheckCircle className="h-3.5 w-3.5" /> : <FiXCircle className="h-3.5 w-3.5" />}
                        {u.status === 'active' ? 'Hoạt động' : 'Tạm khóa'}
                      </span>
                    </td>
                    <td><button className="btn btn-ghost btn-sm"><FiEdit2 className="h-3.5 w-3.5" /></button></td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagementPage;
