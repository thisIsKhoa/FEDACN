import React from "react";
import {
  FiBarChart2,
  FiClock,
  FiEdit3,
  FiLayers,
  FiShield,
  FiUsers,
} from "react-icons/fi";
import AdminDashboard from "../components/AdminDashboard";
import { bookings } from "../mockData";

const roles = [
  ["Admin", "All permissions"],
  ["Staff", "Check-in, support"],
  ["Customer", "Book, pay, profile"],
];

const AdminPortal: React.FC = () => {
  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary-600 dark:text-primary-300">
              Admin Portal
            </p>
            <h2 className="text-2xl font-bold">
              Resource management, CRM, analytics, RBAC
            </h2>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            {roles.map(([role, perms]) => (
              <div
                key={role}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-800"
              >
                <p className="font-semibold">{role}</p>
                <p className="text-slate-500 dark:text-slate-400">{perms}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {[
          {
            title: "Floor Plan Editor",
            desc: "Drag desks/rooms, resize, reposition, and configure layouts.",
            icon: FiLayers,
          },
          {
            title: "Pricing Config",
            desc: "Inline-edit pricing by room, hour, and member tier.",
            icon: FiEdit3,
          },
          {
            title: "RBAC Matrix",
            desc: "Role-to-permission mapping for clean governance.",
            icon: FiShield,
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <Icon className="h-5 w-5 text-primary-600" />
              <h3 className="mt-3 font-semibold">{item.title}</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {item.desc}
              </p>
            </div>
          );
        })}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <AdminDashboard bookings={bookings} />

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <FiUsers /> Customer CRM
            </div>
            <div className="mt-4 space-y-3">
              {["Founders Club", "Teams 20+", "Corporate annual"].map(
                (item) => (
                  <div
                    key={item}
                    className="rounded-xl bg-slate-50 p-3 text-sm dark:bg-slate-800"
                  >
                    {item}
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <FiClock /> Approval dashboard
            </div>
            <div className="mt-4 space-y-3">
              {bookings.slice(0, 3).map((booking) => (
                <div
                  key={booking.id}
                  className="rounded-xl border border-slate-200 p-3 dark:border-slate-800"
                >
                  <p className="font-semibold">{booking.title}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {booking.room}
                  </p>
                </div>
              ))}
              <div className="flex gap-2">
                <button className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white">
                  Approve
                </button>
                <button className="rounded-xl bg-red-600 px-3 py-2 text-xs font-semibold text-white">
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <FiBarChart2 /> System Admin
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {["Content moderation", "Notification broadcast", "Audit log"].map(
            (item) => (
              <div
                key={item}
                className="rounded-xl bg-slate-50 p-4 text-sm dark:bg-slate-800"
              >
                {item}
              </div>
            ),
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminPortal;
