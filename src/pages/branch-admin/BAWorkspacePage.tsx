import React, { useState } from 'react';
import {
  FiLayers, FiGrid, FiPlus, FiEdit2, FiX, FiCheck, FiAlertCircle, FiTrash2, FiUploadCloud, FiCheckCircle
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import {
  floors as allFloors, workspaces as allWorkspaces, workspaceTypes, bookings,
  type Floor, type Workspace,
} from '../../data/mockData';

/* ── Modal shell ── */
const Modal: React.FC<{ title: string; onClose: () => void; children: React.ReactNode }> = ({
  title, onClose, children,
}) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in"
    onClick={onClose}
  >
    <div
      className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md animate-scale-in flex flex-col max-h-[90vh]"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
        <h2 className="text-lg font-bold font-heading">{title}</h2>
        <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground" aria-label="Đóng">
          <FiX className="h-5 w-5" />
        </button>
      </div>
      <div className="p-6 overflow-y-auto">{children}</div>
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

  // Notifications
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form state
  const [floorForm, setFloorForm] = useState({ floor_no: '', name: '', svgFile: null as File | null, existingSvg: '' });
  const [wsForm, setWsForm] = useState({ code: '', name: '', workspace_type_id: '', capacity: '1', svg_element_id: '', status: 'active' as Workspace['status'] });

  const currentFloor = localFloors.find((f) => f.id === selectedFloorId);
  const floorWorkspaces = localWorkspaces.filter((w) => w.floor_id === selectedFloorId);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const showError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(''), 5000);
  };

  const openFloorModal = (mode: 'add' | 'edit', floor?: Floor) => {
    setErrorMsg('');
    if (mode === 'add') {
      setFloorForm({ floor_no: String(localFloors.length + 1), name: '', svgFile: null, existingSvg: '' });
      setModal({ type: 'add-floor' });
    } else if (floor) {
      setFloorForm({ floor_no: String(floor.floor_no), name: floor.name, svgFile: null, existingSvg: floor.svg_url });
      setModal({ type: 'edit-floor', floor });
    }
  };

  const openWsModal = (mode: 'add' | 'edit', ws?: Workspace) => {
    setErrorMsg('');
    if (mode === 'add') {
      setWsForm({ code: '', name: '', workspace_type_id: workspaceTypes[0]?.id ?? '', capacity: '1', svg_element_id: '', status: 'active' });
      setModal({ type: 'add-ws', floorId: selectedFloorId });
    } else if (ws) {
      setWsForm({ code: ws.code, name: ws.name, workspace_type_id: ws.workspace_type_id, capacity: String(ws.capacity), svg_element_id: ws.svg_element_id || '', status: ws.status });
      setModal({ type: 'edit-ws', ws });
    }
  };

  const saveFloor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!floorForm.name.trim() || (!floorForm.svgFile && !floorForm.existingSvg)) {
      setErrorMsg('Vui lòng nhập tên tầng và tải lên bản đồ SVG.');
      return;
    }

    const svgUrl = floorForm.svgFile ? `/floorplans/${floorForm.svgFile.name}` : floorForm.existingSvg;

    if (modal?.type === 'add-floor') {
      const newFloor: Floor = {
        id: `floor-new-${Date.now()}`,
        branch_id: branchId,
        floor_no: parseInt(floorForm.floor_no) || localFloors.length + 1,
        name: floorForm.name,
        svg_url: svgUrl,
        map_version: 1,
        is_published: true,
      };
      setLocalFloors((prev) => [...prev, newFloor]);
      setSelectedFloorId(newFloor.id);
      showSuccess('Thêm tầng mới thành công!');
    } else if (modal?.type === 'edit-floor') {
      setLocalFloors((prev) =>
        prev.map((f) =>
          f.id === modal.floor.id
            ? { ...f, name: floorForm.name, floor_no: parseInt(floorForm.floor_no) || f.floor_no, svg_url: svgUrl }
            : f
        )
      );
      showSuccess('Cập nhật thông tin tầng thành công!');
    }
    setModal(null);
  };

  const deleteFloor = (floorId: string, floorName: string) => {
    // Check for future bookings in this floor
    const hasFutureBookings = bookings.some(b => {
      const w = localWorkspaces.find(ws => ws.id === b.workspace_id);
      return w && w.floor_id === floorId && new Date(b.start_at) > new Date() && b.status !== 'canceled';
    });

    if (hasFutureBookings) {
      showError(`Không thể xóa tầng "${floorName}" vì đang có lịch đặt chỗ trong tương lai.`);
      return;
    }

    if (window.confirm(`Bạn có chắc chắn muốn xóa tầng "${floorName}" và tất cả workspace trong đó? Hành động này không thể hoàn tác.`)) {
      setLocalFloors((prev) => prev.filter((f) => f.id !== floorId));
      setLocalWorkspaces((prev) => prev.filter((w) => w.floor_id !== floorId));
      if (selectedFloorId === floorId) {
        const remaining = localFloors.filter((f) => f.id !== floorId);
        setSelectedFloorId(remaining[0]?.id ?? '');
      }
      showSuccess(`Đã xóa tầng ${floorName}`);
    }
  };

  const saveWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wsForm.code.trim() || !wsForm.name.trim() || !wsForm.svg_element_id.trim()) {
      setErrorMsg('Vui lòng điền các trường bắt buộc (*).');
      return;
    }

    if (modal?.type === 'add-ws') {
      const newWs: Workspace = {
        id: `ws-new-${Date.now()}`,
        floor_id: modal.floorId,
        workspace_type_id: wsForm.workspace_type_id,
        code: wsForm.code,
        name: wsForm.name,
        capacity: parseInt(wsForm.capacity) || 1,
        svg_element_id: wsForm.svg_element_id,
        status: wsForm.status,
      };
      setLocalWorkspaces((prev) => [...prev, newWs]);
      showSuccess('Thêm không gian thành công!');
    } else if (modal?.type === 'edit-ws') {
      setLocalWorkspaces((prev) =>
        prev.map((w) =>
          w.id === modal.ws.id
            ? { ...w, code: wsForm.code, name: wsForm.name, workspace_type_id: wsForm.workspace_type_id, capacity: parseInt(wsForm.capacity) || 1, svg_element_id: wsForm.svg_element_id, status: wsForm.status }
            : w
        )
      );
      showSuccess('Cập nhật không gian thành công!');
    }
    setModal(null);
  };

  const deleteWorkspace = (wsId: string, wsCode: string) => {
    const hasFutureBookings = bookings.some(b => 
      b.workspace_id === wsId && new Date(b.start_at) > new Date() && b.status !== 'canceled'
    );

    if (hasFutureBookings) {
      showError(`Không thể xóa "${wsCode}" vì đang có lịch đặt chỗ trong tương lai.`);
      return;
    }

    if (window.confirm(`Bạn có chắc chắn muốn xóa không gian "${wsCode}"?`)) {
      setLocalWorkspaces((prev) => prev.filter(w => w.id !== wsId));
      showSuccess(`Đã xóa không gian ${wsCode}`);
    }
  };

  const statusBadge = (status: Workspace['status']) =>
    status === 'active' ? 'badge-success' : status === 'maintenance' ? 'badge-warning' : 'badge-danger';
  const statusLabel = (status: Workspace['status']) =>
    status === 'active' ? 'Hoạt động' : status === 'maintenance' ? 'Bảo trì' : 'Ngưng';

  return (
    <div className="space-y-6 animate-fade-in relative">
      {/* Toast Notifications */}
      {successMsg && (
        <div className="fixed top-4 right-4 z-50 animate-slide-up flex items-center gap-2 bg-success text-success-foreground px-4 py-3 rounded-xl shadow-xl">
          <FiCheckCircle className="h-5 w-5" />
          <p className="font-medium text-sm">{successMsg}</p>
        </div>
      )}
      {errorMsg && !modal && (
        <div className="fixed top-4 right-4 z-50 animate-slide-up flex items-center gap-2 bg-destructive text-destructive-foreground px-4 py-3 rounded-xl shadow-xl">
          <FiAlertCircle className="h-5 w-5" />
          <p className="font-medium text-sm">{errorMsg}</p>
        </div>
      )}

      {/* Header */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Quản lý chi nhánh</p>
            <h1 className="text-xl font-bold font-heading mt-1">Sơ đồ & Không gian</h1>
            <p className="text-sm text-muted-foreground mt-1">Thiết lập bản đồ SVG và ánh xạ chỗ ngồi.</p>
          </div>
          <button className="btn btn-primary btn-sm flex items-center gap-2" onClick={() => openFloorModal('add')}>
            <FiPlus className="h-4 w-4" /> Thêm Tầng Mới
          </button>
        </div>
      </div>

      {/* Floors tab bar */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-semibold flex items-center gap-2 mb-4">
          <FiLayers className="h-4 w-4 text-primary" /> Tầng hiện tại
        </h2>
        {localFloors.length === 0 ? (
          <div className="flex flex-col items-center py-10 gap-2 text-muted-foreground">
            <FiAlertCircle className="h-8 w-8 opacity-40" />
            <p className="text-sm">Chưa có tầng nào. Nhấn "Thêm Tầng Mới" để bắt đầu.</p>
          </div>
        ) : (
          <div className="flex gap-2 flex-wrap">
            {localFloors.map((f) => (
              <div key={f.id} className="flex items-center gap-1 group">
                <button
                  onClick={() => setSelectedFloorId(f.id)}
                  className={`btn px-4 py-2 text-sm font-medium transition-all ${
                    selectedFloorId === f.id 
                      ? 'bg-primary text-primary-foreground shadow-md' 
                      : 'bg-muted/50 text-foreground hover:bg-muted'
                  }`}
                >
                  {f.name}
                </button>
                {selectedFloorId === f.id && (
                  <div className="flex gap-1 animate-fade-in">
                    <button
                      onClick={() => openFloorModal('edit', f)}
                      className="btn btn-ghost btn-sm p-1.5 text-muted-foreground hover:text-primary"
                      title="Sửa tầng"
                    >
                      <FiEdit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteFloor(f.id, f.name)}
                      className="btn btn-ghost btn-sm p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      title="Xóa tầng"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Workspaces table */}
      {currentFloor && (
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div className="p-6 border-b border-border flex items-center justify-between flex-wrap gap-3 bg-muted/20">
            <div>
              <h2 className="font-semibold flex items-center gap-2 text-lg">
                <FiGrid className="h-5 w-5 text-primary" /> Workspace tại {currentFloor.name}
              </h2>
              <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                Bản đồ: <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded text-foreground">{currentFloor.svg_url}</span>
              </p>
            </div>
            <button className="btn btn-primary btn-sm flex items-center gap-2" onClick={() => openWsModal('add')}>
              <FiPlus className="h-4 w-4" /> Thêm không gian
            </button>
          </div>
          
          {floorWorkspaces.length === 0 ? (
            <div className="flex flex-col items-center py-16 gap-3 text-muted-foreground">
              <FiGrid className="h-12 w-12 opacity-30" />
              <p className="font-medium">Chưa có không gian nào.</p>
              <p className="text-sm">Bắt đầu bằng cách thêm các bàn làm việc, phòng họp và gán SVG ID tương ứng.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr className="bg-muted/50">
                    <th>Mã</th>
                    <th>Tên không gian</th>
                    <th>Loại</th>
                    <th>Sức chứa</th>
                    <th className="text-center">Trạng thái</th>
                    <th className="text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {floorWorkspaces.map((ws) => {
                    const wsType = workspaceTypes.find((t) => t.id === ws.workspace_type_id);
                    return (
                      <tr key={ws.id} className="hover:bg-muted/30 transition-colors">
                        <td className="font-mono font-semibold text-sm">{ws.code}</td>
                        <td className="font-medium">{ws.name}</td>
                        <td className="text-muted-foreground text-sm">{wsType?.name ?? '—'}</td>
                        <td className="text-sm">{ws.capacity} người</td>
                        <td className="text-center">
                          <span className={`badge ${statusBadge(ws.status)} shadow-sm`}>{statusLabel(ws.status)}</span>
                        </td>
                        <td>
                          <div className="flex items-center gap-2 justify-end">
                            <button onClick={() => openWsModal('edit', ws)} className="btn btn-ghost btn-sm text-muted-foreground hover:text-primary p-2" title="Chỉnh sửa">
                              <FiEdit2 className="h-4 w-4" />
                            </button>
                            <button onClick={() => deleteWorkspace(ws.id, ws.code)} className="btn btn-ghost btn-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 p-2" title="Xóa">
                              <FiTrash2 className="h-4 w-4" />
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
        <Modal title={modal.type === 'add-floor' ? 'Thêm tầng mới' : 'Chỉnh sửa tầng'} onClose={() => setModal(null)}>
          {errorMsg && (
            <div className="mb-4 p-3 bg-destructive/10 text-destructive text-sm font-medium rounded-lg flex items-start gap-2 border border-destructive/20">
              <FiAlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <p>{errorMsg}</p>
            </div>
          )}
          <form id="floor-form" onSubmit={saveFloor} className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1">
                <label className="block text-sm font-medium text-foreground mb-1.5">Số tầng</label>
                <input
                  type="number" className="input-field" value={floorForm.floor_no}
                  onChange={(e) => setFloorForm((p) => ({ ...p, floor_no: e.target.value }))} min={1}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-foreground mb-1.5">Tên hiển thị <span className="text-destructive">*</span></label>
                <input
                  className="input-field" placeholder="Tầng 1 - Lobby" required
                  value={floorForm.name} onChange={(e) => setFloorForm((p) => ({ ...p, name: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-foreground">File Bản đồ (SVG) <span className="text-destructive">*</span></label>
              <div className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center text-center bg-muted/30 hover:bg-muted/50 transition-colors relative cursor-pointer">
                <input 
                  type="file" 
                  accept=".svg" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => setFloorForm(p => ({ ...p, svgFile: e.target.files?.[0] || null }))} 
                />
                <FiUploadCloud className="h-8 w-8 text-primary mb-2" />
                {floorForm.svgFile ? (
                  <p className="text-sm font-medium text-primary">{floorForm.svgFile.name}</p>
                ) : floorForm.existingSvg ? (
                  <p className="text-sm font-medium text-primary">{floorForm.existingSvg}</p>
                ) : (
                  <>
                    <p className="text-sm font-medium">Nhấn để tải lên file SVG</p>
                    <p className="text-xs text-muted-foreground mt-1">Bắt buộc để chạy bản đồ tương tác</p>
                  </>
                )}
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-border mt-6">
              <button type="button" className="btn btn-ghost" onClick={() => setModal(null)}>Hủy</button>
              <button type="submit" className="btn btn-primary flex items-center gap-2">
                <FiCheck className="h-4 w-4" /> Lưu thông tin
              </button>
            </div>
          </form>
        </Modal>
      )}

      {(modal?.type === 'add-ws' || modal?.type === 'edit-ws') && (
        <Modal title={modal.type === 'add-ws' ? 'Thêm không gian mới' : 'Chỉnh sửa không gian'} onClose={() => setModal(null)}>
          {errorMsg && (
            <div className="mb-4 p-3 bg-destructive/10 text-destructive text-sm font-medium rounded-lg flex items-start gap-2 border border-destructive/20">
              <FiAlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <p>{errorMsg}</p>
            </div>
          )}
          <form id="ws-form" onSubmit={saveWorkspace} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Mã không gian <span className="text-destructive">*</span></label>
                <input
                  className="input-field font-mono" placeholder="HD-01" required
                  value={wsForm.code} onChange={(e) => setWsForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Loại không gian</label>
                <select className="input-field" value={wsForm.workspace_type_id} onChange={(e) => setWsForm((p) => ({ ...p, workspace_type_id: e.target.value }))}>
                  {workspaceTypes.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Tên hiển thị <span className="text-destructive">*</span></label>
              <input
                className="input-field" placeholder="Bàn làm việc số 1" required
                value={wsForm.name} onChange={(e) => setWsForm((p) => ({ ...p, name: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Sức chứa (người)</label>
                <input
                  type="number" className="input-field" min={1} required
                  value={wsForm.capacity} onChange={(e) => setWsForm((p) => ({ ...p, capacity: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Trạng thái</label>
                <select className="input-field" value={wsForm.status} onChange={(e) => setWsForm((p) => ({ ...p, status: e.target.value as Workspace['status'] }))}>
                  <option value="active">Đang hoạt động</option>
                  <option value="maintenance">Bảo trì</option>
                  <option value="inactive">Tạm ngưng</option>
                </select>
              </div>
            </div>

            <div className="p-4 bg-muted/40 border border-border rounded-xl">
              <label className="block text-sm font-medium text-foreground mb-1.5 flex items-center gap-1">
                SVG Element ID <span className="text-destructive">*</span>
              </label>
              <p className="text-xs text-muted-foreground mb-2">ID của object trên file bản đồ SVG để cho phép người dùng click chọn.</p>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-sm">#</span>
                <input
                  className="input-field pl-7 font-mono text-sm" placeholder="desk_01" required
                  value={wsForm.svg_element_id} onChange={(e) => setWsForm((p) => ({ ...p, svg_element_id: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-border mt-6">
              <button type="button" className="btn btn-ghost" onClick={() => setModal(null)}>Hủy</button>
              <button type="submit" className="btn btn-primary flex items-center gap-2">
                <FiCheck className="h-4 w-4" /> Lưu thông tin
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default BAWorkspacePage;
