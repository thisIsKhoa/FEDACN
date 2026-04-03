import React from "react";
import { FiHome, FiCalendar, FiPlusCircle, FiUser } from "react-icons/fi";

interface MobileBottomNavProps {
  active: string;
  onChange: (nav: string) => void;
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  active,
  onChange,
}) => {
  const items = [
    { id: "Home", icon: FiHome },
    { id: "Calendar", icon: FiCalendar },
    { id: "Book", icon: FiPlusCircle },
    { id: "Profile", icon: FiUser },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-around border-t border-slate-200 bg-white py-2 dark:border-slate-800 dark:bg-slate-900 md:hidden">
      {items.map((item) => {
        const Icon = item.icon;
        const activeState = active === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={`flex flex-col items-center gap-1 text-xs ${activeState ? "text-primary-600" : "text-slate-500"}`}
          >
            <Icon className="h-5 w-5" />
            {item.id}
          </button>
        );
      })}
    </div>
  );
};

export default MobileBottomNav;
