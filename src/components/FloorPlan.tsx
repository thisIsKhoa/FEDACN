import React, { useEffect, useMemo, useRef, useState } from "react";
import { BookingRequest, FloorPlanItem, FloorPlanZone } from "../types";
import DeskItem from "./DeskItem";
import OccupancyIndicator from "./OccupancyIndicator";
import RoomItem from "./RoomItem";
import Tooltip from "./Tooltip";

interface FloorPlanProps {
  items: FloorPlanItem[];
  zones?: FloorPlanZone[];
  onBook: (request: BookingRequest) => void;
  onSelectionChange?: (selectedIds: string[]) => void;
  emptyMessage?: string;
}

type Point = { x: number; y: number };

const BOARD_WIDTH = 980;
const BOARD_HEIGHT = 620;
const MIN_SCALE = 0.72;
const MAX_SCALE = 2.25;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const toLocalDateTimeValue = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  const hours = `${date.getHours()}`.padStart(2, "0");
  const minutes = `${date.getMinutes()}`.padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const getClientPoint = (
  event: { clientX: number; clientY: number },
  container: HTMLDivElement | null,
): Point => {
  const rect = container?.getBoundingClientRect();
  if (!rect) return { x: 0, y: 0 };
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
};

const zoneById = (zones: FloorPlanZone[] | undefined) => {
  const map = new Map<string, FloorPlanZone>();
  zones?.forEach((zone) => map.set(zone.id, zone));
  return map;
};

const FloorPlan: React.FC<FloorPlanProps> = ({
  items,
  zones = [],
  onBook,
  onSelectionChange,
  emptyMessage,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });
  const [hoveredItem, setHoveredItem] = useState<FloorPlanItem | null>(null);
  const [tooltipPoint, setTooltipPoint] = useState<Point>({ x: 0, y: 0 });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new ResizeObserver(() => undefined);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    onSelectionChange?.(selectedIds);
  }, [onSelectionChange, selectedIds]);

  const desks = useMemo(
    () => items.filter((item) => item.type === "desk"),
    [items],
  );

  const occupancy = useMemo(() => {
    const total = desks.length;
    const occupied = desks.filter((item) => item.status === "occupied").length;
    const available = desks.filter(
      (item) => item.status === "available",
    ).length;
    return { total, occupied, available };
  }, [desks]);

  const zonesMap = useMemo(() => zoneById(zones), [zones]);

  const fitToContent = () => {
    const container = containerRef.current;
    if (!container || items.length === 0) return;

    const padding = 36;
    const minX = Math.min(...items.map((item) => item.x)) - padding;
    const minY = Math.min(...items.map((item) => item.y)) - padding;
    const maxX = Math.max(...items.map((item) => item.x + item.w)) + padding;
    const maxY = Math.max(...items.map((item) => item.y + item.h)) + padding;

    const contentWidth = Math.max(1, maxX - minX);
    const contentHeight = Math.max(1, maxY - minY);

    const nextScale = clamp(
      Math.min(
        container.clientWidth / contentWidth,
        container.clientHeight / contentHeight,
      ),
      MIN_SCALE,
      MAX_SCALE,
    );

    setScale(nextScale);
    setOffset({
      x:
        (container.clientWidth - contentWidth * nextScale) / 2 -
        minX * nextScale,
      y:
        (container.clientHeight - contentHeight * nextScale) / 2 -
        minY * nextScale,
    });
  };

  useEffect(() => {
    fitToContent();
    // Keep viewport fitted after filter change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  const handleItemHover = (
    item: FloorPlanItem,
    event: React.PointerEvent<SVGGElement>,
  ) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    setHoveredItem(item);
    setTooltipPoint({
      x: event.clientX - rect.left + 14,
      y: event.clientY - rect.top + 14,
    });
  };

  const handleBook = (item: FloorPlanItem) => {
    if (item.status === "occupied") return;

    setSelectedIds([item.id]);
    const now = new Date();
    onBook({
      roomId: item.id,
      roomName: item.name,
      time: toLocalDateTimeValue(now),
      attendees: Math.max(1, item.capacity),
      notes: "",
    });
  };

  return (
    <div
      ref={containerRef}
      className="relative h-[78vh] overflow-hidden rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] md:h-[84vh]"
      style={{ touchAction: "auto", overscrollBehavior: "auto" }}
    >
      <div className="absolute left-4 top-4 z-20">
        <OccupancyIndicator
          total={occupancy.total}
          occupied={occupancy.occupied}
          available={occupancy.available}
        />
      </div>

      <div className="absolute left-4 top-[126px] z-20 rounded-xl border border-[#E5E7EB] bg-white/90 px-3 py-2 text-xs text-slate-600 backdrop-blur">
        Map is fixed. Mouse wheel scroll behaves normally.
      </div>

      <div className="absolute left-4 bottom-4 z-20 rounded-xl border border-[#E5E7EB] bg-white/90 px-3 py-2 backdrop-blur">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
          Legend
        </p>
        <div className="mt-1.5 flex items-center gap-3 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#22C55E]" /> Available
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#9CA3AF]" /> Occupied
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#818CF8]" /> Pending
          </span>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${BOARD_WIDTH} ${BOARD_HEIGHT}`}
        className="h-full w-full"
        role="img"
        aria-label="Interactive office floor plan"
      >
        <defs>
          <filter id="softShadow" x="-25%" y="-25%" width="150%" height="150%">
            <feDropShadow
              dx="0"
              dy="5"
              stdDeviation="6"
              floodColor="#0f172a"
              floodOpacity="0.12"
            />
          </filter>
        </defs>

        <rect
          x={0}
          y={0}
          width={BOARD_WIDTH}
          height={BOARD_HEIGHT}
          fill="#F8FAFC"
        />

        <g
          transform={`translate(${offset.x}, ${offset.y}) scale(${scale})`}
          filter="url(#softShadow)"
        >
          {zones.map((zone) => (
            <g key={zone.id}>
              <rect
                x={zone.x}
                y={zone.y}
                width={zone.w}
                height={zone.h}
                rx={16}
                fill={zone.bgColor}
                stroke={zone.color}
                strokeWidth={1.2}
              />
              <text
                x={zone.x + 12}
                y={zone.y + 22}
                className="select-none fill-slate-600 text-[12px] font-semibold"
              >
                {zone.name}
              </text>
            </g>
          ))}

          {items.map((item) => {
            const isHovered = hoveredItem?.id === item.id;
            const selected = selectedIds.includes(item.id);

            const shared = {
              item,
              selected,
              onPointerEnter: handleItemHover,
              onPointerLeave: () => setHoveredItem(null),
              onClick: handleBook,
            };

            return item.type === "desk" ? (
              <DeskItem key={item.id} {...shared} hovered={isHovered} />
            ) : (
              <RoomItem key={item.id} {...shared} />
            );
          })}
        </g>
      </svg>

      <Tooltip
        item={
          hoveredItem
            ? {
                ...hoveredItem,
                name:
                  hoveredItem.zone && zonesMap.get(hoveredItem.zone)
                    ? `${hoveredItem.name} · ${zonesMap.get(hoveredItem.zone)?.name}`
                    : hoveredItem.name,
              }
            : null
        }
        x={tooltipPoint.x}
        y={tooltipPoint.y}
      />

      {items.length === 0 && (
        <div className="absolute inset-0 z-30 grid place-items-center bg-white/80 backdrop-blur-sm">
          <div className="rounded-2xl border border-[#E5E7EB] bg-white px-6 py-4 text-center">
            <p className="text-sm font-semibold text-slate-800">
              {emptyMessage ?? "No matching desks or rooms"}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Adjust filters and try again.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloorPlan;
