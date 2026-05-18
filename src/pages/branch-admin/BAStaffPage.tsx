import React, { useState } from 'react';
import { FiUsers, FiAlertCircle, FiInfo } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { users as allUsers, type User } from '../../data/mockData';

const BAStaffPage: React.FC = () => {
  const { user } = useAuth();
  const branchId = user!.branchId!;

  const [staffList, setStaffList] = useState<User[]>(
    allUsers.filter((u) => u.role === 'staff' && u.branch_id === branchId)
  );

  const toggleStatus = (userId: string) => {
    setStaffList((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' }
          : u
      )
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Quản lý chi nhánh</p>
          <h1 className="text-xl font-bold font-heading mt-1">Nhân viên</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {staffList.length} nhân viên tại chi nhánh này ·{' '}
            <span className="text-emerald-600 dark:text-emerald-400">
              {staffList.filter((u) => u.status === 'active').length} đang hoạt động
            </span>
          </p>
        </div>
      </div>

      {/* Info note */}
      <div className="flex items-start gap-2 text-sm text-muted-foreground rounded-lg border border-border bg-muted/50 p-4">
        <FiInfo className="h-4 w-4 mt-0.5 text-primary shrink-0" />
        <p>Bạn có thể bật/tắt trạng thái nhân viên. Để thêm hoặc phân công nhân viên, liên hệ Super Admin.</p>
      </div>

      {/* Staff list */}
      {staffList.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-10 flex flex-col items-center gap-3 text-muted-foreground">
          <FiUsers className="h-10 w-10 opacity-30" />
          <p className="text-sm font-medium">Chưa có nhân viên nào được phân công.</p>
          <p className="text-xs">Liên hệ Super Admin để phân công nhân viên cho chi nhánh này.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nhân viên</th>
                  <th>Email</th>
                  <th>Điện thoại</th>
                  <th>Thành viên</th>
                  <th className="text-center">Trạng thái</th>
                  <th className="text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {staffList.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {s.full_name.charAt(0)}
                        </div>
                        <span className="font-medium">{s.full_name}</span>
                      </div>
                    </td>
                    <td className="text-muted-foreground">{s.email}</td>
                    <td className="font-mono text-sm">{s.phone}</td>
                    <td>
                      <span className={`badge ${s.membership_tier === 'premium' ? 'badge-warning' : 'badge-neutral'}`}>
                        {s.membership_tier === 'premium' ? 'Premium' : 'Standard'}
                      </span>
                    </td>
                    <td className="text-center">
                      <span className={`badge ${s.status === 'active' ? 'badge-success' : 'badge-neutral'}`}>
                        {s.status === 'active' ? 'Hoạt động' : 'Tạm ngưng'}
                      </span>
                    </td>
                    <td className="text-right">
                      <button
                        onClick={() => {
                          if (s.status === 'active') {
                            if (confirm(`Tạm ngưng nhân viên ${s.full_name}?`)) toggleStatus(s.id);
                          } else {
                            toggleStatus(s.id);
                          }
                        }}
                        className={`btn btn-sm ${
                          s.status === 'active'
                            ? 'btn-secondary text-destructive hover:bg-destructive/10 hover:text-destructive'
                            : 'btn-primary'
                        }`}
                      >
                        {s.status === 'active' ? 'Tạm ngưng' : 'Kích hoạt'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Alert if no active staff */}
      {staffList.length > 0 && staffList.every((s) => s.status === 'suspended') && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400">
          <FiAlertCircle className="h-4 w-4 shrink-0" />
          Tất cả nhân viên đang bị tạm ngưng. Chi nhánh không có ai trực.
        </div>
      )}
    </div>
  );
};

export default BAStaffPage;
