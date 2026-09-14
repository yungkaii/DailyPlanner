import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { useLiveTime } from '../../hooks/useLiveTime';
import { UserMenu } from '../auth/UserMenu';
import {
  Sun,
  Moon,
  Search,
  Plus,
  Clock,
  CheckSquare,
  Flame,
  Target,
  ChevronDown,
} from 'lucide-react';
import { Button } from '../ui/Button';

interface HeaderProps {
  onOpenCommand: () => void;
  onOpenScheduleModal: () => void;
  onOpenTaskModal: () => void;
  onOpenHabitModal: () => void;
  onOpenGoalModal: () => void;
  onOpenAuth: () => void;
}

export function Header({
  onOpenCommand,
  onOpenScheduleModal,
  onOpenTaskModal,
  onOpenHabitModal,
  onOpenGoalModal,
  onOpenAuth,
}: HeaderProps) {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { timeString, dateString } = useLiveTime();
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 h-14 border-b border-border bg-card px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Clock & Date */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-muted/40 border border-border">
          <span className="font-mono text-xs font-semibold text-foreground">
            {timeString}
          </span>
          <span className="text-muted-foreground/50">·</span>
          <span className="text-xs text-muted-foreground hidden sm:inline">
            {dateString}
          </span>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Search / Command trigger */}
        <button
          onClick={onOpenCommand}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-md border border-border bg-muted/40 text-muted-foreground hover:text-foreground transition-colors text-xs cursor-pointer"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{t('common.search')}</span>
          <kbd className="hidden sm:inline text-[10px] bg-card px-1.5 py-0.5 rounded border border-border font-mono">
            ⌘K
          </kbd>
        </button>

        {/* Quick Add Dropdown */}
        <div className="relative">
          <Button
            size="sm"
            onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            rightIcon={<ChevronDown className="w-3 h-3 ml-0.5" />}
          >
            <span className="hidden sm:inline">{t('nav.new')}</span>
          </Button>

          {isAddMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsAddMenuOpen(false)}
              />
              <div className="absolute right-0 mt-1.5 w-48 rounded-lg bg-card border border-border shadow-md p-1 z-50">
                <button
                  onClick={() => {
                    setIsAddMenuOpen(false);
                    onOpenScheduleModal();
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs rounded hover:bg-muted text-foreground transition-colors cursor-pointer"
                >
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  <span>{t('nav.newSchedule')}</span>
                </button>
                <button
                  onClick={() => {
                    setIsAddMenuOpen(false);
                    onOpenTaskModal();
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs rounded hover:bg-muted text-foreground transition-colors cursor-pointer"
                >
                  <CheckSquare className="w-3.5 h-3.5 text-[#4A7B9D]" />
                  <span>{t('nav.newTask')}</span>
                </button>
                <button
                  onClick={() => {
                    setIsAddMenuOpen(false);
                    onOpenHabitModal();
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs rounded hover:bg-muted text-foreground transition-colors cursor-pointer"
                >
                  <Flame className="w-3.5 h-3.5 text-[#5E8C61]" />
                  <span>{t('nav.newHabit')}</span>
                </button>
                <button
                  onClick={() => {
                    setIsAddMenuOpen(false);
                    onOpenGoalModal();
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs rounded hover:bg-muted text-foreground transition-colors cursor-pointer"
                >
                  <Target className="w-3.5 h-3.5 text-[#7B6B8A]" />
                  <span>{t('nav.newGoal')}</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-[#B8860B]" />
          ) : (
            <Moon className="w-4 h-4 text-foreground" />
          )}
        </button>

        {/* User Profile */}
        <UserMenu onOpenAuth={onOpenAuth} />
      </div>
    </header>
  );
}
