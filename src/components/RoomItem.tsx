import React from "react";
import { FloorPlanItem } from "../types";

interface RoomItemProps {
  item: FloorPlanItem;
  selected: boolean;
  onPointerEnter: (
    item: FloorPlanItem,
    event: React.PointerEvent<SVGGElement>,
  ) => void;
  onPointerLeave: () => void;
  onClick: (item: FloorPlanItem) => void;
}

const statusColors: Record<
  FloorPlanItem["status"],
  { fill: string; stroke: string }
> = {
  available: {
    fill: "rgba(34, 197, 94, 0.14)",
    stroke: "#22C55E",
  },
  occupied: {
    fill: "rgba(156, 163, 175, 0.16)",
    stroke: "#9CA3AF",
  },
  pending: {
    fill: "rgba(129, 140, 248, 0.16)",
    stroke: "#818CF8",
  },
};

const RoomItem: React.FC<RoomItemProps> = ({
  item,
  selected,
  onPointerEnter,
  onPointerLeave,
  onClick,
}) => {
  const isOpenArea = item.type === "open-area";
  const isBoardRoom = item.type === "room" && /board/i.test(item.name);
  const color = statusColors[item.status];
  const interactive = item.status !== "occupied";

  const tableWidth = item.w * 0.66;
  const tableHeight = item.h * 0.3;
  const tableX = item.x + (item.w - tableWidth) / 2;
  const tableY = item.y + (item.h - tableHeight) / 2;
  const chairWidth = Math.max(11, Math.min(20, item.w * 0.08));
  const chairHeight = Math.max(9, Math.min(16, item.h * 0.1));
  const chairsPerSide = Math.max(4, Math.min(7, Math.floor(item.capacity / 2)));
  const seatGap = tableWidth / (chairsPerSide + 1);
  const projectorWidth = Math.max(10, item.w * 0.045);
  const projectorHeight = Math.max(42, item.h * 0.62);
  const projectorX = item.x + item.w - projectorWidth - 10;
  const projectorY = item.y + (item.h - projectorHeight) / 2;

  return (
    <g
      onPointerEnter={(event) => onPointerEnter(item, event)}
      onPointerLeave={onPointerLeave}
      onClick={() => onClick(item)}
      style={{ cursor: interactive ? "pointer" : "not-allowed" }}
    >
      <rect
        x={item.x}
        y={item.y}
        width={item.w}
        height={item.h}
        rx={isOpenArea ? 18 : 14}
        fill={isOpenArea ? "rgba(99, 102, 241, 0.07)" : color.fill}
        stroke={color.stroke}
        strokeWidth={selected ? 2.8 : 1.6}
        style={{
          filter: selected
            ? "drop-shadow(0 4px 10px rgba(99, 102, 241, 0.16))"
            : "none",
        }}
        strokeDasharray={isOpenArea ? "8 6" : undefined}
      />
      <rect
        x={item.x + 12}
        y={item.y + 12}
        width={Math.max(54, item.w - 24)}
        height={Math.max(24, item.h - 24)}
        rx={10}
        fill="rgba(255,255,255,0.42)"
        opacity={selected ? 0.9 : 0.65}
      />
      {isBoardRoom && (
        <>
          <rect
            x={tableX}
            y={tableY}
            width={tableWidth}
            height={tableHeight}
            rx={10}
            fill="rgba(255,255,255,0.96)"
            stroke="#94A3B8"
            strokeWidth={1.1}
          />
          {Array.from({ length: chairsPerSide }).map((_, idx) => {
            const x = tableX + seatGap * (idx + 1) - chairWidth / 2;
            return (
              <rect
                key={`top-chair-${item.id}-${idx}`}
                x={x}
                y={tableY - chairHeight - 5}
                width={chairWidth}
                height={chairHeight}
                rx={Math.max(4, chairHeight * 0.45)}
                fill="rgba(191, 219, 254, 0.78)"
              />
            );
          })}
          {Array.from({ length: chairsPerSide }).map((_, idx) => {
            const x = tableX + seatGap * (idx + 1) - chairWidth / 2;
            return (
              <rect
                key={`bottom-chair-${item.id}-${idx}`}
                x={x}
                y={tableY + tableHeight + 5}
                width={chairWidth}
                height={chairHeight}
                rx={Math.max(4, chairHeight * 0.45)}
                fill="rgba(191, 219, 254, 0.78)"
              />
            );
          })}
          <circle
            cx={tableX + tableWidth / 2}
            cy={tableY + tableHeight / 2}
            r={Math.max(5.5, tableHeight * 0.22)}
            fill="#10B981"
          />
          <rect
            x={projectorX}
            y={projectorY}
            width={projectorWidth}
            height={projectorHeight}
            rx={4}
            fill="rgba(191, 219, 254, 0.7)"
          />
          <text
            x={projectorX + projectorWidth / 2}
            y={projectorY + projectorHeight / 2}
            textAnchor="middle"
            transform={`rotate(90 ${projectorX + projectorWidth / 2} ${
              projectorY + projectorHeight / 2
            })`}
            className="select-none fill-slate-500 text-[8px] font-semibold tracking-[0.1em]"
          >
            PROJECTOR
          </text>
        </>
      )}
      <text
        x={item.x + item.w / 2}
        y={isBoardRoom ? item.y + 18 : item.y + item.h / 2 - 2}
        textAnchor="middle"
        className="select-none fill-slate-800 text-[14px] font-semibold dark:fill-slate-100"
      >
        {item.name}
      </text>
      <text
        x={item.x + item.w / 2}
        y={isBoardRoom ? item.y + item.h - 12 : item.y + item.h / 2 + 18}
        textAnchor="middle"
        className="select-none fill-slate-500 text-[11px] dark:fill-slate-400"
      >
        {item.capacity} seats
      </text>
    </g>
  );
};

export default RoomItem;
