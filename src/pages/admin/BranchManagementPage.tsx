import React, { useState } from 'react';
import { FiMapPin, FiLayers, FiGrid, FiPlus, FiEdit2 } from 'react-icons/fi';
import { branches, getFloorsByBranch, getWorkspacesByFloor, getWorkspaceType } from '../../data/mockData';

const BranchManagementPage: React.FC = () => {
  const [selectedBranch, setSelectedBranch] = useState(branches[0].id);
  const [selectedFloor, setSelectedFloor] = useState('');
  const branchFloors = getFloorsByBranch(selectedBranch);
  const currentFloor = selectedFloor || branchFloors[0]?.id || '';
  const floorWorkspaces = getWorkspacesByFloor(currentFloor);
  const currentBranch = branches.find(b => b.id === selectedBranch);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Quản lý chi nhánh</p>
            <h1 className="text-xl font-bold font-heading mt-1">Chi nhánh & Không gian</h1>
          </div>
          <button className="btn btn-primary btn-sm"><FiPlus className="h-4 w-4" /> Thêm chi nhánh</button>
        </div>
      </div>

      {/* Branches */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {branches.map(b => (
          <div key={b.id} onClick={() => { setSelectedBranch(b.id); setSelectedFloor(''); }}
            className={`rounded-xl border bg-card p-6 card-interactive cursor-pointer ${selectedBranch === b.id ? 'border-primary ring-1 ring-primary/20' : 'border-border'}`}>
            <div className="flex items-start justify-between">
              <FiMapPin className="h-5 w-5 text-primary" />
              <span className={`badge ${b.status === 'active' ? 'badge-success' : 'badge-neutral'}`}>
                {b.status === 'active' ? 'Hoạt động' : 'Ngưng'}
              </span>
            </div>
            <h3 className="mt-3 font-semibold">{b.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{b.address}</p>
            <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
              <span>Mã: {b.code}</span>
              <span>{b.city}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Floors */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold flex items-center gap-2">
            <FiLayers className="h-4 w-4 text-primary" /> Tầng - {currentBranch?.name}
          </h2>
          <button className="btn btn-secondary btn-sm"><FiPlus className="h-4 w-4" /> Thêm tầng</button>
        </div>
        <div className="flex gap-2 flex-wrap">
          {branchFloors.map(f => (
            <button key={f.id} onClick={() => setSelectedFloor(f.id)}
              className={`btn btn-sm ${currentFloor === f.id ? 'btn-primary' : 'btn-secondary'}`}>
              {f.name}
            </button>
          ))}
        </div>
      </div>

      {/* Workspaces Table */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold flex items-center gap-2">
            <FiGrid className="h-4 w-4 text-primary" /> Workspace
          </h2>
          <button className="btn btn-primary btn-sm"><FiPlus className="h-4 w-4" /> Thêm workspace</button>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã</th><th>Tên</th><th>Loại</th><th>Sức chứa</th><th>SVG ID</th><th>Trạng thái</th><th></th>
              </tr>
            </thead>
            <tbody>
              {floorWorkspaces.map(ws => {
                const wsType = getWorkspaceType(ws.workspace_type_id);
                return (
                  <tr key={ws.id}>
                    <td className="font-mono">{ws.code}</td>
                    <td className="font-medium">{ws.name}</td>
                    <td>{wsType?.name}</td>
                    <td>{ws.capacity}</td>
                    <td className="font-mono text-xs">{ws.svg_element_id}</td>
                    <td>
                      <span className={`badge ${ws.status === 'active' ? 'badge-success' : ws.status === 'maintenance' ? 'badge-warning' : 'badge-neutral'}`}>
                        {ws.status === 'active' ? 'Hoạt động' : ws.status === 'maintenance' ? 'Bảo trì' : 'Ngưng'}
                      </span>
                    </td>
                    <td><button className="btn btn-ghost btn-sm"><FiEdit2 className="h-3.5 w-3.5" /></button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BranchManagementPage;
