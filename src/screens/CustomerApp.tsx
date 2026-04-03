import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FiCalendar,
  FiChevronDown,
  FiGrid,
  FiLayout,
  FiList,
  FiMap,
  FiSearch,
} from "react-icons/fi";
import BookingModal from "../components/BookingModal";
import Calendar from "../components/Calendar";
import { FloorPlan } from "../components";
import {
  floorPlanLevels,
  getFloorPlanByLevel,
  bookings as mockBookings,
} from "../mockData";
import { Booking, BookingRequest, FloorPlanItem } from "../types";

type CustomerViewTab = "day" | "month" | "map" | "grid";
type StatusFilter = "all" | "available" | "occupied" | "pending";
type TypeFilter = "all" | "desk" | "room";

const viewTabs: Array<{
  id: CustomerViewTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: "day", label: "Day", icon: FiLayout },
  { id: "month", label: "Month", icon: FiCalendar },
  { id: "map", label: "Map", icon: FiMap },
  { id: "grid", label: "Grid", icon: FiGrid },
];

const CustomerApp: React.FC = () => {
  const [tab, setTab] = useState<CustomerViewTab>("map");
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [bookingRequest, setBookingRequest] = useState<BookingRequest | null>(
    null,
  );
  const [bookingOpen, setBookingOpen] = useState(false);
  const [dateValue, setDateValue] = useState("2026-04-03");
  const [level, setLevel] =
    useState<(typeof floorPlanLevels)[number]>("Level 1");
  const [timeValue, setTimeValue] = useState(9);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");

  const currentFloorPlan = useMemo(() => getFloorPlanByLevel(level), [level]);
  const currentFloorItems = currentFloorPlan.items;
  const currentFloorZones = currentFloorPlan.zones;

  const activeFloorItem = useMemo(
    () =>
      currentFloorItems.find(
        (item: FloorPlanItem) => item.id === bookingRequest?.roomId,
      ) ?? null,
    [bookingRequest, currentFloorItems],
  );

  const occupancyRate = useMemo(() => {
    const desks = currentFloorItems.filter((item) => item.type === "desk");
    const occupied = desks.filter((item) => item.status === "occupied").length;
    return desks.length > 0 ? Math.round((occupied / desks.length) * 100) : 0;
  }, [currentFloorItems]);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    const zoneNameById = new Map(
      currentFloorZones.map((zone) => [zone.id, zone.name.toLowerCase()]),
    );

    return currentFloorItems.filter((item) => {
      const zoneName = item.zone ? (zoneNameById.get(item.zone) ?? "") : "";
      const textMatch =
        q.length === 0 ||
        [item.id, item.name, item.label ?? "", zoneName].some((value) =>
          value.toLowerCase().includes(q),
        );

      const statusMatch =
        statusFilter === "all" ? true : item.status === statusFilter;

      const typeMatch =
        typeFilter === "all"
          ? true
          : typeFilter === "room"
            ? item.type === "room" || item.type === "open-area"
            : item.type === "desk";

      return textMatch && statusMatch && typeMatch;
    });
  }, [query, statusFilter, typeFilter, currentFloorItems, currentFloorZones]);

  const filteredZones = useMemo(() => {
    if (!query.trim() && statusFilter === "all" && typeFilter === "all") {
      return currentFloorZones;
    }
    const used = new Set(
      filteredItems.map((item) => item.zone).filter(Boolean),
    );
    return currentFloorZones.filter((zone) => used.has(zone.id));
  }, [query, statusFilter, typeFilter, filteredItems, currentFloorZones]);

  const isFiltered =
    query.trim().length > 0 || statusFilter !== "all" || typeFilter !== "all";

  const handleCreateBooking = (request: BookingRequest) => {
    const start = new Date(request.time);
    const end = new Date(start.getTime() + 60 * 60 * 1000);

    setBookings((current) => [
      {
        id: `bk-${Date.now()}`,
        room: request.roomName,
        type: "Conference",
        start: start.toISOString(),
        end: end.toISOString(),
        owner: "You",
        title: `Booking ${request.roomName}`,
        status: "confirmed",
      },
      ...current,
    ]);

    setBookingOpen(false);
  };

  const mapTabToCalendarView = (tab: CustomerViewTab) => {
    if (tab === "day") return "day" as const;
    if (tab === "month") return "month" as const;
    return "grid" as const;
  };

  const handleBookingMove = (id: string, newStart: string, newEnd: string) => {
    setBookings((current) =>
      current.map((booking) =>
        booking.id === id
          ? { ...booking, start: newStart, end: newEnd }
          : booking,
      ),
    );
  };

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr] xl:items-center">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
              Flexible Office Booking
            </p>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Find space quickly, then book in one tap
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              {viewTabs.map((item) => {
                const Icon = item.icon;
                const active = tab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setTab(item.id)}
                    className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                      active
                        ? "bg-primary-600 text-white shadow-lg shadow-primary-900/20"
                        : "border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <label className="flex h-11 min-w-[220px] items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
              <FiSearch className="h-4 w-4" />
              <input
                placeholder="Search room, desk, team..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full bg-transparent outline-none"
              />
            </label>
            <div className="rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-700">
              <span className="text-slate-500 dark:text-slate-400">
                Occupancy
              </span>
              <p className="font-bold text-slate-900 dark:text-slate-100">
                {occupancyRate}%
              </p>
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {(
            [
              { id: "all", label: "All status" },
              { id: "available", label: "Available" },
              { id: "occupied", label: "Occupied" },
              { id: "pending", label: "Pending" },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              onClick={() => setStatusFilter(item.id)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                statusFilter === item.id
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                  : "border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              {item.label}
            </button>
          ))}

          {(
            [
              { id: "all", label: "All type" },
              { id: "desk", label: "Desk" },
              { id: "room", label: "Room" },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              onClick={() => setTypeFilter(item.id)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                typeFilter === item.id
                  ? "bg-primary-600 text-white"
                  : "border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              {item.label}
            </button>
          ))}

          {isFiltered && (
            <button
              onClick={() => {
                setQuery("");
                setStatusFilter("all");
                setTypeFilter("all");
              }}
              className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Clear filters
            </button>
          )}
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-[auto_auto_1fr]">
          <label className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 px-3 text-sm dark:border-slate-700">
            <FiCalendar className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            <input
              type="date"
              value={dateValue}
              onChange={(event) => setDateValue(event.target.value)}
              className="bg-transparent outline-none"
            />
          </label>

          <label className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 px-3 text-sm dark:border-slate-700">
            <FiList className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            <select
              value={level}
              onChange={(event) =>
                setLevel(event.target.value as (typeof floorPlanLevels)[number])
              }
              className="bg-transparent outline-none"
            >
              {floorPlanLevels.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <FiChevronDown className="h-4 w-4 text-slate-500 dark:text-slate-400" />
          </label>

          <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700">
            <span className="text-sm text-slate-600 dark:text-slate-300">
              {timeValue}:00
            </span>
            <input
              type="range"
              min={6}
              max={22}
              value={timeValue}
              onChange={(event) => setTimeValue(Number(event.target.value))}
              className="h-2 w-full accent-primary-600"
            />
            <span className="text-sm text-slate-600 dark:text-slate-300">
              22:00
            </span>
          </div>
        </div>
      </section>

      {tab === "map" ? (
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={level}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <FloorPlan
              items={filteredItems}
              zones={filteredZones}
              onBook={(request: BookingRequest) => {
                setBookingRequest(request);
                setBookingOpen(true);
              }}
              emptyMessage="No matching spaces for current filters"
            />
          </motion.div>
        </AnimatePresence>
      ) : (
        <Calendar
          view={mapTabToCalendarView(tab)}
          date={
            new Date(`${dateValue}T${String(timeValue).padStart(2, "0")}:00:00`)
          }
          bookings={bookings}
          loading={false}
          onBookingClick={setSelectedBooking}
          onBookingMove={handleBookingMove}
        />
      )}

      <AnimatePresence>
        {selectedBooking && (
          <BookingModal
            mode="details"
            booking={selectedBooking}
            onClose={() => setSelectedBooking(null)}
            onDelete={(id) => {
              setBookings((current) =>
                current.filter((booking) => booking.id !== id),
              );
              setSelectedBooking(null);
            }}
            onEdit={(booking: Booking) => setSelectedBooking(booking)}
          />
        )}
        {bookingOpen && bookingRequest && (
          <BookingModal
            mode="booking"
            floorPlanItem={activeFloorItem}
            initialRequest={bookingRequest}
            onClose={() => setBookingOpen(false)}
            onConfirm={handleCreateBooking}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomerApp;
