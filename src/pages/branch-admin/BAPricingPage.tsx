import React, { useState } from 'react';
import { FiTag, FiX, FiCheck, FiEdit2, FiGlobe, FiMapPin } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { workspaceTypes, pricePolicies as allPolicies, type PricePolicy } from '../../data/mockData';
import { getEffectivePrice } from '../../utils/policyResolver';
import { formatVND } from '../../utils/formatters';

const DURATION_UNITS: Array<{ key: PricePolicy['duration_unit']; label: string }> = [
  { key: 'hour', label: 'Giờ' },
  { key: 'day', label: 'Ngày' },
  { key: 'week', label: 'Tuần' },
  { key: 'month', label: 'Tháng' },
];

const Modal: React.FC<{ title: string; onClose: () => void; children: React.ReactNode }> = ({
  title, onClose, children,
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose}>
    <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-sm animate-scale-in" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <h2 className="text-base font-bold font-heading">{title}</h2>
        <button onClick={onClose} className="btn btn-ghost btn-sm p-1"><FiX className="h-4 w-4" /></button>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  </div>
);

type EditTarget = { workspaceTypeId: string; durationUnit: PricePolicy['duration_unit']; currentPrice: number; source: 'branch' | 'global' } | null;

const BAPricingPage: React.FC = () => {
  const { user } = useAuth();
  const branchId = user!.branchId!;

  // Local price policies (branch-scoped overrides)
  const [localPolicies, setLocalPolicies] = useState<PricePolicy[]>(
    allPolicies.filter((p) => p.branch_id === branchId)
  );

  const [editTarget, setEditTarget] = useState<EditTarget>(null);
  const [priceInput, setPriceInput] = useState('');

  const getEffective = (wsTypeId: string, unit: PricePolicy['duration_unit']) => {
    // Check local branch override first
    const localOverride = localPolicies.find(
      (p) => p.workspace_type_id === wsTypeId && p.duration_unit === unit && p.is_active
    );
    if (localOverride) return { ...localOverride, source: 'branch' as const };
    // Fall back to resolver (uses imported allPolicies)
    return getEffectivePrice(wsTypeId, branchId, unit);
  };

  const openEdit = (wsTypeId: string, unit: PricePolicy['duration_unit']) => {
    const eff = getEffective(wsTypeId, unit);
    setEditTarget({ workspaceTypeId: wsTypeId, durationUnit: unit, currentPrice: eff?.price ?? 0, source: eff?.source ?? 'global' });
    setPriceInput(String(eff?.price ?? ''));
  };

  const savePrice = () => {
    if (!editTarget) return;
    const price = parseInt(priceInput.replace(/\D/g, ''));
    if (isNaN(price) || price < 0) return;

    setLocalPolicies((prev) => {
      const existing = prev.find(
        (p) => p.workspace_type_id === editTarget.workspaceTypeId && p.duration_unit === editTarget.durationUnit
      );
      if (existing) {
        return prev.map((p) =>
          p.workspace_type_id === editTarget.workspaceTypeId && p.duration_unit === editTarget.durationUnit
            ? { ...p, price, is_active: true }
            : p
        );
      }
      return [
        ...prev,
        {
          id: `pp-local-${Date.now()}`,
          branch_id: branchId,
          workspace_type_id: editTarget.workspaceTypeId,
          duration_unit: editTarget.durationUnit,
          price,
          currency: 'VND',
          is_active: true,
        },
      ];
    });
    setEditTarget(null);
  };

  const removeOverride = (wsTypeId: string, unit: PricePolicy['duration_unit']) => {
    setLocalPolicies((prev) =>
      prev.filter((p) => !(p.workspace_type_id === wsTypeId && p.duration_unit === unit))
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Quản lý chi nhánh</p>
          <h1 className="text-xl font-bold font-heading mt-1">Bảng giá</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Ghi đè giá toàn hệ thống cho chi nhánh này. Giá chi nhánh luôn được ưu tiên.
          </p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <FiGlobe className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="px-2 py-0.5 rounded-full border border-border bg-muted font-medium">Mặc định hệ thống</span>
        </span>
        <span className="flex items-center gap-1.5">
          <FiMapPin className="h-3.5 w-3.5 text-primary" />
          <span className="px-2 py-0.5 rounded-full border border-primary/30 bg-primary/10 text-primary font-medium">Ghi đè chi nhánh</span>
        </span>
      </div>

      {/* Pricing matrix */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th className="min-w-[160px]">Loại không gian</th>
                {DURATION_UNITS.map((d) => (
                  <th key={d.key} className="text-center min-w-[130px]">{d.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {workspaceTypes.map((wt) => (
                <tr key={wt.id}>
                  <td className="font-medium">{wt.name}</td>
                  {DURATION_UNITS.map((d) => {
                    const eff = getEffective(wt.id, d.key);
                    const isBranchOverride = eff?.source === 'branch';
                    return (
                      <td key={d.key} className="text-center">
                        {eff ? (
                          <div className="inline-flex flex-col items-center gap-1">
                            <span className={`text-sm font-bold ${isBranchOverride ? 'text-primary' : ''}`}>
                              {formatVND(eff.price)}
                            </span>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                              isBranchOverride
                                ? 'border border-primary/30 bg-primary/10 text-primary'
                                : 'border border-border bg-muted text-muted-foreground'
                            }`}>
                              {isBranchOverride ? <FiMapPin className="h-2.5 w-2.5" /> : <FiGlobe className="h-2.5 w-2.5" />}
                              {isBranchOverride ? 'Chi nhánh' : 'Mặc định'}
                            </span>
                            <div className="flex gap-1 mt-0.5">
                              <button
                                className="btn btn-ghost btn-sm py-0 px-1 text-xs"
                                onClick={() => openEdit(wt.id, d.key)}
                                title="Chỉnh sửa giá"
                              >
                                <FiEdit2 className="h-3 w-3" />
                              </button>
                              {isBranchOverride && (
                                <button
                                  className="btn btn-ghost btn-sm py-0 px-1 text-xs text-destructive"
                                  onClick={() => removeOverride(wt.id, d.key)}
                                  title="Xóa ghi đè, dùng giá mặc định"
                                >
                                  <FiX className="h-3 w-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="inline-flex flex-col items-center gap-1">
                            <span className="text-muted-foreground text-sm">—</span>
                            <button
                              className="btn btn-ghost btn-sm py-0 px-1 text-xs"
                              onClick={() => openEdit(wt.id, d.key)}
                              title="Thêm giá"
                            >
                              <FiTag className="h-3 w-3" /> Thêm
                            </button>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit modal */}
      {editTarget && (
        <Modal
          title={`Cài giá — ${workspaceTypes.find(t => t.id === editTarget.workspaceTypeId)?.name} / ${DURATION_UNITS.find(d => d.key === editTarget.durationUnit)?.label}`}
          onClose={() => setEditTarget(null)}
        >
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Giá này sẽ ghi đè toàn bộ giá mặc định hệ thống cho chi nhánh của bạn.
            </p>
            <div>
              <label className="block text-sm font-medium mb-1.5">Giá (VND)</label>
              <input
                className="input-field font-mono text-lg"
                type="number"
                min={0}
                step={1000}
                value={priceInput}
                onChange={(e) => setPriceInput(e.target.value)}
                placeholder="0"
                autoFocus
              />
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <button className="btn btn-secondary btn-sm" onClick={() => setEditTarget(null)}>Hủy</button>
              <button className="btn btn-primary btn-sm" onClick={savePrice}>
                <FiCheck className="h-3.5 w-3.5" /> Lưu giá
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default BAPricingPage;
