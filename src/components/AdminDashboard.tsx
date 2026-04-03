import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import { Booking } from "../types";

interface AdminDashboardProps {
  bookings: Booking[];
}

const cards = [
  { label: "Usage rate", value: "78%", detail: "Last 7 days" },
  { label: "Bookings today", value: "39", detail: "Current day" },
  { label: "Active rooms", value: "12", detail: "Total rooms" },
  { label: "Upcoming", value: "22", detail: "Next 24h" },
];

const usageData = Array.from({ length: 7 }, (_, i) => ({
  day: `D${i + 1}`,
  value: Math.floor(30 + Math.random() * 55),
}));
const roomData = [
  { room: "Cedar", count: 54 },
  { room: "Spruce", count: 36 },
  { room: "Elm", count: 21 },
  { room: "Bamboo", count: 48 },
];

const AdminDashboard: React.FC<AdminDashboardProps> = ({ bookings }) => {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className="text-2xl font-bold">{card.value}</p>
            <p className="mt-1 text-xs text-slate-400">{card.detail}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h4 className="mb-2 text-base font-semibold">Usage over time</h4>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={usageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#6366f1"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h4 className="mb-2 text-base font-semibold">Room usage</h4>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={roomData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="room" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#4f46e5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h4 className="mb-3 text-base font-semibold">Latest bookings</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700 dark:text-slate-200">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="py-2">#</th>
                <th>Title</th>
                <th>Room</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.slice(0, 8).map((item, idx) => (
                <tr
                  key={item.id}
                  className="border-b border-slate-100 dark:border-slate-800"
                >
                  <td className="py-2">{idx + 1}</td>
                  <td>{item.title}</td>
                  <td>{item.room}</td>
                  <td>
                    {new Date(item.start).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    -{" "}
                    {new Date(item.end).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="capitalize">{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
