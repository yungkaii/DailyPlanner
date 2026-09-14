import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Goal } from '../../types';
import { useGoals } from '../../hooks/useGoals';
import { StatsOverview } from './StatsOverview';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import { CategoryBadge } from '../ui/Badge';
import { RevealOnScroll } from '../ui/RevealOnScroll';
import { getLocalizedCategory } from '../../lib/utils';
import {
  Target,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  Minus,
} from 'lucide-react';

interface GoalListProps {
  onOpenGoalModal: (goal?: Goal) => void;
}

export function GoalList({ onOpenGoalModal }: GoalListProps) {
  const { t } = useTranslation();
  const { goals, updateGoalProgress, deleteGoal } = useGoals();
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = goals.filter((g) => {
    if (statusFilter !== 'all' && g.status !== statusFilter) return false;
    return true;
  });

  const handleStep = async (goal: Goal, delta: number) => {
    const nextVal = Math.max(0, Math.min(goal.target_value, goal.current_value + delta));
    await updateGoalProgress(goal.id, nextVal);
  };

  const getStatusLabel = (st: string) => {
    switch (st) {
      case 'all': return t('common.all');
      case 'in_progress': return t('common.inProgress');
      case 'completed': return t('common.completed');
      default: return st;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <RevealOnScroll direction="up" delay={0}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div>
            <h1 className="font-serif text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
              {t('goals.title')}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t('goals.subtitle')}
            </p>
          </div>

          <Button
            onClick={() => onOpenGoalModal()}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            size="md"
          >
            {t('goals.newGoal')}
          </Button>
        </div>
      </RevealOnScroll>

      {/* Analytics KPI Cards */}
      <StatsOverview />

      {/* Goals Section */}
      <div className="space-y-3.5 pt-2">
        <RevealOnScroll direction="up" delay={40}>
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-base font-semibold text-foreground flex items-center gap-2">
              <Target className="w-4 h-4 text-[#7B6B8A]" />
              <span>{t('goals.targetObjectives')}</span>
            </h2>

            {/* Status Filter */}
            <div className="flex items-center p-0.5 bg-muted rounded-md text-xs">
              {['all', 'in_progress', 'completed'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded capitalize transition-colors cursor-pointer ${
                    statusFilter === st
                      ? 'bg-card font-medium text-foreground border border-border/50'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {getStatusLabel(st)}
                </button>
              ))}
            </div>
          </div>
        </RevealOnScroll>

        {filtered.length === 0 ? (
          <RevealOnScroll direction="up" delay={80}>
            <div className="text-center py-16 bg-card rounded-lg border border-dashed border-border">
              <Target className="w-8 h-8 text-muted-foreground/60 mx-auto mb-2" />
              <h3 className="font-serif text-sm font-semibold text-foreground">
                {t('goals.emptyTitle')}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t('goals.emptyDesc')}
              </p>
            </div>
          </RevealOnScroll>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((goal, index) => {
              const pct = Math.min(
                100,
                Math.max(0, Math.round((goal.current_value / goal.target_value) * 100))
              );
              const isCompleted = goal.status === 'completed' || pct >= 100;

              return (
                <RevealOnScroll
                  key={goal.id}
                  direction="up"
                  delay={Math.min(index * 50, 250)}
                  duration={500}
                >
                  <div className="flex flex-col justify-between rounded-lg p-4 bg-card border border-border space-y-3 h-full hover:border-muted-foreground/40 transition-colors">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <CategoryBadge category={goal.category} size="sm" />
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onOpenGoalModal(goal)}
                            className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteGoal(goal.id)}
                            className="p-1 rounded text-muted-foreground hover:text-[#BF4040] hover:bg-[#BF4040]/5 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <h3 className="font-serif text-sm font-semibold text-foreground">
                        {goal.title}
                      </h3>

                      {goal.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {goal.description}
                        </p>
                      )}
                    </div>

                    {/* Progress bar and controls */}
                    <div className="space-y-1.5 pt-2 border-t border-border">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          {t('goals.completedPct', { pct })}
                        </span>
                        <span className="font-mono text-xs font-medium text-foreground">
                          {goal.current_value} / {goal.target_value} {goal.unit}
                        </span>
                      </div>

                      <ProgressBar
                        value={pct}
                        color={isCompleted ? 'bg-[#5E8C61]' : 'bg-primary'}
                      />

                      {/* Step Controls */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleStep(goal, -1)}
                            disabled={goal.current_value <= 0}
                            className="p-1 rounded border border-border hover:bg-muted text-muted-foreground disabled:opacity-30 cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStep(goal, 1)}
                            disabled={goal.current_value >= goal.target_value}
                            className="p-1 rounded border border-border hover:bg-muted text-muted-foreground disabled:opacity-30 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {goal.target_date && (
                          <span className="flex items-center gap-1 text-[11px] text-muted-foreground font-mono">
                            <Calendar className="w-3 h-3" />
                            <span>{goal.target_date}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </RevealOnScroll>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
