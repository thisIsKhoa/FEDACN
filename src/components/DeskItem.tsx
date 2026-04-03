import React from "react";
import { FloorPlanItem } from "../types";

interface DeskItemProps {
  item: FloorPlanItem;
  selected: boolean;
  hovered: boolean;
  onPointerEnter: (
    item: FloorPlanItem,
    event: React.PointerEvent<SVGGElement>,
  ) => void;
  onPointerLeave: () => void;
  onClick: (item: FloorPlanItem) => void;
}

const statusColors: Record<
  FloorPlanItem["status"],
  { fill: string; stroke: string; badge: string }
> = {
  available: {
    fill: "var(--state-success-bg)",
    stroke: "var(--state-success-solid)",
    badge: "var(--state-success-solid)",
  },
  occupied: {
    fill: "var(--state-neutral-bg)",
    stroke: "var(--state-neutral-solid)",
    badge: "var(--state-neutral-solid)",
  },
  pending: {
    fill: "var(--state-warning-bg)",
    stroke: "var(--state-warning-solid)",
    badge: "var(--state-warning-solid)",
  },
};

const DeskItem: React.FC<DeskItemProps> = ({
  item,
  selected,
  hovered,
  onPointerEnter,
  onPointerLeave,
  onClick,
}) => {
  const cx = item.x + item.w / 2;
  const cy = item.y + item.h / 2;
  const color = statusColors[item.status];
  const marker = String(item.label ?? item.id)
    .replace(/[^0-9A-Za-z]/g, "")
    .toUpperCase()
    .slice(0, 3);
  const interactive = item.status !== "occupied";

  return (
    <g
      data-no-pan="true"
      onPointerEnter={(event) => onPointerEnter(item, event)}
      onPointerLeave={onPointerLeave}
      onClick={(event) => {
        event.stopPropagation();
        onClick(item);
      }}
      style={{ cursor: "pointer" }}
    >
      <circle cx={cx} cy={cy} r={item.w / 2 + 10} fill="transparent" />
      <circle
        cx={cx}
        cy={cy}
        r={hovered ? item.w / 2 + 1.5 : item.w / 2}
        fill={color.fill}
        stroke={color.stroke}
        strokeWidth={selected ? 2.8 : 1.8}
        opacity={hovered ? 1 : 0.96}
        style={{
          filter: hovered
            ? "drop-shadow(0 4px 8px color-mix(in oklab, var(--brand-primary) 28%, transparent))"
            : "none",
        }}
      />
      <circle
        cx={cx}
        cy={cy}
        r={item.w / 3.1}
        fill="color-mix(in oklab, var(--bg-surface) 55%, transparent)"
      />
      <text
        x={cx}
        y={cy + 3.5}
        textAnchor="middle"
        className="select-none fill-[var(--text-main)] text-[9px] font-bold"
      >
        {marker}
      </text>

      {interactive && hovered && (
        <text
          x={cx}
          y={item.y + item.h + 16}
          textAnchor="middle"
          className="select-none fill-[var(--text-main)] text-[10px] font-semibold"
        >
          Click to book
        </text>
      )}
    </g>
  );
};

export default DeskItem;
