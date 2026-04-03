import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiBell, FiMenu, FiMoon, FiSearch, FiSun } from "react-icons/fi";
import CustomerApp from "./screens/CustomerApp";
import StaffDashboard from "./screens/StaffDashboard";
import AdminPortal from "./screens/AdminPortal";

type Role = "customer" | "staff" | "admin";

const ROLES: Array<{ id: Role; label: string; description: string }> = [
  { id: "customer", label: "Customer", description: "End-user booking app" },
  { id: "staff", label: "Staff", description: "Front desk operations" },
  { id: "admin", label: "Admin", description: "Portal, RBAC and analytics" },
];

const App: React.FC = () => {
  const [role, setRole] = useState<Role>("customer");
  const [darkMode, setDarkMode] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const roleTitle = useMemo(
    () => ROLES.find((item) => item.id === role) ?? ROLES[0],
    [role],
  );

  const content = useMemo(() => {
    if (role === "customer") return <CustomerApp />;
    if (role === "staff") return <StaffDashboard />;
    return <AdminPortal />;
  }, [role]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-[1920px]">
        <aside className="hidden w-[290px] flex-col border-r border-slate-200 bg-white/90 px-4 py-5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 lg:flex">
          <div className="flex items-center gap-3 px-2">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-700 shadow-lg shadow-primary-900/20" />
            <div>
              <p className="text-lg font-bold tracking-tight">WorkHub OS</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Coworking space management
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-2 rounded-2xl border border-slate-200 p-2 dark:border-slate-800">
            {ROLES.map((item) => {
              const selected = item.id === role;
              return (
                <button
                  key={item.id}
                  onClick={() => setRole(item.id)}
                  className={`w-full rounded-xl px-4 py-3 text-left transition ${selected ? "bg-primary-600 text-white shadow-lg shadow-primary-900/20" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                >
                  <div className="text-sm font-semibold">{item.label}</div>
                  <div
                    className={`text-xs ${selected ? "text-white/80" : "text-slate-500 dark:text-slate-400"}`}
                  >
                    {item.description}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-auto space-y-3 rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
            <div className="flex items-center justify-between text-sm">
              <span>Dark mode</span>
              <button
                onClick={() => setDarkMode((value) => !value)}
                className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                {darkMode ? (
                  <FiSun className="h-4 w-4" />
                ) : (
                  <FiMoon className="h-4 w-4" />
                )}
              </button>
            </div>
            <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-300">
              Designed for fast booking, clear ownership and role-based
              workflows.
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
            <div className="flex h-16 items-center gap-3 px-4 md:px-6 lg:px-8">
              <button
                onClick={() => setMobileOpen((value) => !value)}
                className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-700 dark:border-slate-800 dark:text-slate-200 lg:hidden"
              >
                <FiMenu className="h-5 w-5" />
              </button>

              <div className="hidden min-w-[260px] flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 md:flex">
                <FiSearch className="h-4 w-4" />
                <span className="text-sm">
                  Search bookings, members, rooms, tickets...
                </span>
              </div>

              <div className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 dark:border-slate-800">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Role
                </span>
                <span className="rounded-full bg-primary-600 px-2.5 py-1 text-xs font-semibold text-white">
                  {roleTitle.label}
                </span>
              </div>

              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={() => setDarkMode((value) => !value)}
                  className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-700 dark:border-slate-800 dark:text-slate-200 lg:hidden"
                >
                  {darkMode ? (
                    <FiSun className="h-5 w-5" />
                  ) : (
                    <FiMoon className="h-5 w-5" />
                  )}
                </button>
                <button className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-700 dark:border-slate-800 dark:text-slate-200">
                  <FiBell className="h-5 w-5" />
                </button>
                <button className="flex items-center gap-2 rounded-xl border border-slate-200 px-2 py-1.5 dark:border-slate-800">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-indigo-700 text-xs font-bold text-white">
                    A
                  </span>
                  <span className="hidden text-sm font-medium md:inline">
                    Alex
                  </span>
                </button>
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto px-4 pb-3 md:px-6 lg:hidden">
              {ROLES.map((item) => {
                const selected = item.id === role;
                return (
                  <button
                    key={item.id}
                    onClick={() => setRole(item.id)}
                    className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${selected ? "bg-primary-600 text-white" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"}`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </header>

          <main className="flex-1 px-4 py-5 md:px-6 lg:px-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={role}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
              >
                {content}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden">
          <div className="absolute left-0 top-0 h-full w-[290px] border-r border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <p className="font-bold">WorkHub OS</p>
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-lg border border-slate-200 px-3 py-1 text-sm dark:border-slate-800"
              >
                Close
              </button>
            </div>
            <div className="mt-4 space-y-2">
              {ROLES.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setRole(item.id);
                    setMobileOpen(false);
                  }}
                  className={`w-full rounded-xl px-4 py-3 text-left ${role === item.id ? "bg-primary-600 text-white" : "bg-slate-100 dark:bg-slate-800"}`}
                >
                  <div className="font-semibold">{item.label}</div>
                  <div className="text-xs opacity-80">{item.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
