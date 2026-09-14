import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHabits } from '../../hooks/useHabits';
import { Habit } from '../../types';
import { getLocalizedCategory } from '../../lib/utils';
import { Flame, Check } from 'lucide-react';
import { Link } from '@tanstack/react-router';

interface HabitStripProps {
  onOpenHabitModal: (habit?: Habit) => void;
}

export function HabitStrip({ onOpenHabitModal }: HabitStripProps) {
  const { t } = useTranslation();
  const { habitStats, toggleHabit } = useHabits();

  return (
    <div className="rounded-lg bg-card border border-border p-5">
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-border">
        <div>
          <h2 className="font-serif text-base font-semibold text-foreground flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#B8860B]" />
            <span>{t('dashboard.habitStrip.title')}</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t('dashboard.habitStrip.subtitle')}
          </p>
        </div>

        <Link
          to="/habits"
          className="text-xs text-muted-foreground hover:text-foreground font-medium"
        >
          {t('dashboard.habitStrip.viewTracker')}
        </Link>
      </div>

      {habitStats.length === 0 ? (
        <div className="text-center py-6 text-xs text-muted-foreground">
          {t('dashboard.habitStrip.empty')}
          <button
            onClick={() => onOpenHabitModal()}
            className="block mx-auto mt-1.5 text-primary font-medium hover:underline cursor-pointer"
          >
            {t('dashboard.habitStrip.createFirst')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {habitStats.map(({ habit, isCompletedToday, currentStreak }) => {
            const timeOfDayKey = `common.timeOfDay.${habit.time_of_day}`;
            const timeOfDayLabel = t(timeOfDayKey, habit.time_of_day);

            return (
              <div
                key={habit.id}
                className={`rounded-md p-3 border transition-colors ${
                  isCompletedToday
                    ? 'bg-[#5E8C61]/5 border-[#5E8C61]/25'
                    : 'bg-card border-border'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-[11px] text-muted-foreground">
                      {getLocalizedCategory(habit.category, t)}
                    </span>
                    <h4 className="text-xs font-semibold text-foreground truncate mt-0.5">
                      {habit.title}
                    </h4>
                  </div>

                  {/* 1-click Check Button */}
                  <button
                    type="button"
                    onClick={() => toggleHabit(habit.id)}
                    className={`w-6 h-6 rounded flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                      isCompletedToday
                        ? 'bg-[#5E8C61] text-white'
                        : 'border border-border bg-card text-transparent hover:border-muted-foreground'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                </div>

                <div className="mt-2.5 pt-2 border-t border-border flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-[#B8860B] font-mono text-[11px] font-medium">
                    <Flame className="w-3.5 h-3.5 text-[#B8860B]" />
                    <span>{t('dashboard.habitStrip.streak', { count: currentStreak })}</span>
                  </div>

                  <span className="text-[11px] text-muted-foreground">
                    {timeOfDayLabel}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
