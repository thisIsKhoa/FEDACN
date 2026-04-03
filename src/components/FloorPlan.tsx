import React, { useEffect, useMemo, useRef, useState } from "react";
import { BookingRequest, FloorPlanItem, FloorPlanZone } from "../types";
import DeskItem from "./DeskItem";
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
  const panStartRef = useRef<Point | null>(null);
  const panOriginRef = useRef<Point>({ x: 0, y: 0 });

  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [hoveredZoneId, setHoveredZoneId] = useState<string | null>(null);
  const [hoveredItem, setHoveredItem] = useState<FloorPlanItem | null>(null);
  const [pinnedItem, setPinnedItem] = useState<FloorPlanItem | null>(null);
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

  const zonesMap = useMemo(() => zoneById(zones), [zones]);
  const isLevelOneLayout = useMemo(() => {
    const ids = new Set(zones.map((zone) => zone.id));
    return ["leadership", "neutral", "sales", "engineering", "marketing"].every(
      (id) => ids.has(id),
    );
  }, [zones]);

  const fitToContent = () => {
    if (items.length === 0 && zones.length === 0) return;

    const padding = 36;
    const boxMinX = [
      ...items.map((item) => item.x),
      ...zones.map((zone) => zone.x),
    ];
    const boxMinY = [
      ...items.map((item) => item.y),
      ...zones.map((zone) => zone.y),
    ];
    const boxMaxX = [
      ...items.map((item) => item.x + item.w),
      ...zones.map((zone) => zone.x + zone.w),
    ];
    const boxMaxY = [
      ...items.map((item) => item.y + item.h),
      ...zones.map((zone) => zone.y + zone.h),
    ];

    const minX = Math.min(...boxMinX) - padding;
    const minY = Math.min(...boxMinY) - padding;
    const maxX = Math.max(...boxMaxX) + padding;
    const maxY = Math.max(...boxMaxY) + padding;

    const contentWidth = Math.max(1, maxX - minX);
    const contentHeight = Math.max(1, maxY - minY);

    // Fit in SVG viewBox coordinates to keep centering stable across screen sizes.
    const viewportWidth = BOARD_WIDTH;
    const viewportHeight = BOARD_HEIGHT;

    const nextScale = clamp(
      Math.min(viewportWidth / contentWidth, viewportHeight / contentHeight),
      MIN_SCALE,
      MAX_SCALE,
    );

    setScale(nextScale);
    setOffset({
      x: (viewportWidth - contentWidth * nextScale) / 2 - minX * nextScale,
      y: (viewportHeight - contentHeight * nextScale) / 2 - minY * nextScale,
    });
  };

  useEffect(() => {
    fitToContent();
  }, [items, zones]);

  const toBoardCoordinates = (point: Point) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return point;
    return {
      x: (point.x * BOARD_WIDTH) / rect.width,
      y: (point.y * BOARD_HEIGHT) / rect.height,
    };
  };

  const zoomAtPoint = (nextScale: number, origin: Point) => {
    const clampedScale = clamp(nextScale, MIN_SCALE, MAX_SCALE);
    setOffset((currentOffset) => {
      const worldX = (origin.x - currentOffset.x) / scale;
      const worldY = (origin.y - currentOffset.y) / scale;
      return {
        x: origin.x - worldX * clampedScale,
        y: origin.y - worldY * clampedScale,
      };
    });
    setScale(clampedScale);
  };

  const handleWheel = (event: WheelEvent) => {
    event.preventDefault();
    const local = getClientPoint(event, containerRef.current);
    const boardPoint = toBoardCoordinates(local);
    const direction = event.deltaY > 0 ? -1 : 1;
    const factor = direction > 0 ? 1.12 : 0.9;
    zoomAtPoint(scale * factor, boardPoint);
  };

  useEffect(() => {
    const host = containerRef.current;
    if (!host) return;

    const listener = (event: WheelEvent) => handleWheel(event);
    host.addEventListener("wheel", listener, { passive: false });
    return () => host.removeEventListener("wheel", listener);
  }, [scale]);

  const handlePointerDown = (event: React.PointerEvent<SVGSVGElement>) => {
    const target = event.target as SVGElement;
    if (target.closest("[data-no-pan='true']")) return;

    const startPoint = getClientPoint(event, containerRef.current);
    panStartRef.current = toBoardCoordinates(startPoint);
    panOriginRef.current = offset;
    setIsPanning(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<SVGSVGElement>) => {
    if (!isPanning || !panStartRef.current) return;
    const currentPoint = toBoardCoordinates(
      getClientPoint(event, containerRef.current),
    );
    setOffset({
      x: panOriginRef.current.x + (currentPoint.x - panStartRef.current.x),
      y: panOriginRef.current.y + (currentPoint.y - panStartRef.current.y),
    });
  };

  const handlePointerUp = (event: React.PointerEvent<SVGSVGElement>) => {
    if (!isPanning) return;
    setIsPanning(false);
    panStartRef.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const handleItemHover = (
    item: FloorPlanItem,
    event: React.PointerEvent<SVGGElement>,
  ) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    setHoveredItem(item);
    setHoveredZoneId(item.zone ?? null);
    setTooltipPoint({
      x: event.clientX - rect.left + 14,
      y: event.clientY - rect.top + 14,
    });
  };

  const handleItemLeave = () => {
    setHoveredItem(null);
    setHoveredZoneId(null);
  };

  const handleBook = (item: FloorPlanItem) => {
    setSelectedIds([item.id]);
    setPinnedItem(item);
    setHoveredZoneId(item.zone ?? null);

    const x = offset.x + (item.x + item.w / 2) * scale + 14;
    const y = offset.y + (item.y + item.h / 2) * scale + 14;
    setTooltipPoint({ x, y });

    zoomAtPoint(scale * 1.08, {
      x: offset.x + (item.x + item.w / 2) * scale,
      y: offset.y + (item.y + item.h / 2) * scale,
    });
  };

  const activeTooltipItem = pinnedItem ?? hoveredItem;
  const activeZoneId = pinnedItem?.zone ?? hoveredZoneId;
  const zoneTier: Record<string, string> = {
    neutral: "Public",
    leadership: "Public",
    sales: "Semi-private",
    engineering: "Semi-private",
    marketing: "Private",
  };

  const viewport = {
    x: Math.max(0, -offset.x / scale),
    y: Math.max(0, -offset.y / scale),
    w: Math.min(BOARD_WIDTH, BOARD_WIDTH / scale),
    h: Math.min(BOARD_HEIGHT, BOARD_HEIGHT / scale),
  };

  const openPinnedBooking = () => {
    if (!pinnedItem || pinnedItem.status === "occupied") return;
    const now = new Date();
    onBook({
      roomId: pinnedItem.id,
      roomName: pinnedItem.name,
      time: toLocalDateTimeValue(now),
      attendees: Math.max(1, pinnedItem.capacity),
      notes: "",
    });
  };

  const zoomBy = (factor: number) =>
    zoomAtPoint(scale * factor, { x: BOARD_WIDTH / 2, y: BOARD_HEIGHT / 2 });

  return (
    <div
      ref={containerRef}
      className="relative mx-auto h-[78vh] w-full overflow-hidden rounded-2xl border border-white/30 bg-[var(--bg-base)] shadow-[0_14px_42px_-24px_rgba(15,23,42,0.45)] md:h-[84vh] dark:border-white/10"
      style={{ touchAction: "auto", overscrollBehavior: "auto" }}
    >
      <div className="absolute right-4 top-4 z-20 flex items-center gap-2 rounded-xl border border-white/45 bg-[var(--overlay-bg)] px-2 py-1.5 shadow-lg backdrop-blur-lg dark:border-white/10">
        <button
          type="button"
          onClick={() => zoomBy(1.15)}
          className="rounded-md border border-[var(--border-subtle)] px-2 py-1 text-xs font-semibold text-[var(--text-main)]"
        >
          +
        </button>
        <button
          type="button"
          onClick={() => zoomBy(0.87)}
          className="rounded-md border border-[var(--border-subtle)] px-2 py-1 text-xs font-semibold text-[var(--text-main)]"
        >
          -
        </button>
        <button
          type="button"
          onClick={fitToContent}
          className="rounded-md border border-[var(--border-subtle)] px-2 py-1 text-[11px] font-semibold text-[var(--text-main)]"
        >
          Fit
        </button>
      </div>

      <div className="absolute bottom-4 right-4 z-20 max-w-[calc(100%-2rem)] rounded-xl border border-white/45 bg-[var(--overlay-bg)] px-3 py-2 shadow-xl backdrop-blur-lg dark:border-white/10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-secondary)]">
          Seat Status
        </p>
        <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-[var(--text-secondary)]">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--state-success-solid)]" />{" "}
            Available
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--state-neutral-solid)]" />{" "}
            Occupied
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--state-warning-solid)]" />{" "}
            Pending
          </span>
        </div>
        <p className="mt-2 text-[11px] text-[var(--text-secondary)]">
          Desk type is shown by prefix: HD, DD, PO.
        </p>
        <p className="mt-1.5 text-[11px] font-medium text-[var(--text-main)] opacity-85">
          Drag to pan, scroll to zoom, click any seat/room to view details.
        </p>
      </div>

      <svg
        viewBox={`0 0 ${BOARD_WIDTH} ${BOARD_HEIGHT}`}
        preserveAspectRatio="xMidYMid meet"
        className={`block h-full w-full ${isPanning ? "cursor-grabbing" : "cursor-grab"}`}
        onClick={() => {
          setPinnedItem(null);
          setHoveredZoneId(null);
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        role="img"
        aria-label="Interactive office floor plan"
      >
        <defs>
          <filter id="softShadow" x="-25%" y="-25%" width="150%" height="150%">
            <feDropShadow
              dx="0"
              dy="5"
              stdDeviation="6"
              floodColor="var(--shadow-color)"
              floodOpacity="0.12"
            />
          </filter>
          {zones.map((zone) => (
            <linearGradient
              key={`grad-${zone.id}`}
              id={`zoneGrad-${zone.id}`}
              x1="0"
              y1="0"
              x2="1"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor={`color-mix(in oklab, ${zone.color} 13%, var(--bg-surface))`}
              />
              <stop
                offset="100%"
                stopColor={`color-mix(in oklab, ${zone.color} 4%, var(--bg-base))`}
              />
            </linearGradient>
          ))}
        </defs>

        <rect
          x={0}
          y={0}
          width={BOARD_WIDTH}
          height={BOARD_HEIGHT}
          fill="var(--bg-base)"
        />

        <g
          transform={`translate(${offset.x}, ${offset.y}) scale(${scale})`}
          filter="url(#softShadow)"
        >
          {isLevelOneLayout && (
            <>
              <rect
                x={20}
                y={244}
                width={939}
                height={24}
                rx={12}
                fill="color-mix(in oklab, var(--bg-surface) 82%, transparent)"
                stroke="var(--border-subtle)"
                strokeOpacity={0.35}
                strokeWidth={0.8}
              />
              <rect
                x={314}
                y={280}
                width={24}
                height={300}
                rx={12}
                fill="color-mix(in oklab, var(--bg-surface) 82%, transparent)"
                stroke="var(--border-subtle)"
                strokeOpacity={0.35}
                strokeWidth={0.8}
              />
              <rect
                x={641}
                y={280}
                width={24}
                height={300}
                rx={12}
                fill="color-mix(in oklab, var(--bg-surface) 82%, transparent)"
                stroke="var(--border-subtle)"
                strokeOpacity={0.35}
                strokeWidth={0.8}
              />

              <g>
                <rect
                  x={402}
                  y={10}
                  width={128}
                  height={20}
                  rx={8}
                  fill="color-mix(in oklab, var(--bg-surface) 90%, transparent)"
                  stroke="var(--brand-primary)"
                  strokeWidth={1}
                  strokeDasharray="5 3"
                />
                <text
                  x={466}
                  y={24.5}
                  textAnchor="middle"
                  className="select-none fill-[var(--brand-primary)] text-[10px] font-semibold tracking-[0.08em]"
                >
                  MAIN ENTRANCE
                </text>
              </g>

              <g>
                <rect
                  x={886}
                  y={170}
                  width={60}
                  height={48}
                  rx={10}
                  fill="color-mix(in oklab, var(--bg-surface) 94%, transparent)"
                  stroke="var(--text-secondary)"
                  strokeOpacity={0.65}
                  strokeWidth={0.9}
                />
                <path
                  d="M 904 205 V 183 M 928 205 V 183"
                  stroke="var(--text-secondary)"
                  strokeWidth={1.4}
                  strokeLinecap="round"
                />
                <path
                  d="M 904 191 L 916 179 L 928 191"
                  fill="none"
                  stroke="var(--text-secondary)"
                  strokeWidth={1.3}
                  strokeLinecap="round"
                />
                <text
                  x={916}
                  y={212}
                  textAnchor="middle"
                  className="select-none fill-[var(--text-secondary)] text-[8.5px] font-semibold"
                >
                  ELEVATOR
                </text>
              </g>
            </>
          )}

          {zones.map((zone) => (
            <g
              key={zone.id}
              onPointerEnter={() => setHoveredZoneId(zone.id)}
              onPointerLeave={() => setHoveredZoneId(null)}
            >
              <rect
                x={zone.x}
                y={zone.y}
                width={zone.w}
                height={zone.h}
                rx={18}
                fill={`url(#zoneGrad-${zone.id})`}
                fillOpacity={
                  activeZoneId && activeZoneId !== zone.id ? 0.48 : 1
                }
                stroke={zone.color}
                strokeOpacity={0.25}
                strokeWidth={0.6}
                transform={`translate(${zone.x + zone.w / 2} ${zone.y + zone.h / 2}) scale(${
                  activeZoneId === zone.id ? 1.012 : 1
                }) translate(${-zone.x - zone.w / 2} ${-zone.y - zone.h / 2})`}
                style={{ transition: "all 180ms ease-out" }}
              />
            </g>
          ))}

          {items.map((item) => {
            const isHovered = hoveredItem?.id === item.id;
            const selected = selectedIds.includes(item.id);

            const shared = {
              item,
              selected,
              onPointerEnter: handleItemHover,
              onPointerLeave: handleItemLeave,
              onClick: handleBook,
            };

            return item.type === "desk" ? (
              <DeskItem key={item.id} {...shared} hovered={isHovered} />
            ) : (
              <RoomItem key={item.id} {...shared} hovered={isHovered} />
            );
          })}

          {zones.map((zone) => {
            const tier = zoneTier[zone.id] ?? "Workspace";
            const zoneLabel = `${zone.name} · ${tier}`;
            const labelWidth = Math.max(176, zoneLabel.length * 5.35 + 24);
            const chipX = zone.x + 10;
            const chipY = Math.max(4, zone.y - 18);
            return (
              <g key={`label-${zone.id}`} pointerEvents="none">
                <rect
                  x={chipX}
                  y={chipY}
                  width={labelWidth}
                  height={18}
                  rx={9}
                  fill="color-mix(in oklab, var(--bg-surface) 88%, transparent)"
                  stroke="var(--border-subtle)"
                  strokeOpacity={0.4}
                  strokeWidth={0.7}
                />
                <text
                  x={chipX + 8}
                  y={chipY + 12.5}
                  className="select-none fill-[var(--text-secondary)] text-[10px] font-semibold"
                >
                  {zoneLabel}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      <Tooltip
        item={
          activeTooltipItem
            ? {
                ...activeTooltipItem,
                name:
                  activeTooltipItem.zone && zonesMap.get(activeTooltipItem.zone)
                    ? `${activeTooltipItem.name} · ${zonesMap.get(activeTooltipItem.zone)?.name}`
                    : activeTooltipItem.name,
              }
            : null
        }
        x={tooltipPoint.x}
        y={tooltipPoint.y}
      />

      <div
        className={`pointer-events-none absolute inset-0 z-10 bg-[var(--overlay-bg)] transition-all duration-300 ${
          pinnedItem ? "opacity-50 backdrop-blur-[1.5px]" : "opacity-0"
        }`}
      />

      <aside
        className={`absolute right-0 top-0 z-40 h-full w-[340px] border-l border-[var(--border-subtle)] bg-[var(--overlay-bg)] p-4 shadow-2xl backdrop-blur-xl transition-transform duration-300 ${
          pinnedItem ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {pinnedItem && (
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-secondary)]">
                  Selected Space
                </p>
                <h3 className="mt-1 text-lg font-bold text-[var(--text-main)]">
                  {pinnedItem.name}
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  {pinnedItem.label ?? pinnedItem.id} · {pinnedItem.type}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPinnedItem(null)}
                className="rounded-lg border border-[var(--border-subtle)] px-2 py-1 text-xs font-semibold text-[var(--text-main)]"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl bg-[var(--bg-surface)]/70 p-2 text-xs text-[var(--text-secondary)]">
                Capacity
                <p className="mt-1 text-sm font-semibold text-[var(--text-main)]">
                  {pinnedItem.capacity} seats
                </p>
              </div>
              <div className="rounded-xl bg-[var(--bg-surface)]/70 p-2 text-xs text-[var(--text-secondary)]">
                Status
                <p className="mt-1 text-sm font-semibold capitalize text-[var(--text-main)]">
                  {pinnedItem.status}
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-[var(--bg-surface)]/70 p-3 text-xs text-[var(--text-secondary)]">
              <p className="font-semibold uppercase tracking-[0.1em]">
                Booking Window
              </p>
              <p className="mt-2 text-sm text-[var(--text-main)]">
                {pinnedItem.status === "occupied"
                  ? "Booked: 09:00 - 12:00"
                  : pinnedItem.status === "pending"
                    ? "Pending approval: 13:00 - 15:00"
                    : "Available now"}
              </p>
            </div>

            <button
              type="button"
              onClick={openPinnedBooking}
              disabled={pinnedItem.status === "occupied"}
              className="w-full rounded-xl bg-[var(--brand-primary)] px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-[var(--state-neutral-solid)]"
            >
              {pinnedItem.status === "occupied"
                ? "Currently Occupied"
                : "Create Booking"}
            </button>
          </div>
        )}
      </aside>

      <div className="absolute bottom-4 left-4 z-30 rounded-xl border border-[var(--border-subtle)] bg-[var(--overlay-bg)] p-2 backdrop-blur-lg">
        <p className="px-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--text-secondary)]">
          Mini Map
        </p>
        <svg
          viewBox={`0 0 ${BOARD_WIDTH} ${BOARD_HEIGHT}`}
          className="mt-1 h-[96px] w-[152px] rounded-lg bg-[var(--bg-base)]/90"
        >
          {zones.map((zone) => (
            <rect
              key={`mini-${zone.id}`}
              x={zone.x}
              y={zone.y}
              width={zone.w}
              height={zone.h}
              rx={10}
              fill={zone.bgColor}
              stroke={zone.color}
              strokeWidth={0.8}
              opacity={0.75}
            />
          ))}
          <rect
            x={viewport.x}
            y={viewport.y}
            width={viewport.w}
            height={viewport.h}
            fill="none"
            stroke="var(--brand-primary)"
            strokeWidth={2}
          />
        </svg>
      </div>

      {items.length === 0 && (
        <div
          className="absolute inset-0 z-30 grid place-items-center backdrop-blur-sm"
          style={{ backgroundColor: "var(--overlay-bg)" }}
        >
          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-6 py-4 text-center">
            <p className="text-sm font-semibold text-[var(--text-main)]">
              {emptyMessage ?? "No matching desks or rooms"}
            </p>
            <p className="mt-1 text-xs text-[var(--text-secondary)]">
              Adjust filters and try again.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloorPlan;
