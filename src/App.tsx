import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FiBell,
  FiCommand,
  FiGrid,
  FiList,
  FiMenu,
  FiMoon,
  FiRepeat,
  FiSearch,
  FiSettings,
  FiStar,
  FiSun,
  FiUser,
  FiUsers,
} from "react-icons/fi";
import CustomerApp from "./screens/CustomerApp";
import StaffDashboard from "./screens/StaffDashboard";
import AdminPortal from "./screens/AdminPortal";

type Role = "customer" | "staff" | "admin";

const ROLES: Array<{ id: Role; label: string; description: string }> = [
  { id: "customer", label: "Customer", description: "End-user booking app" },
  { id: "staff", label: "Staff", description: "Front desk operations" },
  { id: "admin", label: "Admin", description: "Portal, RBAC and analytics" },
];

const ROLE_ICONS: Record<Role, React.ComponentType<{ className?: string }>> = {
  customer: FiGrid,
  staff: FiUsers,
  admin: FiList,
};

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
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-main)] transition-colors duration-200">
      <div className="mx-auto flex min-h-screen max-w-[1920px]">
        <aside className="sticky top-0 hidden h-screen w-[76px] shrink-0 self-start border-r border-[#0A4CB5] bg-[#0E5FD8] lg:flex">
          <div className="flex h-full w-full flex-col items-center py-3">
            <button
              className="grid h-11 w-11 place-items-center rounded-xl border border-white/30 text-white shadow-sm"
              title="WorkHub"
              aria-label="WorkHub"
            >
              <FiCommand className="h-6 w-6" />
            </button>

            <div className="mt-5 flex flex-col items-center gap-2">
              {ROLES.map((item) => {
                const Icon = ROLE_ICONS[item.id];
                const selected = item.id === role;
                return (
                  <button
                    key={item.id}
                    onClick={() => setRole(item.id)}
                    title={item.label}
                    aria-label={item.label}
                    className={`grid h-10 w-10 place-items-center rounded-xl transition ${selected ? "bg-white/20 text-white ring-1 ring-white/35" : "text-white/80 hover:bg-white/15 hover:text-white"}`}
                  >
                    <Icon className="h-5 w-5" />
                  </button>
                );
              })}
            </div>

            <div className="mt-4 h-px w-8 bg-white/25" />

            <div className="mt-4 flex flex-col items-center gap-2">
              <button
                className="grid h-10 w-10 place-items-center rounded-xl text-white/80 transition hover:bg-white/15 hover:text-white"
                title="Workspace"
                aria-label="Workspace"
              >
                <FiList className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-auto flex flex-col items-center gap-2 pb-2">
              <button
                onClick={() => setDarkMode((value) => !value)}
                className="grid h-10 w-10 place-items-center rounded-xl text-white/80 transition hover:bg-white/15 hover:text-white"
                title={darkMode ? "Light mode" : "Dark mode"}
                aria-label={darkMode ? "Light mode" : "Dark mode"}
              >
                {darkMode ? (
                  <FiSun className="h-5 w-5" />
                ) : (
                  <FiMoon className="h-5 w-5" />
                )}
              </button>
              <button
                className="grid h-10 w-10 place-items-center rounded-xl text-white/80 transition hover:bg-white/15 hover:text-white"
                title="Settings"
                aria-label="Settings"
              >
                <FiSettings className="h-5 w-5" />
              </button>
              <button
                className="grid h-10 w-10 place-items-center rounded-xl text-white/80 transition hover:bg-white/15 hover:text-white"
                title="Favorites"
                aria-label="Favorites"
              >
                <FiStar className="h-5 w-5" />
              </button>
              <button
                className="grid h-10 w-10 place-items-center rounded-xl text-white/80 transition hover:bg-white/15 hover:text-white"
                title="Profile"
                aria-label="Profile"
              >
                <FiUser className="h-5 w-5" />
              </button>
              <button
                className="grid h-10 w-10 place-items-center rounded-xl text-white/80 transition hover:bg-white/15 hover:text-white"
                title="Switch"
                aria-label="Switch"
              >
                <FiRepeat className="h-5 w-5" />
              </button>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-[var(--border-subtle)] bg-[var(--overlay-bg)] backdrop-blur">
            <div className="flex h-16 items-center gap-3 px-4 md:px-6 lg:px-8">
              <button
                onClick={() => setMobileOpen((value) => !value)}
                className="grid h-10 w-10 place-items-center rounded-xl border border-[var(--border-subtle)] text-[var(--text-secondary)] lg:hidden"
              >
                <FiMenu className="h-5 w-5" />
              </button>

              <div className="hidden min-w-[260px] flex-1 items-center gap-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface-hover)] px-3 py-2 text-[var(--text-secondary)] md:flex">
                <FiSearch className="h-4 w-4" />
                <span className="text-sm">
                  Search bookings, members, rooms, tickets...
                </span>
              </div>

              <div className="flex items-center gap-2 rounded-full border border-[var(--border-subtle)] px-3 py-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-secondary)]">
                  Role
                </span>
                <span className="rounded-full bg-[var(--brand-primary)] px-2.5 py-1 text-xs font-semibold text-white">
                  {roleTitle.label}
                </span>
              </div>

              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={() => setDarkMode((value) => !value)}
                  className="grid h-10 w-10 place-items-center rounded-xl border border-[var(--border-subtle)] text-[var(--text-secondary)] lg:hidden"
                >
                  {darkMode ? (
                    <FiSun className="h-5 w-5" />
                  ) : (
                    <FiMoon className="h-5 w-5" />
                  )}
                </button>
                <button className="grid h-10 w-10 place-items-center rounded-xl border border-[var(--border-subtle)] text-[var(--text-secondary)]">
                  <FiBell className="h-5 w-5" />
                </button>
                <button className="flex items-center gap-2 rounded-xl border border-[var(--border-subtle)] px-2 py-1.5">
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
                    className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${selected ? "bg-[var(--brand-primary)] text-white" : "bg-[var(--bg-surface-hover)] text-[var(--text-secondary)]"}`}
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
          <div className="absolute left-0 top-0 h-full w-[290px] border-r border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
            <div className="flex items-center justify-between">
              <p className="font-bold">WorkHub OS</p>
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-lg border border-[var(--border-subtle)] px-3 py-1 text-sm"
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
                  className={`w-full rounded-xl px-4 py-3 text-left ${role === item.id ? "bg-[var(--brand-primary)] text-white" : "bg-[var(--bg-surface-hover)] text-[var(--text-main)]"}`}
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
