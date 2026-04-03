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
    fill: "rgba(34, 197, 94, 0.24)",
    stroke: "#22C55E",
    badge: "#22C55E",
  },
  occupied: {
    fill: "rgba(156, 163, 175, 0.26)",
    stroke: "#9CA3AF",
    badge: "#9CA3AF",
  },
  pending: {
    fill: "rgba(129, 140, 248, 0.26)",
    stroke: "#818CF8",
    badge: "#818CF8",
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
    .slice(-2);
  const interactive = item.status !== "occupied";

  return (
    <g
      onPointerEnter={(event) => onPointerEnter(item, event)}
      onPointerLeave={onPointerLeave}
      onClick={() => onClick(item)}
      style={{ cursor: interactive ? "pointer" : "not-allowed" }}
    >
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
            ? "drop-shadow(0 4px 8px rgba(99, 102, 241, 0.2))"
            : "none",
        }}
      />
      <circle cx={cx} cy={cy} r={item.w / 3.1} fill="rgba(255,255,255,0.25)" />
      <text
        x={cx}
        y={cy + 4}
        textAnchor="middle"
        className="select-none fill-white text-[10px] font-bold"
      >
        {marker}
      </text>

      {interactive && (
        <g
          transform={`translate(${cx + item.w / 2 - 5}, ${cy - item.w / 2 + 5})`}
        >
          <circle
            cx={0}
            cy={0}
            r={hovered ? 7 : 6}
            fill="white"
            stroke={color.badge}
            strokeWidth="1.5"
          />
          <line
            x1={-3}
            y1={0}
            x2={3}
            y2={0}
            stroke={color.badge}
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <line
            x1={0}
            y1={-3}
            x2={0}
            y2={3}
            stroke={color.badge}
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </g>
      )}
    </g>
  );
};

export default DeskItem;
