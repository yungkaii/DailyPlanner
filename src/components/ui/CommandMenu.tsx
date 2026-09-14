import React, { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import {
  Search,
  Calendar,
  Clock,
  CheckSquare,
  Flame,
  Target,
  Moon,
  Sun,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface CommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenScheduleModal: () => void;
  onOpenTaskModal: () => void;
  onOpenHabitModal: () => void;
  onOpenGoalModal: () => void;
}

export function CommandMenu({
  isOpen,
  onClose,
  onOpenScheduleModal,
  onOpenTaskModal,
  onOpenHabitModal,
  onOpenGoalModal,
}: CommandMenuProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    {
      id: 'new-schedule',
      label: t('command.newSchedule'),
      icon: <Clock className="w-4 h-4 text-primary" />,
      group: t('command.groupCreate'),
      action: () => {
        onClose();
        onOpenScheduleModal();
      },
    },
    {
      id: 'new-task',
      label: t('command.newTask'),
      icon: <CheckSquare className="w-4 h-4 text-[#4A7B9D]" />,
      group: t('command.groupCreate'),
      action: () => {
        onClose();
        onOpenTaskModal();
      },
    },
    {
      id: 'new-habit',
      label: t('command.newHabit'),
      icon: <Flame className="w-4 h-4 text-[#5E8C61]" />,
      group: t('command.groupCreate'),
      action: () => {
        onClose();
        onOpenHabitModal();
      },
    },
    {
      id: 'new-goal',
      label: t('command.newGoal'),
      icon: <Target className="w-4 h-4 text-[#7B6B8A]" />,
      group: t('command.groupCreate'),
      action: () => {
        onClose();
        onOpenGoalModal();
      },
    },
    {
      id: 'nav-today',
      label: t('command.navToday'),
      icon: <Clock className="w-4 h-4" />,
      group: t('command.groupNav'),
      action: () => {
        onClose();
        navigate({ to: '/app' });
      },
    },
    {
      id: 'nav-schedule',
      label: t('command.navSchedule'),
      icon: <Clock className="w-4 h-4" />,
      group: t('command.groupNav'),
      action: () => {
        onClose();
        navigate({ to: '/schedule' });
      },
    },
    {
      id: 'nav-calendar',
      label: t('command.navCalendar'),
      icon: <Calendar className="w-4 h-4" />,
      group: t('command.groupNav'),
      action: () => {
        onClose();
        navigate({ to: '/calendar' });
      },
    },
    {
      id: 'nav-tasks',
      label: t('command.navTasks'),
      icon: <CheckSquare className="w-4 h-4" />,
      group: t('command.groupNav'),
      action: () => {
        onClose();
        navigate({ to: '/tasks' });
      },
    },
    {
      id: 'nav-habits',
      label: t('command.navHabits'),
      icon: <Flame className="w-4 h-4" />,
      group: t('command.groupNav'),
      action: () => {
        onClose();
        navigate({ to: '/habits' });
      },
    },
    {
      id: 'nav-goals',
      label: t('command.navGoals'),
      icon: <Target className="w-4 h-4" />,
      group: t('command.groupNav'),
      action: () => {
        onClose();
        navigate({ to: '/goals' });
      },
    },
    {
      id: 'toggle-theme',
      label: theme === 'dark' ? t('command.switchToLight') : t('command.switchToDark'),
      icon: theme === 'dark' ? <Sun className="w-4 h-4 text-[#B8860B]" /> : <Moon className="w-4 h-4 text-primary" />,
      group: t('command.groupPref'),
      action: () => {
        toggleTheme();
        onClose();
      },
    },
  ];

  const filtered = actions.filter((a) =>
    a.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      <div
        className="fixed inset-0 bg-black/40 dark:bg-black/60 transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg rounded-lg bg-card border border-border shadow-lg overflow-hidden z-10">
        <div className="flex items-center px-4 py-3 border-b border-border">
          <Search className="w-4 h-4 text-muted-foreground mr-2.5 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('command.placeholder')}
            className="w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <kbd className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded border border-border font-mono">
            ESC
          </kbd>
        </div>

        <div className="p-1.5 max-h-80 overflow-y-auto space-y-0.5">
          {filtered.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-6">{t('command.noMatching')}</p>
          ) : (
            filtered.map((item) => (
              <button
                key={item.id}
                onClick={item.action}
                className="w-full flex items-center justify-between px-3 py-2 text-xs rounded-md hover:bg-muted text-foreground transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </div>
                <span className="text-[11px] text-muted-foreground">
                  {item.group}
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
