import React from 'react';
import { FiTool, FiCalendar, FiAlertTriangle } from 'react-icons/fi';
import { workspaceMaintenances, getWorkspace } from '../../data/mockData';
import { formatDateTime, maintenanceStatusLabel } from '../../utils/formatters';

const MaintenancePage: React.FC = () => {
  const statusColor: Record<string, string> = {
    scheduled: 'badge-info', active: 'badge-warning', done: 'badge-success', canceled: 'badge-neutral',
  };

  return (
    <div className="space-y-6 page-enter">
      <div className="section-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="section-title">Bảo trì</p>
            <h1 className="section-heading">Lịch bảo trì workspace</h1>
          </div>
          <button className="btn btn-primary btn-sm"><FiCalendar className="h-4 w-4" /> Tạo lịch bảo trì</button>
        </div>
      </div>

      <div className="section-card overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Workspace</th>
              <th>Bắt đầu</th>
              <th>Kết thúc</th>
              <th>Lý do</th>
              <th>Trạng thái</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {workspaceMaintenances.map(wm => {
              const ws = getWorkspace(wm.workspace_id);
              return (
                <tr key={wm.id}>
                  <td className="font-medium">{ws?.name} <span className="text-xs text-[var(--text-tertiary)]">({ws?.code})</span></td>
                  <td>{formatDateTime(wm.start_at)}</td>
                  <td>{formatDateTime(wm.end_at)}</td>
                  <td>{wm.reason}</td>
                  <td><span className={`badge ${statusColor[wm.status]}`}>{maintenanceStatusLabel[wm.status]}</span></td>
                  <td>
                    {wm.status === 'scheduled' && <button className="btn btn-secondary btn-sm">Bắt đầu</button>}
                    {wm.status === 'active' && <button className="btn btn-primary btn-sm">Hoàn tất</button>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MaintenancePage;
