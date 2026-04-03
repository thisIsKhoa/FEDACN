import React from "react";

interface OccupancyIndicatorProps {
  total: number;
  occupied: number;
  available: number;
}

const OccupancyIndicator: React.FC<OccupancyIndicatorProps> = ({
  total,
  occupied,
  available,
}) => {
  const rate = total > 0 ? Math.round((occupied / total) * 100) : 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 backdrop-blur dark:border-slate-700 dark:bg-slate-900/85">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
        Live Occupancy
      </p>
      <div className="mt-2 flex items-end gap-4">
        <div>
          <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {rate}%
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            currently occupied
          </p>
        </div>
        <div className="text-xs text-slate-600 dark:text-slate-300">
          <p>Total: {total}</p>
          <p>Occupied: {occupied}</p>
          <p>Available: {available}</p>
        </div>
      </div>
    </div>
  );
};

export default OccupancyIndicator;
