import React from "react";
import {
  FiBarChart2,
  FiCalendar,
  FiHome,
  FiSettings,
  FiUsers,
  FiLayers,
} from "react-icons/fi";

const MENU = [
  { label: "Dashboard", icon: FiHome },
  { label: "Spaces", icon: FiLayers },
  { label: "Bookings", icon: FiCalendar },
  { label: "Users", icon: FiUsers },
  { label: "Reports", icon: FiBarChart2 },
  { label: "Settings", icon: FiSettings },
];

interface SidebarProps {
  active?: string;
  onNavigate?: (name: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  active = "Bookings",
  onNavigate,
}) => {
  return (
    <aside className="w-72 min-w-[18rem] border-r border-slate-200 bg-white/80 px-4 py-6 backdrop-blur dark:border-slate-800 dark:bg-slate-900/75 md:sticky md:top-0 md:h-screen">
      <div className="mb-8 flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-400 to-indigo-600 shadow-lg" />
        <div>
          <p className="text-lg font-bold tracking-tight">SpacePilot</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Room booking management
          </p>
        </div>
      </div>

      <nav className="space-y-1">
        {MENU.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.label;
          return (
            <button
              key={item.label}
              onClick={() => onNavigate?.(item.label)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary-100 text-primary-700 dark:bg-primary-700/15 dark:text-primary-200"
                  : "text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-50"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
