import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiCalendar,
  FiEdit2,
  FiHash,
  FiSave,
  FiTrash2,
  FiX,
} from "react-icons/fi";
import { Booking, BookingRequest, FloorPlanItem } from "../types";

interface BookingModalProps {
  mode?: "details" | "booking";
  booking?: Booking | null;
  floorPlanItem?: FloorPlanItem | null;
  initialRequest?: BookingRequest | null;
  onClose: () => void;
  onDelete?: (id: string) => void;
  onEdit?: (booking: Booking) => void;
  onConfirm?: (request: BookingRequest) => void;
}

const toLocalInputValue = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  const hours = `${date.getHours()}`.padStart(2, "0");
  const minutes = `${date.getMinutes()}`.padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const BookingModal: React.FC<BookingModalProps> = ({
  mode = "details",
  booking,
  floorPlanItem,
  initialRequest,
  onClose,
  onDelete,
  onEdit,
  onConfirm,
}) => {
  const [request, setRequest] = useState<BookingRequest>({
    roomId: floorPlanItem?.id ?? initialRequest?.roomId ?? "",
    roomName:
      floorPlanItem?.name ?? initialRequest?.roomName ?? booking?.room ?? "",
    time: initialRequest?.time ?? toLocalInputValue(new Date()),
    attendees: initialRequest?.attendees ?? floorPlanItem?.capacity ?? 1,
    notes: initialRequest?.notes ?? "",
  });

  useEffect(() => {
    if (mode !== "booking") return;

    setRequest({
      roomId: floorPlanItem?.id ?? initialRequest?.roomId ?? "",
      roomName: floorPlanItem?.name ?? initialRequest?.roomName ?? "",
      time: initialRequest?.time ?? toLocalInputValue(new Date()),
      attendees: initialRequest?.attendees ?? floorPlanItem?.capacity ?? 1,
      notes: initialRequest?.notes ?? "",
    });
  }, [mode, floorPlanItem, initialRequest]);

  if (mode === "details") {
    if (!booking) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20 }}
          className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-600 dark:text-primary-300">
                Booking details
              </p>
              <h2 className="mt-1 text-xl font-bold">{booking.title}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {booking.room} • {booking.owner}
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-5 space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <p>
              <span className="font-semibold">Time:</span>{" "}
              {new Date(booking.start).toLocaleString()} -{" "}
              {new Date(booking.end).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <p>
              <span className="font-semibold">Status:</span> {booking.status}
            </p>
            <p>
              <span className="font-semibold">Room type:</span> {booking.type}
            </p>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => onDelete?.(booking.id)}
              className="inline-flex items-center gap-1 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300"
            >
              <FiTrash2 /> Delete
            </button>
            <button
              onClick={() => onEdit?.(booking)}
              className="inline-flex items-center gap-1 rounded-xl border border-primary-200 bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700 transition hover:bg-primary-100 dark:border-primary-900 dark:bg-primary-950/40 dark:text-primary-300"
            >
              <FiEdit2 /> Edit
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/55 p-4 md:items-center">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20 }}
        className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-600 dark:text-primary-300">
              Quick booking
            </p>
            <h2 className="mt-1 text-xl font-bold">
              {floorPlanItem?.name ?? request.roomName}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Click-to-book flow with smart autofill
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm md:col-span-2">
            <span className="flex items-center gap-2 font-medium">
              <FiHash className="h-4 w-4" /> Room ID
            </span>
            <input
              value={request.roomId}
              readOnly
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 outline-none dark:border-slate-700 dark:bg-slate-800"
            />
          </label>
          <label className="space-y-2 text-sm">
            <span className="flex items-center gap-2 font-medium">
              <FiCalendar className="h-4 w-4" /> Time
            </span>
            <input
              type="datetime-local"
              value={request.time}
              onChange={(event) =>
                setRequest((current) => ({
                  ...current,
                  time: event.target.value,
                }))
              }
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 outline-none dark:border-slate-700 dark:bg-slate-800"
            />
          </label>
          <label className="space-y-2 text-sm">
            <span className="font-medium">Attendees</span>
            <input
              type="number"
              min={1}
              value={request.attendees}
              onChange={(event) =>
                setRequest((current) => ({
                  ...current,
                  attendees: Number(event.target.value),
                }))
              }
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 outline-none dark:border-slate-700 dark:bg-slate-800"
            />
          </label>
          <label className="space-y-2 text-sm md:col-span-2">
            <span className="font-medium">Notes</span>
            <input
              value={request.notes}
              onChange={(event) =>
                setRequest((current) => ({
                  ...current,
                  notes: event.target.value,
                }))
              }
              placeholder="Optional notes"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 outline-none dark:border-slate-700 dark:bg-slate-800"
            />
          </label>
        </div>

        <div className="mt-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-300">
          Auto-fill suggests room, capacity and time from the selected seat. You
          can confirm in one tap.
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium dark:border-slate-700"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm?.(request)}
            className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary-900/20"
          >
            <FiSave /> Book now
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default BookingModal;
