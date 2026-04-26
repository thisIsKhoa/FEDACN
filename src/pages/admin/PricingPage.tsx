import React, { useState, useEffect } from 'react';
import { FiDollarSign, FiEdit2, FiPlus, FiCheckCircle, FiXCircle, FiInbox } from 'react-icons/fi';
import { EmptyState } from '../../components/ui/EmptyState';
import { Skeleton } from '../../components/ui/Skeleton';
import { pricePolicies, getBranch, getWorkspaceType } from '../../data/mockData';
import { formatVND, durationUnitLabel } from '../../utils/formatters';

const PricingPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
  <div className="space-y-6 animate-fade-in">
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Cấu hình giá</p>
          <h1 className="text-xl font-bold font-heading mt-1">Bảng giá dịch vụ</h1>
          <p className="text-sm text-muted-foreground mt-1">Quản lý giá theo loại workspace, thời lượng và chi nhánh</p>
        </div>
        <button className="btn btn-primary btn-sm"><FiPlus className="h-4 w-4" /> Thêm chính sách giá</button>
      </div>
    </div>

    <div className="rounded-xl border border-border bg-card p-6 overflow-x-auto">
      <table className="data-table">
        <thead>
          <tr><th>Loại workspace</th><th>Đơn vị thời gian</th><th>Chi nhánh</th><th>Giá</th><th>Trạng thái</th><th></th></tr>
        </thead>
        <tbody>
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <tr key={`skel-${i}`}>
                <td><Skeleton className="h-4 w-32" /></td>
                <td><Skeleton className="h-4 w-20" /></td>
                <td><Skeleton className="h-6 w-24 rounded-full" /></td>
                <td><Skeleton className="h-4 w-20" /></td>
                <td><Skeleton className="h-6 w-28 rounded-full" /></td>
                <td><Skeleton className="h-8 w-8 rounded-lg" /></td>
              </tr>
            ))
          ) : pricePolicies.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-12">
                <EmptyState 
                  icon={FiInbox} 
                  title="Chưa có chính sách giá" 
                  description="Bấm 'Thêm chính sách giá' để thiết lập bảng giá cho hệ thống." 
                />
              </td>
            </tr>
          ) : (
            pricePolicies.map(pp => {
              const wsType = getWorkspaceType(pp.workspace_type_id);
              const branch = pp.branch_id ? getBranch(pp.branch_id) : null;
              return (
                <tr key={pp.id}>
                  <td className="font-medium max-w-[150px]"><div className="truncate" title={wsType?.name}>{wsType?.name}</div></td>
                  <td>{durationUnitLabel[pp.duration_unit]}</td>
                  <td className="max-w-[150px]"><div className="truncate" title={branch?.name}>{branch ? <span className="badge badge-info">{branch.name}</span> : <span className="text-muted-foreground">Toàn hệ thống</span>}</div></td>
                  <td className="font-semibold text-primary">{formatVND(pp.price)}</td>
                  <td>
                    <span className={`badge ${pp.is_active ? 'badge-success' : 'badge-neutral'}`}>
                      {pp.is_active ? <FiCheckCircle className="h-3.5 w-3.5" /> : <FiXCircle className="h-3.5 w-3.5" />}
                      {pp.is_active ? 'Đang áp dụng' : 'Tạm ngưng'}
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

export default PricingPage;
