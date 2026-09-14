import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Habit } from '../../types';
import { useHabits } from '../../hooks/useHabits';
import { getLocalizedCategory } from '../../lib/utils';
import { Button } from '../ui/Button';
import { RevealOnScroll } from '../ui/RevealOnScroll';
import {
  Flame,
  Check,
  Plus,
  Trash2,
  Edit2,
} from 'lucide-react';

interface HabitListProps {
  onOpenHabitModal: (habit?: Habit) => void;
}

export function HabitList({ onOpenHabitModal }: HabitListProps) {
  const { t } = useTranslation();
  const { habitStats, toggleHabit, deleteHabit } = useHabits();
  const [filterTime, setFilterTime] = useState<string>('all');

  const filteredStats = habitStats.filter(({ habit }) => {
    if (filterTime !== 'all' && habit.time_of_day !== filterTime) return false;
    return true;
  });

  const timeFilterOptions = [
    { id: 'all', label: t('common.timeOfDay.allRoutines') },
    { id: 'morning', label: t('common.timeOfDay.morning') },
    { id: 'afternoon', label: t('common.timeOfDay.afternoon') },
    { id: 'evening', label: t('common.timeOfDay.evening') },
    { id: 'anytime', label: t('common.timeOfDay.anytime') },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <RevealOnScroll direction="up" delay={0}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div>
            <h1 className="font-serif text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
              {t('habits.title')}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t('habits.subtitle')}
            </p>
          </div>

          <Button
            onClick={() => onOpenHabitModal()}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            size="md"
          >
            {t('habits.newHabit')}
          </Button>
        </div>
      </RevealOnScroll>

      {/* Filter Tabs */}
      <RevealOnScroll direction="up" delay={50}>
        <div className="flex items-center gap-1 p-0.5 bg-muted rounded-md w-fit text-xs">
          {timeFilterOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setFilterTime(opt.id)}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                filterTime === opt.id
                  ? 'bg-card font-medium text-foreground border border-border/50'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </RevealOnScroll>

      {/* Habits Grid / List */}
      {filteredStats.length === 0 ? (
        <RevealOnScroll direction="up" delay={80}>
          <div className="text-center py-16 bg-card rounded-lg border border-dashed border-border">
            <Flame className="w-8 h-8 text-muted-foreground/60 mx-auto mb-2" />
            <h3 className="font-serif text-sm font-semibold text-foreground">
              {t('habits.emptyTitle')}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t('habits.emptyDesc')}
            </p>
          </div>
        </RevealOnScroll>
      ) : (
        <div className="space-y-3">
          {filteredStats.map(
            ({ habit, isCompletedToday, currentStreak, totalCompletions, past7Days }, index) => {
              const timeOfDayLabel = t(`common.timeOfDay.${habit.time_of_day}`, habit.time_of_day);

              return (
                <RevealOnScroll
                  key={habit.id}
                  direction="up"
                  delay={Math.min(index * 40, 240)}
                  duration={500}
                >
                  <div
                    className={`rounded-lg p-4 border transition-colors ${
                      isCompletedToday
                        ? 'bg-[#5E8C61]/5 border-[#5E8C61]/25'
                        : 'bg-card border-border hover:border-muted-foreground/40'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Left: Info & Streak */}
                      <div className="flex items-start gap-3 min-w-0">
                        <div
                          className="w-8 h-8 rounded-md flex items-center justify-center shrink-0 text-white font-bold"
                          style={{ backgroundColor: habit.color || '#5E8C61' }}
                        >
                          <Flame className="w-4 h-4 fill-white" />
                        </div>

                        <div className="space-y-0.5 min-w-0">
                          <span className="text-[11px] text-muted-foreground">
                            {getLocalizedCategory(habit.category, t)} · {timeOfDayLabel}
                          </span>

                          <h3 className="text-sm font-medium text-foreground">
                            {habit.title}
                          </h3>

                          {habit.description && (
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {habit.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Middle: 7-Day Consistency Bubble Strip */}
                      <div className="flex items-center gap-1.5 bg-muted/40 p-1.5 rounded-md border border-border">
                        {past7Days.map((day) => {
                          return (
                            <button
                              key={day.dateStr}
                              type="button"
                              onClick={() => toggleHabit(habit.id, day.dateStr)}
                              className={`flex flex-col items-center justify-center w-7 h-8 rounded transition-colors cursor-pointer ${
                                day.isCompleted
                                  ? 'bg-[#5E8C61] text-white'
                                  : day.isToday
                                  ? 'border border-dashed border-primary text-foreground'
                                  : 'bg-card text-muted-foreground hover:border-border border border-transparent'
                              }`}
                            >
                              <span className="text-[9px] font-semibold text-muted-foreground leading-none">
                                {day.dayName[0]}
                              </span>
                              <span className="text-[11px] font-mono font-medium leading-none mt-1">
                                {day.isCompleted ? (
                                  <Check className="w-3 h-3 stroke-[2.5]" />
                                ) : (
                                  day.dayNumber
                                )}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Right: Metrics & Actions */}
                      <div className="flex items-center justify-between lg:justify-end gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-border">
                        {/* Streak */}
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-[#B8860B] font-mono font-semibold text-xs">
                            <Flame className="w-3.5 h-3.5" />
                            <span>{t('habits.streakText', { count: currentStreak })}</span>
                          </div>
                          <p className="text-[10px] text-muted-foreground font-mono">
                            {t('habits.totalCheckIns', { count: totalCompletions })}
                          </p>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onOpenHabitModal(habit)}
                            className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteHabit(habit.id)}
                            className="p-1 rounded text-muted-foreground hover:text-[#BF4040] hover:bg-[#BF4040]/5 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </RevealOnScroll>
              );
            }
          )}
        </div>
      )}
    </div>
  );
}
