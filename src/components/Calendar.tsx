import React, { useMemo } from "react";
import { Booking, ViewMode } from "../types";
import { SPACE_COLOR } from "../mockData";

interface CalendarProps {
  view: ViewMode;
  date: Date;
  bookings: Booking[];
  loading?: boolean;
  onBookingClick: (booking: Booking) => void;
  onBookingMove: (id: string, newStart: string, newEnd: string) => void;
}

const HOURS = Array.from({ length: 15 }, (_, i) => 8 + i); // 8..22

const fromLocalDate = (date: Date) =>
  new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
    ),
  );

const normalizeDate = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);

const addDays = (date: Date, n: number) => {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
};

const calcPosition = (booking: Booking, targetDay: Date) => {
  const start = new Date(booking.start);
  const end = new Date(booking.end);

  const startOffset = start.getHours() + start.getMinutes() / 60 - 8;
  const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

  return {
    top: Math.max(0, startOffset * 60),
    height: Math.max(25, duration * 60),
  };
};

const isSameDay = (left: Date, right: Date) =>
  left.getFullYear() === right.getFullYear() &&
  left.getMonth() === right.getMonth() &&
  left.getDate() === right.getDate();

const Calendar: React.FC<CalendarProps> = ({
  view,
  date,
  bookings,
  loading,
  onBookingClick,
  onBookingMove,
}) => {
  const days = useMemo(() => {
    if (view === "day") return [normalizeDate(date)];
    if (view === "week") {
      const startOfWeek = new Date(date);
      const offset = (startOfWeek.getDay() + 6) % 7; // Monday=0
      startOfWeek.setDate(startOfWeek.getDate() - offset);
      return Array.from({ length: 7 }, (_, i) => addDays(startOfWeek, i));
    }
    if (view === "month") {
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const startOffset = (startOfMonth.getDay() + 6) % 7;
      const gridStart = addDays(startOfMonth, -startOffset);
      return Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
    }
    return [];
  }, [view, date]);

  const resources = useMemo(
    () => Array.from(new Set(bookings.map((b) => b.room))),
    [bookings],
  );

  const gridHeight = HOURS.length * 60;

  const handleDrop = (event: React.DragEvent<HTMLDivElement>, day: Date) => {
    event.preventDefault();
    const bookingId = event.dataTransfer.getData("text/plain");
    if (!bookingId) return;
    const targetHour = Number(event.currentTarget.dataset.hour);
    if (Number.isNaN(targetHour)) return;

    const origin = bookings.find((b) => b.id === bookingId);
    if (!origin) return;

    const originalDurationMs =
      new Date(origin.end).getTime() - new Date(origin.start).getTime();
    const newStart = new Date(day);
    newStart.setHours(targetHour, 0, 0, 0);
    const newEnd = new Date(newStart.getTime() + originalDurationMs);

    onBookingMove(bookingId, newStart.toISOString(), newEnd.toISOString());
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 p-8 dark:border-slate-700">
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="h-20 w-full animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800"
            />
          ))}
        </div>
      </div>
    );
  }

  if (view === "month") {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="grid grid-cols-7 gap-1 text-xs text-slate-500 dark:text-slate-300">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((label) => (
            <div key={label} className="text-center font-semibold">
              {label}
            </div>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-7 gap-1">
          {days.map((day) => {
            const today = new Date();
            const inMonth = day.getMonth() === date.getMonth();
            const dayBookings = bookings.filter((b) =>
              isSameDay(new Date(b.start), day),
            );
            return (
              <button
                key={day.toISOString()}
                className={`min-h-[100px] rounded-lg p-2 text-left transition ${
                  inMonth
                    ? "bg-white dark:bg-slate-800"
                    : "bg-slate-100 dark:bg-slate-900/70"
                } ${isSameDay(day, today) ? "ring-2 ring-primary-400" : ""}`}
                onClick={() => {
                  if (dayBookings.length > 0) onBookingClick(dayBookings[0]);
                }}
              >
                <div className="mb-1 text-sm font-semibold">
                  {day.getDate()}
                </div>
                <div className="space-y-1">
                  {dayBookings.slice(0, 2).map((booking) => (
                    <span
                      key={booking.id}
                      className="block overflow-hidden text-xxs truncate rounded-sm bg-primary-100 px-1 py-0.5 text-primary-700 dark:bg-primary-800 dark:text-primary-200"
                    >
                      {booking.title}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (view === "grid") {
    return (
      <div className="overflow-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="min-w-[900px]">
          <div className="grid grid-cols-[10rem_repeat(15,minmax(80px,1fr))] border-b border-slate-200 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-300">
            <div className="px-2 py-2">Room / Time</div>
            {HOURS.map((hour) => (
              <div key={hour} className="border-l border-slate-100 px-2 py-2">
                {hour}:00
              </div>
            ))}
          </div>
          {resources.map((room, idx) => (
            <div
              key={room}
              className="grid grid-cols-[10rem_repeat(15,minmax(80px,1fr))] border-b border-slate-100 dark:border-slate-800"
            >
              <div className="px-2 py-3 font-medium text-slate-700 dark:text-slate-200">
                {room}
              </div>
              {HOURS.map((hour) => (
                <div
                  key={`${room}-${hour}`}
                  className="border-l border-slate-100 px-1 py-2 text-[11px] dark:border-slate-800"
                >
                  {bookings.some((b) => {
                    const start = new Date(b.start).getHours();
                    const end = new Date(b.end).getHours();
                    return b.room === room && hour >= start && hour < end;
                  }) ? (
                    <span className="rounded bg-primary-200 px-1 py-0.5 text-xs text-primary-800 dark:bg-primary-800 dark:text-primary-200">
                      ●
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="grid min-w-[900px] grid-cols-[4rem_1fr] md:grid-cols-[4rem_repeat(auto-fit,minmax(140px,1fr))]">
        <div className="border-r border-slate-200 bg-slate-50 p-2 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-400">
          &nbsp;
        </div>
        {days.map((day) => (
          <div
            key={day.toDateString()}
            className="border-r border-slate-200 bg-slate-50 p-2 text-center text-xs font-semibold uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300"
          >
            <div>{day.toLocaleDateString(undefined, { weekday: "short" })}</div>
            <div className="text-sm font-bold text-slate-800 dark:text-slate-100">
              {day.getDate()}{" "}
              {day.toLocaleDateString(undefined, { month: "short" })}
            </div>
          </div>
        ))}
      </div>

      <div className="relative" style={{ height: `${gridHeight}px` }}>
        <div className="grid h-full grid-cols-[4rem_1fr] md:grid-cols-[4rem_repeat(auto-fit,minmax(140px,1fr))]">
          <div className="border-r border-slate-200 dark:border-slate-800">
            <div className="grid h-full grid-rows-15">
              {HOURS.map((hour) => (
                <div
                  key={hour}
                  className="border-b border-slate-200 p-1 text-xs text-slate-400 dark:border-slate-800 dark:text-slate-500"
                >
                  {hour}:00
                </div>
              ))}
            </div>
          </div>

          {days.map((day) => (
            <div
              key={day.toDateString()}
              className="relative border-r border-slate-200 dark:border-slate-800"
            >
              {HOURS.map((hour) => (
                <div
                  key={hour}
                  data-hour={hour}
                  onDragOver={handleDragOver}
                  onDrop={(event) => handleDrop(event, day)}
                  className="h-[60px] border-b border-dashed border-slate-200 bg-gradient-to-b from-slate-50 to-white px-1 py-0.5 text-[10px] text-slate-400 transition hover:bg-slate-100 dark:from-slate-900 dark:to-slate-800 dark:hover:bg-slate-800"
                />
              ))}

              {bookings
                .filter((booking) => isSameDay(new Date(booking.start), day))
                .map((booking) => {
                  const { top, height } = calcPosition(booking, day);
                  const spanKey = `${booking.id}-${day.toISOString()}`;
                  const color =
                    SPACE_COLOR[booking.type] ?? "from-sky-400 to-indigo-500";
                  return (
                    <button
                      type="button"
                      key={spanKey}
                      draggable
                      onDragStart={(event) => {
                        event.dataTransfer.setData("text/plain", booking.id);
                      }}
                      onClick={() => onBookingClick(booking)}
                      className={`absolute left-1 right-1 z-10 overflow-hidden rounded-xl border border-white px-2 py-1 text-left text-xs font-semibold text-white shadow-lg transition duration-150 hover:scale-[1.01] hover:shadow-2xl ${booking.status === "cancelled" ? "opacity-60 line-through" : ""}`}
                      style={{
                        top: `${top}px`,
                        height: `${Math.max(35, height)}px`,
                        background:
                          "linear-gradient(120deg, #4f46e5 0%, #3b82f6 100%)",
                      }}
                    >
                      <div
                        className={`absolute inset-0 rounded-xl bg-gradient-to-r ${color} opacity-95`}
                      />
                      <div className="relative z-10">
                        <p>{booking.title}</p>
                        <p className="text-[11px] opacity-90">
                          {new Date(booking.start).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          {" - "}
                          {new Date(booking.end).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        <p className="text-[10px] opacity-80">{booking.room}</p>
                      </div>
                    </button>
                  );
                })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
