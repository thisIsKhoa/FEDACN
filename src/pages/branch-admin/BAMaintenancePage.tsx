import React, { useState } from 'react';
import { FiTool, FiPlus, FiX, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import {
  floors as allFloors, workspaces as allWorkspaces,
  workspaceMaintenances as allMaintenances,
  type WorkspaceMaintenance,
} from '../../data/mockData';

const Modal: React.FC<{ title: string; onClose: () => void; children: React.ReactNode }> = ({
  title, onClose, children,
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose}>
    <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md animate-scale-in" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <h2 className="text-base font-bold font-heading">{title}</h2>
        <button onClick={onClose} className="btn btn-ghost btn-sm p-1"><FiX className="h-4 w-4" /></button>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  </div>
);

const STATUS_FLOW: Array<{ from: WorkspaceMaintenance['status']; to: WorkspaceMaintenance['status']; label: string }> = [
  { from: 'scheduled', to: 'active', label: 'Bắt đầu' },
  { from: 'active', to: 'done', label: 'Hoàn thành' },
];

const STATUS_BADGE: Record<WorkspaceMaintenance['status'], string> = {
  scheduled: 'badge-warning',
  active: 'badge-info',
  done: 'badge-success',
  canceled: 'badge-neutral',
};
const STATUS_LABEL: Record<WorkspaceMaintenance['status'], string> = {
  scheduled: 'Lên lịch',
  active: 'Đang thực hiện',
  done: 'Hoàn thành',
  canceled: 'Đã hủy',
};

const BAMaintenancePage: React.FC = () => {
  const { user } = useAuth();
  const branchId = user!.branchId!;

  const branchFloors = allFloors.filter((f) => f.branch_id === branchId);
  const floorIds = branchFloors.map((f) => f.id);
  const branchWorkspaces = allWorkspaces.filter((w) => floorIds.includes(w.floor_id));
  const branchWsIds = new Set(branchWorkspaces.map((w) => w.id));

  const [maintenances, setMaintenances] = useState<WorkspaceMaintenance[]>(
    allMaintenances.filter((m) => branchWsIds.has(m.workspace_id))
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    workspace_id: branchWorkspaces[0]?.id ?? '',
    start_at: '',
    end_at: '',
    reason: '',
  });
  const [formError, setFormError] = useState('');

  const getWsName = (wsId: string) => branchWorkspaces.find((w) => w.id === wsId)?.name ?? wsId;

  const saveMaintenance = () => {
    setFormError('');
    if (!form.workspace_id || !form.start_at || !form.end_at) {
      setFormError('Vui lòng điền đầy đủ thông tin.');
      return;
    }
    if (new Date(form.end_at) <= new Date(form.start_at)) {
      setFormError('Thời gian kết thúc phải sau thời gian bắt đầu.');
      return;
    }
    const newRecord: WorkspaceMaintenance = {
      id: `wm-local-${Date.now()}`,
      workspace_id: form.workspace_id,
      start_at: new Date(form.start_at).toISOString(),
      end_at: new Date(form.end_at).toISOString(),
      reason: form.reason,
      status: 'scheduled',
      created_by: user!.id,
    };
    setMaintenances((prev) => [newRecord, ...prev]);
    setModalOpen(false);
    setForm({ workspace_id: branchWorkspaces[0]?.id ?? '', start_at: '', end_at: '', reason: '' });
  };

  const advanceStatus = (id: string) => {
    setMaintenances((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        const step = STATUS_FLOW.find((s) => s.from === m.status);
        return step ? { ...m, status: step.to } : m;
      })
    );
  };

  const cancelMaintenance = (id: string) => {
    setMaintenances((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: 'canceled' } : m))
    );
  };

  const active = maintenances.filter((m) => m.status === 'active');
  const scheduled = maintenances.filter((m) => m.status === 'scheduled');
  const past = maintenances.filter((m) => m.status === 'done' || m.status === 'canceled');

  const renderRow = (m: WorkspaceMaintenance) => {
    const step = STATUS_FLOW.find((s) => s.from === m.status);
    return (
      <tr key={m.id}>
        <td className="font-medium">{getWsName(m.workspace_id)}</td>
        <td className="text-sm text-muted-foreground">{m.reason || '—'}</td>
        <td className="font-mono text-xs">{new Date(m.start_at).toLocaleString('vi-VN')}</td>
        <td className="font-mono text-xs">{new Date(m.end_at).toLocaleString('vi-VN')}</td>
        <td className="text-center">
          <span className={`badge ${STATUS_BADGE[m.status]}`}>{STATUS_LABEL[m.status]}</span>
        </td>
        <td className="text-right">
          <div className="flex items-center gap-1 justify-end">
            {step && (
              <button className="btn btn-primary btn-sm" onClick={() => advanceStatus(m.id)}>
                {step.label}
              </button>
            )}
            {m.status === 'scheduled' && (
              <button
                className="btn btn-ghost btn-sm p-1 text-destructive hover:bg-destructive/10"
                onClick={() => cancelMaintenance(m.id)}
                title="Hủy lịch"
              >
                <FiX className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Quản lý chi nhánh</p>
            <h1 className="text-xl font-bold font-heading mt-1">Lịch bảo trì</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {active.length} đang thực hiện · {scheduled.length} lên lịch
            </p>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => setModalOpen(true)}>
            <FiPlus className="h-4 w-4" /> Tạo lịch bảo trì
          </button>
        </div>
      </div>

      {maintenances.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-10 flex flex-col items-center gap-3 text-muted-foreground">
          <FiTool className="h-10 w-10 opacity-30" />
          <p className="text-sm">Chưa có lịch bảo trì nào.</p>
        </div>
      ) : (
        <>
          {/* Active & Scheduled */}
          {[...active, ...scheduled].length > 0 && (
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-6 py-4 border-b border-border">
                <h2 className="font-semibold flex items-center gap-2">
                  <FiTool className="h-4 w-4 text-primary" /> Đang diễn ra & Sắp tới
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Workspace</th>
                      <th>Lý do</th>
                      <th>Bắt đầu</th>
                      <th>Kết thúc</th>
                      <th className="text-center">Trạng thái</th>
                      <th className="text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>{[...active, ...scheduled].map(renderRow)}</tbody>
                </table>
              </div>
            </div>
          )}

          {/* History */}
          {past.length > 0 && (
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-6 py-4 border-b border-border">
                <h2 className="font-semibold text-muted-foreground">Lịch sử</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Workspace</th>
                      <th>Lý do</th>
                      <th>Bắt đầu</th>
                      <th>Kết thúc</th>
                      <th className="text-center">Trạng thái</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>{past.map(renderRow)}</tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Create modal */}
      {modalOpen && (
        <Modal title="Tạo lịch bảo trì" onClose={() => setModalOpen(false)}>
          <div className="space-y-4">
            {formError && (
              <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
                <FiAlertCircle className="h-4 w-4 shrink-0" />
                {formError}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1.5">Workspace <span className="text-destructive">*</span></label>
              <select
                className="input-field"
                value={form.workspace_id}
                onChange={(e) => setForm((p) => ({ ...p, workspace_id: e.target.value }))}
              >
                {branchWorkspaces.map((w) => (
                  <option key={w.id} value={w.id}>{w.name} ({w.code})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Thời gian bắt đầu <span className="text-destructive">*</span></label>
              <input
                type="datetime-local"
                className="input-field"
                value={form.start_at}
                onChange={(e) => setForm((p) => ({ ...p, start_at: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Thời gian kết thúc <span className="text-destructive">*</span></label>
              <input
                type="datetime-local"
                className="input-field"
                value={form.end_at}
                onChange={(e) => setForm((p) => ({ ...p, end_at: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Lý do bảo trì</label>
              <textarea
                className="input-field"
                rows={2}
                placeholder="Sửa chữa thiết bị, làm sạch..."
                value={form.reason}
                onChange={(e) => setForm((p) => ({ ...p, reason: e.target.value }))}
              />
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <button className="btn btn-secondary btn-sm" onClick={() => setModalOpen(false)}>Hủy</button>
              <button className="btn btn-primary btn-sm" onClick={saveMaintenance}>
                <FiCheck className="h-3.5 w-3.5" /> Tạo lịch
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default BAMaintenancePage;
