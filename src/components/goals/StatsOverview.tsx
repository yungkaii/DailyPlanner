import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGoals } from '../../hooks/useGoals';
import { useTasks } from '../../hooks/useTasks';
import { useHabits } from '../../hooks/useHabits';
import { RevealOnScroll } from '../ui/RevealOnScroll';
import {
  Clock,
  CheckCircle2,
  Flame,
  TrendingUp,
} from 'lucide-react';

export function StatsOverview() {
  const { t } = useTranslation();
  const { dayStats } = useGoals();
  const { tasks } = useTasks();
  const { habitStats } = useHabits();

  const totalTasksCount = tasks.length;
  const completedTasksCount = tasks.filter((t) => t.completed).length;
  const overallTaskCompletionRate =
    totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  const totalHabitCompletions = habitStats.reduce(
    (acc, curr) => acc + curr.totalCompletions,
    0
  );

  const bestStreak = habitStats.reduce(
    (max, curr) => Math.max(max, curr.currentStreak),
    0
  );

  const statCards = [
    {
      title: t('goals.stats.dailyScore'),
      value: `${dayStats.percentage}%`,
      subtitle: t('goals.stats.dailyScoreSub'),
      icon: <TrendingUp className="w-4 h-4 text-primary" />,
    },
    {
      title: t('goals.stats.focusExecuted'),
      value: `${(dayStats.completedScheduleMinutes / 60).toFixed(1)}h`,
      subtitle: t('goals.stats.focusPlanned', { hours: (dayStats.totalScheduleMinutes / 60).toFixed(1) }),
      icon: <Clock className="w-4 h-4 text-[#4A7B9D]" />,
    },
    {
      title: t('goals.stats.taskCompletion'),
      value: `${overallTaskCompletionRate}%`,
      subtitle: t('goals.stats.taskCompletionSub', { completed: completedTasksCount, total: totalTasksCount }),
      icon: <CheckCircle2 className="w-4 h-4 text-[#5E8C61]" />,
    },
    {
      title: t('goals.stats.longestStreak'),
      value: `${bestStreak}d`,
      subtitle: t('goals.stats.longestStreakSub', { total: totalHabitCompletions }),
      icon: <Flame className="w-4 h-4 text-[#B8860B]" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {statCards.map((card, index) => (
        <RevealOnScroll
          key={card.title}
          direction="up"
          delay={index * 50}
          duration={500}
        >
          <div className="rounded-lg bg-card border border-border p-4 h-full hover:border-muted-foreground/40 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">
                {card.title}
              </span>
              <div className="p-1 rounded bg-muted">{card.icon}</div>
            </div>
            <div className="text-2xl font-mono font-bold tracking-tight text-foreground">
              {card.value}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {card.subtitle}
            </p>
          </div>
        </RevealOnScroll>
      ))}
    </div>
  );
}
