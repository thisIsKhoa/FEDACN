import React from 'react';
import { FiShield, FiEdit2, FiPlus } from 'react-icons/fi';
import { cancellationPolicies, getBranch, getWorkspaceType } from '../../data/mockData';

const CancellationPoliciesPage: React.FC = () => (
  <div className="space-y-6 page-enter">
    <div className="section-card">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="section-title">Chính sách hủy</p>
          <h1 className="section-heading">Quy định hủy booking & hoàn tiền</h1>
        </div>
        <button className="btn btn-primary btn-sm"><FiPlus className="h-4 w-4" /> Thêm chính sách</button>
      </div>
    </div>

    <div className="section-card overflow-x-auto">
      <table className="data-table">
        <thead>
          <tr><th>Tên</th><th>Loại</th><th>Giá trị min</th><th>Giá trị max</th><th>Hoàn tiền</th><th>Phạm vi</th><th>Trạng thái</th><th></th></tr>
        </thead>
        <tbody>
          {cancellationPolicies.map(cp => (
            <tr key={cp.id}>
              <td className="font-medium">{cp.name}</td>
              <td><span className="badge badge-info">{cp.rule_type === 'GRACE_HOURS' ? 'Giờ ân hạn' : 'Ngày trước'}</span></td>
              <td>{cp.min_value}</td>
              <td>{cp.max_value === 999 ? '∞' : cp.max_value}</td>
              <td><span className={`font-semibold ${cp.refund_percent === 100 ? 'text-[var(--state-success)]' : cp.refund_percent === 0 ? 'text-[var(--state-danger)]' : 'text-[var(--state-warning)]'}`}>{cp.refund_percent}%</span></td>
              <td>{cp.branch_id ? getBranch(cp.branch_id)?.name : <span className="text-[var(--text-tertiary)]">Toàn hệ thống</span>}</td>
              <td><span className={`badge ${cp.is_active ? 'badge-success' : 'badge-neutral'}`}>{cp.is_active ? 'Hoạt động' : 'Tắt'}</span></td>
              <td><button className="btn btn-ghost btn-sm"><FiEdit2 className="h-3.5 w-3.5" /></button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default CancellationPoliciesPage;
