import React from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Clock,
  CalendarDays,
  CheckSquare,
  Flame,
  Target,
  Settings,
  Plus,
} from 'lucide-react';
import { useGoals } from '../../hooks/useGoals';
import { ProgressBar } from '../ui/ProgressBar';

interface SidebarProps {
  onOpenCommand: () => void;
  onOpenScheduleModal: () => void;
  onOpenTaskModal: () => void;
}

export function Sidebar({
  onOpenCommand,
}: SidebarProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const { dayStats } = useGoals();

  const navItems = [
    { to: '/app', label: t('nav.today'), icon: <LayoutDashboard className="w-4 h-4" /> },
    { to: '/schedule', label: t('nav.schedule'), icon: <Clock className="w-4 h-4" /> },
    { to: '/calendar', label: t('nav.calendar'), icon: <CalendarDays className="w-4 h-4" /> },
    { to: '/tasks', label: t('nav.tasks'), icon: <CheckSquare className="w-4 h-4" /> },
    { to: '/habits', label: t('nav.habits'), icon: <Flame className="w-4 h-4" /> },
    { to: '/goals', label: t('nav.goals'), icon: <Target className="w-4 h-4" /> },
    { to: '/settings', label: t('nav.settings'), icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-60 h-screen sticky top-0 border-r border-border bg-card p-3.5 select-none shrink-0 z-30">
      {/* Brand */}
      <div className="px-2 py-3 mb-3">
        <Link to="/app" className="block">
          <h1 className="font-serif text-lg font-semibold tracking-tight text-foreground flex items-center gap-1.5">
            RoutineUp
            <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
          </h1>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {t('nav.brandSubtitle')}
          </p>
        </Link>
      </div>

      {/* Quick Action button */}
      <div className="mb-4">
        <button
          onClick={onOpenCommand}
          className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-md border border-border bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5 text-primary" />
            <span>{t('nav.quickAction')}</span>
          </span>
          <kbd className="text-[10px] bg-card px-1.5 py-0.5 rounded border border-border font-mono text-muted-foreground">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md text-xs transition-colors ${
                isActive
                  ? 'bg-muted text-foreground font-semibold border-l-2 border-l-primary'
                  : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
              }`}
            >
              <span className={isActive ? 'text-primary' : 'text-muted-foreground'}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Day Progress Mini Box */}
      <div className="mt-auto p-3 rounded-md bg-muted/40 border border-border">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-muted-foreground">{t('nav.todayMomentum')}</span>
          <span className="font-mono text-xs font-semibold text-foreground">
            {dayStats.percentage}%
          </span>
        </div>
        <ProgressBar value={dayStats.percentage} color="bg-primary" />
        <div className="flex justify-between text-[11px] text-muted-foreground mt-2">
          <span>
            {dayStats.completedTasksToday}/{dayStats.totalTasksToday} {t('common.tasks')}
          </span>
          <span>
            {dayStats.completedHabitsToday}/{dayStats.totalHabitsToday} {t('common.habits')}
          </span>
        </div>
      </div>
    </aside>
  );
}
