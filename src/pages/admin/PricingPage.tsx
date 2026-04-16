import React from 'react';
import { FiDollarSign, FiEdit2, FiPlus } from 'react-icons/fi';
import { pricePolicies, workspaceTypes, branches, getWorkspaceType, getBranch } from '../../data/mockData';
import { formatVND, durationUnitLabel } from '../../utils/formatters';

const PricingPage: React.FC = () => (
  <div className="space-y-6 page-enter">
    <div className="section-card">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="section-title">Cấu hình giá</p>
          <h1 className="section-heading">Bảng giá dịch vụ</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Quản lý giá theo loại workspace, thời lượng và chi nhánh</p>
        </div>
        <button className="btn btn-primary btn-sm"><FiPlus className="h-4 w-4" /> Thêm chính sách giá</button>
      </div>
    </div>

    <div className="section-card overflow-x-auto">
      <table className="data-table">
        <thead>
          <tr>
            <th>Loại workspace</th>
            <th>Đơn vị thời gian</th>
            <th>Chi nhánh</th>
            <th>Giá</th>
            <th>Trạng thái</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {pricePolicies.map(pp => {
            const wsType = getWorkspaceType(pp.workspace_type_id);
            const branch = pp.branch_id ? getBranch(pp.branch_id) : null;
            return (
              <tr key={pp.id}>
                <td className="font-medium">{wsType?.name}</td>
                <td>{durationUnitLabel[pp.duration_unit]}</td>
                <td>{branch ? <span className="badge badge-info">{branch.name}</span> : <span className="text-[var(--text-tertiary)]">Toàn hệ thống</span>}</td>
                <td className="font-semibold text-[var(--brand-primary)]">{formatVND(pp.price)}</td>
                <td><span className={`badge ${pp.is_active ? 'badge-success' : 'badge-neutral'}`}>{pp.is_active ? 'Đang áp dụng' : 'Tạm ngưng'}</span></td>
                <td><button className="btn btn-ghost btn-sm"><FiEdit2 className="h-3.5 w-3.5" /></button></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

export default PricingPage;
