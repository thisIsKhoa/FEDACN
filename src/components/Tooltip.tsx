import React from "react";
import { FloorPlanItem } from "../types";

interface TooltipProps {
  item: FloorPlanItem | null;
  x: number;
  y: number;
}

const badgeColor: Record<FloorPlanItem["status"], string> = {
  available: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300",
  occupied: "bg-slate-400/20 text-slate-700 dark:text-slate-300",
  pending: "bg-indigo-400/20 text-indigo-700 dark:text-indigo-300",
};

const Tooltip: React.FC<TooltipProps> = ({ item, x, y }) => {
  if (!item) return null;

  return (
    <div
      className="pointer-events-none absolute z-30 w-64 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-900/95"
      style={{ left: x, top: y }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
            {item.name}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {item.type === "desk"
              ? "Desk"
              : item.type === "room"
                ? "Meeting room"
                : "Open area"}
          </p>
        </div>
        <span
          className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${badgeColor[item.status]}`}
        >
          {item.status}
        </span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
        <div className="rounded-xl bg-slate-50 p-2 dark:bg-slate-900/60">
          Capacity: <span className="font-semibold">{item.capacity}</span>
        </div>
        <div className="rounded-xl bg-slate-50 p-2 dark:bg-slate-900/60">
          ID: <span className="font-semibold">{item.id}</span>
        </div>
      </div>
    </div>
  );
};

export default Tooltip;
