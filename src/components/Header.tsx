import React from "react";
import { FiBell, FiSearch, FiSun, FiMoon } from "react-icons/fi";

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ darkMode, onToggleDarkMode }) => {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white/75 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/75 md:px-6">
      <div className="flex flex-1 items-center gap-3">
        <div className="relative w-full max-w-xs text-slate-500 dark:text-slate-400">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
          <input
            className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-800 dark:focus:border-primary-500 dark:focus:ring-primary-950"
            placeholder="Search bookings, rooms, users..."
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onToggleDarkMode}
          className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:border-primary-300 hover:text-primary-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:text-primary-300"
        >
          {darkMode ? (
            <FiSun className="h-5 w-5" />
          ) : (
            <FiMoon className="h-5 w-5" />
          )}
        </button>
        <button className="relative grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:border-primary-300 hover:text-primary-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:text-primary-300">
          <FiBell className="h-5 w-5" />
          <span className="absolute -right-1 -top-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            3
          </span>
        </button>
        <div className="relative">
          <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1 text-sm transition hover:border-primary-300 dark:border-slate-700 dark:bg-slate-800">
            <span className="h-7 w-7 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-xs leading-7 text-white">
              L
            </span>
            <span className="hidden sm:inline">Linh</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
