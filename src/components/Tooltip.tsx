import React from "react";
import { FloorPlanItem } from "../types";

interface TooltipProps {
  item: FloorPlanItem | null;
  x: number;
  y: number;
}

const badgeColor: Record<FloorPlanItem["status"], string> = {
  available: "bg-[var(--state-success-bg)] text-[var(--state-success-solid)]",
  occupied: "bg-[var(--state-neutral-bg)] text-[var(--state-neutral-solid)]",
  pending: "bg-[var(--state-warning-bg)] text-[var(--state-warning-solid)]",
};

const statusWindowText: Record<FloorPlanItem["status"], string> = {
  available: "Available now",
  occupied: "Booked 09:00 - 12:00",
  pending: "Pending 13:00 - 15:00",
};

const Tooltip: React.FC<TooltipProps> = ({ item, x, y }) => {
  if (!item) return null;

  return (
    <div
      className="pointer-events-none absolute z-30 w-64 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3 shadow-lg backdrop-blur"
      style={{ left: x, top: y }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[var(--text-main)]">
            {item.name}
          </p>
          <p className="text-xs text-[var(--text-secondary)]">
            {item.type === "desk"
              ? "Desk"
              : item.type === "room"
                ? "Meeting room"
                : "Open area"}
          </p>
          <p className="mt-1 text-[11px] text-[var(--text-secondary)]">
            {item.label ?? item.id} - {item.status} |{" "}
            {statusWindowText[item.status]}
          </p>
        </div>
        <span
          className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${badgeColor[item.status]}`}
        >
          {item.status}
        </span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-[var(--text-secondary)]">
        <div className="rounded-xl bg-[var(--bg-surface-hover)] p-2">
          Capacity: <span className="font-semibold">{item.capacity}</span>
        </div>
        <div className="rounded-xl bg-[var(--bg-surface-hover)] p-2">
          ID: <span className="font-semibold">{item.id}</span>
        </div>
      </div>
    </div>
  );
};

export default Tooltip;
