import React from "react";
import { FloorPlanItem } from "../types";

interface RoomItemProps {
  item: FloorPlanItem;
  selected: boolean;
  hovered?: boolean;
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
    fill: "var(--state-success-bg)",
    stroke: "var(--state-success-solid)",
  },
  occupied: {
    fill: "var(--state-neutral-bg)",
    stroke: "var(--state-neutral-solid)",
  },
  pending: {
    fill: "var(--state-warning-bg)",
    stroke: "var(--state-warning-solid)",
  },
};

const RoomItem: React.FC<RoomItemProps> = ({
  item,
  selected,
  hovered = false,
  onPointerEnter,
  onPointerLeave,
  onClick,
}) => {
  const isOpenArea = item.type === "open-area";
  const isTableArea = isOpenArea && /table/i.test(item.name);
  const isLoungeArea = isOpenArea && /lounge|breakout|focus/i.test(item.name);
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
  const doorWidth = Math.max(20, Math.min(30, item.w * 0.2));
  const doorX = item.x + item.w / 2 - doorWidth / 2;
  const doorY = item.y + item.h - 2;
  const roomTitleClass =
    item.w < 86 ? "text-[11px]" : item.w < 110 ? "text-[12px]" : "text-[14px]";

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
      <rect
        x={item.x}
        y={item.y}
        width={item.w}
        height={item.h}
        rx={isOpenArea ? 18 : 14}
        fill={
          isTableArea
            ? "color-mix(in oklab, var(--bg-surface-hover) 70%, transparent)"
            : isOpenArea
              ? "color-mix(in oklab, var(--brand-primary) 10%, transparent)"
              : color.fill
        }
        stroke={isTableArea ? "var(--border-subtle)" : color.stroke}
        strokeWidth={selected ? 2.8 : isTableArea ? 1.3 : 1.6}
        style={{
          filter: selected
            ? "drop-shadow(0 4px 10px color-mix(in oklab, var(--brand-primary) 26%, transparent))"
            : "none",
        }}
        strokeDasharray={isLoungeArea ? "8 6" : undefined}
      />
      <rect
        x={item.x + 12}
        y={item.y + 12}
        width={Math.max(54, item.w - 24)}
        height={Math.max(24, item.h - 24)}
        rx={10}
        fill={
          isTableArea
            ? "color-mix(in oklab, var(--bg-surface) 94%, transparent)"
            : "color-mix(in oklab, var(--bg-surface) 42%, transparent)"
        }
        opacity={selected ? 0.9 : isTableArea ? 0.88 : 0.65}
      />
      {isTableArea && (
        <>
          <rect
            x={item.x + 9}
            y={item.y + 10}
            width={Math.max(48, item.w - 18)}
            height={Math.max(30, item.h - 24)}
            rx={12}
            fill="color-mix(in oklab, var(--bg-surface) 96%, transparent)"
            stroke="var(--border-subtle)"
            strokeWidth={1}
          />
          <rect
            x={item.x + 18}
            y={item.y + item.h - 18}
            width={Math.max(20, item.w - 36)}
            height={5}
            rx={3}
            fill="color-mix(in oklab, var(--state-neutral-bg) 72%, transparent)"
          />
        </>
      )}
      {item.type === "room" && (
        <>
          <rect
            x={doorX}
            y={doorY}
            width={doorWidth}
            height={6}
            rx={3}
            fill="var(--bg-base)"
            stroke="var(--border-subtle)"
            strokeWidth={0.8}
          />
          <path
            d={`M ${doorX + 2} ${doorY + 8} Q ${doorX + doorWidth / 2} ${
              doorY - 8
            } ${doorX + doorWidth - 2} ${doorY + 8}`}
            fill="none"
            stroke="var(--text-secondary)"
            strokeOpacity={0.65}
            strokeWidth={1}
          />
        </>
      )}
      {isLoungeArea && (
        <>
          {Array.from({ length: 3 }).map((_, idx) => {
            const sofaWidth = (item.w - 56) / 3;
            const sofaX = item.x + 16 + idx * (sofaWidth + 12);
            const sofaY = item.y + 22;
            return (
              <g key={`sofa-${item.id}-${idx}`}>
                <rect
                  x={sofaX}
                  y={sofaY}
                  width={sofaWidth}
                  height={20}
                  rx={9}
                  fill="color-mix(in oklab, var(--bg-surface) 78%, transparent)"
                  stroke="var(--border-subtle)"
                  strokeWidth={0.7}
                />
                <rect
                  x={sofaX + 6}
                  y={sofaY + 20}
                  width={sofaWidth - 12}
                  height={8}
                  rx={4}
                  fill="color-mix(in oklab, var(--state-neutral-bg) 70%, transparent)"
                />
              </g>
            );
          })}
        </>
      )}
      {isBoardRoom && (
        <>
          <rect
            x={tableX}
            y={tableY}
            width={tableWidth}
            height={tableHeight}
            rx={10}
            fill="var(--bg-surface)"
            stroke="var(--border-subtle)"
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
                fill="var(--bg-surface-hover)"
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
                fill="var(--bg-surface-hover)"
              />
            );
          })}
          <circle
            cx={tableX + tableWidth / 2}
            cy={tableY + tableHeight / 2}
            r={Math.max(5.5, tableHeight * 0.22)}
            fill="var(--state-success-solid)"
          />
          <rect
            x={projectorX}
            y={projectorY}
            width={projectorWidth}
            height={projectorHeight}
            rx={4}
            fill="var(--state-neutral-bg)"
          />
          <text
            x={projectorX + projectorWidth / 2}
            y={projectorY + projectorHeight / 2}
            textAnchor="middle"
            transform={`rotate(90 ${projectorX + projectorWidth / 2} ${
              projectorY + projectorHeight / 2
            })`}
            className="select-none fill-[var(--text-secondary)] text-[8px] font-semibold tracking-[0.1em]"
          >
            PROJECTOR
          </text>
        </>
      )}
      {(!isTableArea || hovered || selected) && (
        <text
          x={item.x + item.w / 2}
          y={
            isBoardRoom
              ? item.y + 18
              : isTableArea
                ? item.y + item.h / 2 + 3
                : item.y + item.h / 2 - 2
          }
          textAnchor="middle"
          className={`select-none fill-[var(--text-main)] font-bold ${
            isTableArea ? "text-[11px]" : roomTitleClass
          }`}
        >
          {item.name}
        </text>
      )}
      {!isTableArea && (
        <text
          x={item.x + item.w / 2}
          y={isBoardRoom ? item.y + item.h - 12 : item.y + item.h / 2 + 18}
          textAnchor="middle"
          className="select-none fill-[var(--text-main)] text-[12px] font-bold opacity-90"
        >
          {item.capacity} seats
        </text>
      )}
    </g>
  );
};

export default RoomItem;
