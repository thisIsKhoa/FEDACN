import React, { useState } from 'react';
import {
  FiLayers, FiGrid, FiPlus, FiEdit2, FiX, FiCheck, FiAlertCircle, FiTrash2,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import {
  floors as allFloors, workspaces as allWorkspaces, workspaceTypes,
  type Floor, type Workspace,
} from '../../data/mockData';

/* ── Modal shell ── */
const Modal: React.FC<{ title: string; onClose: () => void; children: React.ReactNode }> = ({
  title, onClose, children,
}) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
    onClick={onClose}
  >
    <div
      className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md animate-scale-in"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <h2 className="text-base font-bold font-heading">{title}</h2>
        <button onClick={onClose} className="btn btn-ghost btn-sm p-1" aria-label="Đóng">
          <FiX className="h-4 w-4" />
        </button>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  </div>
);

type ModalMode =
  | { type: 'add-floor' }
  | { type: 'edit-floor'; floor: Floor }
  | { type: 'add-ws'; floorId: string }
  | { type: 'edit-ws'; ws: Workspace }
  | null;

const BAWorkspacePage: React.FC = () => {
  const { user } = useAuth();
  const branchId = user!.branchId!;

  // Local state (simulates real CRUD)
  const [localFloors, setLocalFloors] = useState<Floor[]>(() =>
    allFloors.filter((f) => f.branch_id === branchId)
  );
  const [localWorkspaces, setLocalWorkspaces] = useState<Workspace[]>(() =>
    allWorkspaces.filter((w) => allFloors.filter(f => f.branch_id === branchId).some((f) => f.id === w.floor_id))
  );

  const [selectedFloorId, setSelectedFloorId] = useState<string>(() => localFloors[0]?.id ?? '');
  const [modal, setModal] = useState<ModalMode>(null);

  // Form state
  const [floorForm, setFloorForm] = useState({ floor_no: '', name: '', svg_url: '' });
  const [wsForm, setWsForm] = useState({ code: '', name: '', workspace_type_id: '', capacity: '1', status: 'active' as Workspace['status'] });

  const currentFloor = localFloors.find((f) => f.id === selectedFloorId);
  const floorWorkspaces = localWorkspaces.filter((w) => w.floor_id === selectedFloorId);

  const openFloorModal = (mode: 'add' | 'edit', floor?: Floor) => {
    if (mode === 'add') {
      setFloorForm({ floor_no: String(localFloors.length + 1), name: '', svg_url: '' });
      setModal({ type: 'add-floor' });
    } else if (floor) {
      setFloorForm({ floor_no: String(floor.floor_no), name: floor.name, svg_url: floor.svg_url });
      setModal({ type: 'edit-floor', floor });
    }
  };

  const openWsModal = (mode: 'add' | 'edit', ws?: Workspace) => {
    if (mode === 'add') {
      setWsForm({ code: '', name: '', workspace_type_id: workspaceTypes[0]?.id ?? '', capacity: '1', status: 'active' });
      setModal({ type: 'add-ws', floorId: selectedFloorId });
    } else if (ws) {
      setWsForm({ code: ws.code, name: ws.name, workspace_type_id: ws.workspace_type_id, capacity: String(ws.capacity), status: ws.status });
      setModal({ type: 'edit-ws', ws });
    }
  };

  const saveFloor = () => {
    if (!floorForm.name.trim()) return;
    if (modal?.type === 'add-floor') {
      const newFloor: Floor = {
        id: `floor-new-${Date.now()}`,
        branch_id: branchId,
        floor_no: parseInt(floorForm.floor_no) || localFloors.length + 1,
        name: floorForm.name,
        svg_url: floorForm.svg_url || '/floorplans/default.svg',
        map_version: 1,
        is_published: true,
      };
      setLocalFloors((prev) => [...prev, newFloor]);
      setSelectedFloorId(newFloor.id);
    } else if (modal?.type === 'edit-floor') {
      setLocalFloors((prev) =>
        prev.map((f) =>
          f.id === modal.floor.id
            ? { ...f, name: floorForm.name, floor_no: parseInt(floorForm.floor_no) || f.floor_no, svg_url: floorForm.svg_url || f.svg_url }
            : f
        )
      );
    }
    setModal(null);
  };

  const deleteFloor = (floorId: string) => {
    setLocalFloors((prev) => prev.filter((f) => f.id !== floorId));
    setLocalWorkspaces((prev) => prev.filter((w) => w.floor_id !== floorId));
    if (selectedFloorId === floorId) {
      const remaining = localFloors.filter((f) => f.id !== floorId);
      setSelectedFloorId(remaining[0]?.id ?? '');
    }
  };

  const saveWorkspace = () => {
    if (!wsForm.code.trim() || !wsForm.name.trim()) return;
    if (modal?.type === 'add-ws') {
      const newWs: Workspace = {
        id: `ws-new-${Date.now()}`,
        floor_id: modal.floorId,
        workspace_type_id: wsForm.workspace_type_id,
        code: wsForm.code,
        name: wsForm.name,
        capacity: parseInt(wsForm.capacity) || 1,
        svg_element_id: `svg-${wsForm.code.toLowerCase()}`,
        status: wsForm.status,
      };
      setLocalWorkspaces((prev) => [...prev, newWs]);
    } else if (modal?.type === 'edit-ws') {
      setLocalWorkspaces((prev) =>
        prev.map((w) =>
          w.id === modal.ws.id
            ? { ...w, code: wsForm.code, name: wsForm.name, workspace_type_id: wsForm.workspace_type_id, capacity: parseInt(wsForm.capacity) || 1, status: wsForm.status }
            : w
        )
      );
    }
    setModal(null);
  };

  const toggleWsStatus = (wsId: string) => {
    setLocalWorkspaces((prev) =>
      prev.map((w) =>
        w.id === wsId ? { ...w, status: w.status === 'active' ? 'inactive' : 'active' } : w
      )
    );
  };

  const statusBadge = (status: Workspace['status']) =>
    status === 'active' ? 'badge-success' : status === 'maintenance' ? 'badge-warning' : 'badge-neutral';
  const statusLabel = (status: Workspace['status']) =>
    status === 'active' ? 'Hoạt động' : status === 'maintenance' ? 'Bảo trì' : 'Ngưng';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Quản lý chi nhánh</p>
            <h1 className="text-xl font-bold font-heading mt-1">Floors & Workspaces</h1>
            <p className="text-sm text-muted-foreground mt-1">{localFloors.length} tầng · {localWorkspaces.length} workspace</p>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => openFloorModal('add')}>
            <FiPlus className="h-4 w-4" /> Thêm tầng
          </button>
        </div>
      </div>

      {/* Floors tab bar */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-semibold flex items-center gap-2 mb-4">
          <FiLayers className="h-4 w-4 text-primary" /> Chọn tầng
        </h2>
        {localFloors.length === 0 ? (
          <div className="flex flex-col items-center py-10 gap-2 text-muted-foreground">
            <FiAlertCircle className="h-8 w-8 opacity-40" />
            <p className="text-sm">Chưa có tầng nào. Nhấn "Thêm tầng" để bắt đầu.</p>
          </div>
        ) : (
          <div className="flex gap-2 flex-wrap">
            {localFloors.map((f) => (
              <div key={f.id} className="flex items-center gap-1">
                <button
                  onClick={() => setSelectedFloorId(f.id)}
                  className={`btn btn-sm ${selectedFloorId === f.id ? 'btn-primary' : 'btn-secondary'}`}
                >
                  {f.name}
                </button>
                {selectedFloorId === f.id && (
                  <>
                    <button
                      onClick={() => openFloorModal('edit', f)}
                      className="btn btn-ghost btn-sm p-1"
                      aria-label="Sửa tầng"
                      title="Sửa tầng"
                    >
                      <FiEdit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Xóa tầng "${f.name}" và tất cả workspace trong đó?`)) deleteFloor(f.id);
                      }}
                      className="btn btn-ghost btn-sm p-1 text-destructive hover:bg-destructive/10"
                      aria-label="Xóa tầng"
                      title="Xóa tầng"
                    >
                      <FiTrash2 className="h-3.5 w-3.5" />
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Workspaces table */}
      {currentFloor && (
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h2 className="font-semibold flex items-center gap-2">
              <FiGrid className="h-4 w-4 text-primary" /> Workspace — {currentFloor.name}
            </h2>
            <button className="btn btn-primary btn-sm" onClick={() => openWsModal('add')}>
              <FiPlus className="h-4 w-4" /> Thêm workspace
            </button>
          </div>
          {floorWorkspaces.length === 0 ? (
            <div className="flex flex-col items-center py-10 gap-2 text-muted-foreground">
              <FiGrid className="h-8 w-8 opacity-40" />
              <p className="text-sm">Tầng này chưa có workspace nào.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Mã</th>
                    <th>Tên</th>
                    <th>Loại</th>
                    <th>Sức chứa</th>
                    <th>Trạng thái</th>
                    <th className="text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {floorWorkspaces.map((ws) => {
                    const wsType = workspaceTypes.find((t) => t.id === ws.workspace_type_id);
                    return (
                      <tr key={ws.id}>
                        <td className="font-mono font-semibold">{ws.code}</td>
                        <td className="font-medium">{ws.name}</td>
                        <td className="text-muted-foreground">{wsType?.name ?? '—'}</td>
                        <td>{ws.capacity}</td>
                        <td>
                          <span className={`badge ${statusBadge(ws.status)}`}>{statusLabel(ws.status)}</span>
                        </td>
                        <td>
                          <div className="flex items-center gap-1 justify-end">
                            <button
                              onClick={() => toggleWsStatus(ws.id)}
                              className="btn btn-ghost btn-sm p-1"
                              title={ws.status === 'active' ? 'Tắt workspace' : 'Bật workspace'}
                            >
                              <FiCheck className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => openWsModal('edit', ws)}
                              className="btn btn-ghost btn-sm p-1"
                              title="Sửa workspace"
                            >
                              <FiEdit2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── Modals ── */}
      {(modal?.type === 'add-floor' || modal?.type === 'edit-floor') && (
        <Modal
          title={modal.type === 'add-floor' ? 'Thêm tầng mới' : 'Chỉnh sửa tầng'}
          onClose={() => setModal(null)}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Số tầng</label>
              <input
                type="number"
                className="input-field"
                value={floorForm.floor_no}
                onChange={(e) => setFloorForm((p) => ({ ...p, floor_no: e.target.value }))}
                min={1}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Tên tầng <span className="text-destructive">*</span></label>
              <input
                className="input-field"
                placeholder="Tầng 1 - Lobby & Hot Desk"
                value={floorForm.name}
                onChange={(e) => setFloorForm((p) => ({ ...p, name: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">SVG URL</label>
              <input
                className="input-field"
                placeholder="/floorplans/f1.svg"
                value={floorForm.svg_url}
                onChange={(e) => setFloorForm((p) => ({ ...p, svg_url: e.target.value }))}
              />
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <button className="btn btn-secondary btn-sm" onClick={() => setModal(null)}>Hủy</button>
              <button className="btn btn-primary btn-sm" onClick={saveFloor} disabled={!floorForm.name.trim()}>
                <FiCheck className="h-3.5 w-3.5" /> Lưu
              </button>
            </div>
          </div>
        </Modal>
      )}

      {(modal?.type === 'add-ws' || modal?.type === 'edit-ws') && (
        <Modal
          title={modal.type === 'add-ws' ? 'Thêm workspace mới' : 'Chỉnh sửa workspace'}
          onClose={() => setModal(null)}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1.5">Mã workspace <span className="text-destructive">*</span></label>
                <input
                  className="input-field font-mono"
                  placeholder="HD-01"
                  value={wsForm.code}
                  onChange={(e) => setWsForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Sức chứa</label>
                <input
                  type="number"
                  className="input-field"
                  min={1}
                  value={wsForm.capacity}
                  onChange={(e) => setWsForm((p) => ({ ...p, capacity: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Tên workspace <span className="text-destructive">*</span></label>
              <input
                className="input-field"
                placeholder="Hot Desk 01"
                value={wsForm.name}
                onChange={(e) => setWsForm((p) => ({ ...p, name: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Loại workspace</label>
              <select
                className="input-field"
                value={wsForm.workspace_type_id}
                onChange={(e) => setWsForm((p) => ({ ...p, workspace_type_id: e.target.value }))}
              >
                {workspaceTypes.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Trạng thái</label>
              <select
                className="input-field"
                value={wsForm.status}
                onChange={(e) => setWsForm((p) => ({ ...p, status: e.target.value as Workspace['status'] }))}
              >
                <option value="active">Hoạt động</option>
                <option value="maintenance">Bảo trì</option>
                <option value="inactive">Ngưng</option>
              </select>
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <button className="btn btn-secondary btn-sm" onClick={() => setModal(null)}>Hủy</button>
              <button
                className="btn btn-primary btn-sm"
                onClick={saveWorkspace}
                disabled={!wsForm.code.trim() || !wsForm.name.trim()}
              >
                <FiCheck className="h-3.5 w-3.5" /> Lưu
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default BAWorkspacePage;
