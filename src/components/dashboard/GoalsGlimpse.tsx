import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGoals } from '../../hooks/useGoals';
import { getLocalizedCategory } from '../../lib/utils';
import { Target } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { ProgressBar } from '../ui/ProgressBar';

export function GoalsGlimpse() {
  const { t } = useTranslation();
  const { goals } = useGoals();
  const activeGoals = goals.filter((g) => g.status === 'in_progress').slice(0, 3);

  return (
    <div className="rounded-lg bg-card border border-border p-5">
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-border">
        <div>
          <h2 className="font-serif text-base font-semibold text-foreground flex items-center gap-2">
            <Target className="w-4 h-4 text-[#7B6B8A]" />
            <span>{t('dashboard.goalsGlimpse.title')}</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t('dashboard.goalsGlimpse.subtitle')}
          </p>
        </div>

        <Link
          to="/goals"
          className="text-xs text-muted-foreground hover:text-foreground font-medium"
        >
          {t('dashboard.goalsGlimpse.viewAll')}
        </Link>
      </div>

      {activeGoals.length === 0 ? (
        <div className="text-center py-6 text-xs text-muted-foreground">
          {t('dashboard.goalsGlimpse.empty')}
        </div>
      ) : (
        <div className="space-y-2.5">
          {activeGoals.map((goal) => {
            const pct = Math.min(
              100,
              Math.max(0, Math.round((goal.current_value / goal.target_value) * 100))
            );

            return (
              <div
                key={goal.id}
                className="p-3 rounded-md bg-muted/30 border border-border space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-foreground">
                    {goal.title}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    {goal.current_value}/{goal.target_value} {goal.unit}
                  </span>
                </div>

                <ProgressBar value={pct} color="bg-primary" />

                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>
                    {getLocalizedCategory(goal.category, t)}
                  </span>
                  {goal.target_date && (
                    <span className="font-mono">{t('dashboard.goalsGlimpse.target', { date: goal.target_date })}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
