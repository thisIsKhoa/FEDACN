import React from 'react';
import { FiCoffee, FiEdit2, FiPlus, FiPrinter } from 'react-icons/fi';
import { extraServices } from '../../data/mockData';
import { formatVND } from '../../utils/formatters';

const ExtraServicesPage: React.FC = () => {
  const typeIcon: Record<string, React.ReactNode> = {
    drink: <FiCoffee className="h-4 w-4" />,
    meal: <span className="text-sm">🍽️</span>,
    printing: <FiPrinter className="h-4 w-4" />,
    other: <span className="text-sm">📦</span>,
  };
  const typeLabel: Record<string, string> = { drink: 'Đồ uống', meal: 'Ăn uống', printing: 'In ấn', other: 'Khác' };

  return (
    <div className="space-y-6 page-enter">
      <div className="section-card">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="section-title">Dịch vụ bổ sung</p>
            <h1 className="section-heading">Quản lý dịch vụ thêm</h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">Đồ uống, ăn trưa, in ấn, tủ khóa...</p>
          </div>
          <button className="btn btn-primary btn-sm"><FiPlus className="h-4 w-4" /> Thêm dịch vụ</button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {extraServices.map(es => (
          <div key={es.id} className="section-card card-interactive">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--brand-primary-light)]">
                  {typeIcon[es.service_type]}
                </div>
                <div>
                  <h3 className="font-semibold">{es.name}</h3>
                  <p className="text-xs text-[var(--text-secondary)]">{typeLabel[es.service_type]}</p>
                </div>
              </div>
              <span className={`badge ${es.is_active ? 'badge-success' : 'badge-neutral'}`}>
                {es.is_active ? 'Hoạt động' : 'Tắt'}
              </span>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-[var(--text-tertiary)]">Giá / {es.unit}</p>
                <p className="text-lg font-bold text-[var(--brand-primary)]">{formatVND(es.price)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-[var(--text-tertiary)]">Mã</p>
                <p className="font-mono text-sm">{es.code}</p>
              </div>
            </div>
            <button className="btn btn-secondary btn-sm w-full mt-4"><FiEdit2 className="h-3.5 w-3.5" /> Chỉnh sửa</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExtraServicesPage;
