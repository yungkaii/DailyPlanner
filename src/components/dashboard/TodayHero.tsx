import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useLiveTime } from '../../hooks/useLiveTime';
import { useGoals } from '../../hooks/useGoals';
import { getGreeting } from '../../lib/utils';
import { ProgressRing } from '../ui/ProgressBar';
import { Clock, CheckCircle2, Flame, Calendar } from 'lucide-react';

export function TodayHero() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { dateString } = useLiveTime();
  const { dayStats } = useGoals();

  const greeting = getGreeting(
    user?.full_name?.split(' ')[0] || user?.email?.split('@')[0],
    t
  );

  const scheduledHours = (dayStats.totalScheduleMinutes / 60).toFixed(1);
  const completedHours = (dayStats.completedScheduleMinutes / 60).toFixed(1);

  return (
    <section className="rounded-lg bg-card border border-border p-5 sm:p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left: Greeting & Current Time */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" />
            <span>{dateString}</span>
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
            {greeting}
          </h1>

          <p className="text-xs sm:text-sm text-muted-foreground max-w-md">
            {t('dashboard.hero.subtitle')}
          </p>

          {/* Stat Pills */}
          <div className="pt-2 flex flex-wrap gap-2">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded border border-border bg-muted/30 text-xs">
              <Clock className="w-3.5 h-3.5 text-primary" />
              <span className="text-muted-foreground">{t('dashboard.hero.focusTime')}</span>
              <span className="font-medium font-mono text-foreground">
                {completedHours}h / {scheduledHours}h
              </span>
            </div>

            <div className="flex items-center gap-2 px-2.5 py-1 rounded border border-border bg-muted/30 text-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#5E8C61]" />
              <span className="text-muted-foreground">{t('dashboard.hero.tasks')}</span>
              <span className="font-medium font-mono text-foreground">
                {dayStats.completedTasksToday}/{dayStats.totalTasksToday}
              </span>
            </div>

            <div className="flex items-center gap-2 px-2.5 py-1 rounded border border-border bg-muted/30 text-xs">
              <Flame className="w-3.5 h-3.5 text-[#B8860B]" />
              <span className="text-muted-foreground">{t('dashboard.hero.habits')}</span>
              <span className="font-medium font-mono text-foreground">
                {dayStats.completedHabitsToday}/{dayStats.totalHabitsToday}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Daily Progress Circular Ring */}
        <div className="flex items-center gap-4 bg-muted/30 p-3.5 sm:p-4 rounded-lg border border-border self-start md:self-auto shrink-0">
          <ProgressRing value={dayStats.percentage} size={74} strokeWidth={6}>
            <div className="text-center">
              <span className="font-mono text-lg font-semibold text-foreground leading-none">
                {dayStats.percentage}%
              </span>
            </div>
          </ProgressRing>

          <div className="space-y-0.5 text-left">
            <h4 className="text-xs font-semibold text-foreground">
              {dayStats.percentage >= 80
                ? t('dashboard.hero.greatProgress')
                : dayStats.percentage >= 50
                ? t('dashboard.hero.steadyMomentum')
                : t('dashboard.hero.gettingStarted')}
            </h4>
            <p className="text-[11px] text-muted-foreground leading-relaxed max-w-[160px]">
              {dayStats.percentage >= 80
                ? t('dashboard.hero.greatProgressDesc')
                : t('dashboard.hero.steadyMomentumDesc')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
