import React from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Clock,
  CalendarDays,
  CheckSquare,
  Flame,
  Plus,
} from 'lucide-react';

interface MobileNavProps {
  onOpenCommand: () => void;
}

export function MobileNav({ onOpenCommand }: MobileNavProps) {
  const { t } = useTranslation();
  const location = useLocation();

  const links = [
    { to: '/', label: t('nav.today'), icon: <LayoutDashboard className="w-4 h-4" /> },
    { to: '/schedule', label: t('nav.schedule'), icon: <Clock className="w-4 h-4" /> },
    { to: '/tasks', label: t('nav.tasks'), icon: <CheckSquare className="w-4 h-4" /> },
    { to: '/habits', label: t('nav.habits'), icon: <Flame className="w-4 h-4" /> },
    { to: '/calendar', label: t('nav.calendar'), icon: <CalendarDays className="w-4 h-4" /> },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border px-2 py-1.5 flex items-center justify-around shadow-sm safe-area-pb">
      {links.slice(0, 2).map((item) => {
        const isActive = location.pathname === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-md transition-colors ${
              isActive
                ? 'text-primary font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {item.icon}
            <span className="text-[10px]">{item.label}</span>
          </Link>
        );
      })}

      {/* Center Action Button */}
      <button
        onClick={onOpenCommand}
        className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center -mt-2 cursor-pointer shadow-sm"
      >
        <Plus className="w-4 h-4" />
      </button>

      {links.slice(2).map((item) => {
        const isActive = location.pathname === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-md transition-colors ${
              isActive
                ? 'text-primary font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {item.icon}
            <span className="text-[10px]">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
