import React from "react";
import {
  FiAlertTriangle,
  FiCamera,
  FiCheckCircle,
  FiClipboard,
  FiMessageSquare,
  FiShield,
} from "react-icons/fi";

const alerts = [
  {
    id: "a1",
    title: "Overstay detected",
    detail: "Cedar Room exceeded booking by 15 mins",
  },
  {
    id: "a2",
    title: "Maintenance needed",
    detail: "Spruce Booth requires cleaning",
  },
  {
    id: "a3",
    title: "Walk-in waiting",
    detail: "2 customers waiting at front desk",
  },
];

const StaffDashboard: React.FC = () => {
  const quickActions = [
    { title: "QR Check-in", icon: FiCamera, action: "Scan visitor QR" },
    { title: "Walk-in booking", icon: FiClipboard, action: "Fast form" },
    { title: "Payment confirm", icon: FiCheckCircle, action: "Manual confirm" },
  ];

  const replies = ["Quick reply: yes", "Quick reply: no", "Escalate"];

  return (
    <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-4">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-primary-600 dark:text-primary-300">
                Front-desk UI
              </p>
              <h2 className="text-2xl font-bold">Real-time operations</h2>
            </div>
            <div className="rounded-xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
              Live 12 check-ins
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {quickActions.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.title}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-primary-300 hover:bg-white dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-800/70"
                >
                  <Icon className="h-5 w-5 text-primary-600" />
                  <p className="mt-3 font-semibold">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {item.action}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <FiShield /> Exception handling
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
              <p className="text-sm font-semibold">Space status control</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Available / Maintenance toggle for real-time updates.
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
              <p className="text-sm font-semibold">Payment confirm</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Manual reconciliation for cash or offline payments.
              </p>
            </div>
          </div>
        </section>
      </div>

      <div className="space-y-4">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <FiAlertTriangle /> Alert panel
          </div>
          <div className="mt-4 space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="rounded-xl border border-slate-200 p-4 dark:border-slate-800"
              >
                <p className="font-semibold">{alert.title}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {alert.detail}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <FiMessageSquare /> Support UI
          </div>
          <div className="mt-4 space-y-3">
            {[
              "Can I extend my room booking?",
              "Where is the meeting room?",
            ].map((message) => (
              <div
                key={message}
                className="rounded-xl bg-slate-50 p-3 text-sm dark:bg-slate-800"
              >
                {message}
              </div>
            ))}
            <div className="flex gap-2">
              {replies.map((reply) => (
                <button
                  key={reply}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-xs dark:border-slate-700"
                >
                  {reply}
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default StaffDashboard;
