import { motion } from "framer-motion";
import { Booking } from "../types";

interface BookingUpdateValues extends Partial<Booking> {
  attendees?: number;
  notes?: string;
}

interface BookingDrawerProps {
  booking: Booking | null;
  onClose: () => void;
  onSubmit: (values: BookingUpdateValues) => void;
}

const BookingDrawer: React.FC<BookingDrawerProps> = ({
  booking,
  onClose,
  onSubmit,
}) => {
  if (!booking) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-4 md:items-center md:justify-end"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="h-[80vh] w-full overflow-y-auto rounded-t-2xl border border-slate-200 bg-white p-4 shadow-2xl md:h-auto md:max-w-md md:rounded-2xl"
        initial={{ y: 200 }}
        animate={{ y: 0 }}
        exit={{ y: 200 }}
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Booking details</h3>
          <button onClick={onClose} className="rounded-lg px-2 py-1 text-sm">
            Close
          </button>
        </div>
        <div className="space-y-3 text-sm">
          <p>
            <span className="font-semibold">Title:</span> {booking.title}
          </p>
          <p>
            <span className="font-semibold">Time:</span>{" "}
            {new Date(booking.start).toLocaleString()} -{" "}
            {new Date(booking.end).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <p>
            <span className="font-semibold">Room:</span> {booking.room}
          </p>
          <p>
            <span className="font-semibold">Owner:</span> {booking.owner}
          </p>
        </div>
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => onSubmit({ title: `${booking.title} (updated)` })}
            className="rounded-lg bg-primary-600 px-4 py-2 text-white"
          >
            Quick update
          </button>
          <button onClick={onClose} className="rounded-lg border px-4 py-2">
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BookingDrawer;
