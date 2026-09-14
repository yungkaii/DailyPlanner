import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Task } from '../../types';
import { useTasks } from '../../hooks/useTasks';
import { useSchedules } from '../../hooks/useSchedules';
import { PriorityBadge } from '../ui/Badge';
import {
  CheckSquare,
  Square,
  CheckCircle2,
  Clock,
  Plus,
} from 'lucide-react';
import { Link } from '@tanstack/react-router';

interface QuickTasksProps {
  onOpenTaskModal: (task?: Task) => void;
}

export function QuickTasks({ onOpenTaskModal }: QuickTasksProps) {
  const { t } = useTranslation();
  const { todayTasks, toggleTask, createTask } = useTasks();
  const { schedules } = useSchedules();
  const [quickTitle, setQuickTitle] = useState('');
  const [filter, setFilter] = useState<'all' | 'remaining' | 'completed'>('remaining');

  const completedCount = todayTasks.filter((t) => t.completed).length;
  const remainingCount = todayTasks.filter((t) => !t.completed).length;

  const filteredTasks = todayTasks.filter((t) => {
    if (filter === 'remaining') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    await createTask({
      title: quickTitle.trim(),
      priority: 'medium',
      due_date: new Date().toISOString(),
      category: 'Work',
      completed: false,
    });
    setQuickTitle('');
  };

  return (
    <div className="rounded-lg bg-card border border-border p-5">
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-border">
        <div>
          <h2 className="font-serif text-base font-semibold text-foreground flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-[#4A7B9D]" />
            <span>{t('dashboard.quickTasks.title')}</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t('dashboard.quickTasks.counts', { completed: completedCount, remaining: remainingCount })}
          </p>
        </div>

        <Link
          to="/tasks"
          className="text-xs text-muted-foreground hover:text-foreground font-medium"
        >
          {t('common.viewAll')}
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-0.5 bg-muted rounded-md mb-3 text-xs">
        <button
          onClick={() => setFilter('remaining')}
          className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
            filter === 'remaining'
              ? 'bg-card font-medium text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {t('common.remaining')} ({remainingCount})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
            filter === 'completed'
              ? 'bg-card font-medium text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {t('common.completed')} ({completedCount})
        </button>
        <button
          onClick={() => setFilter('all')}
          className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
            filter === 'all'
              ? 'bg-card font-medium text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {t('common.all')} ({todayTasks.length})
        </button>
      </div>

      {/* Inline Quick Add */}
      <form onSubmit={handleQuickAdd} className="relative mb-3">
        <input
          type="text"
          value={quickTitle}
          onChange={(e) => setQuickTitle(e.target.value)}
          placeholder={t('dashboard.quickTasks.placeholder')}
          className="w-full pl-3 pr-8 py-1.5 text-xs rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
        {quickTitle.trim() && (
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 rounded text-primary hover:bg-muted cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        )}
      </form>

      {/* Tasks List */}
      <div className="space-y-1.5">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-6 text-xs text-muted-foreground">
            {filter === 'remaining'
              ? t('dashboard.quickTasks.allDone')
              : t('dashboard.quickTasks.noTasks')}
          </div>
        ) : (
          filteredTasks.map((task) => {
            const linkedSchedule = schedules.find((s) => s.id === task.schedule_id);

            return (
              <div
                key={task.id}
                className="flex items-center justify-between p-2 rounded-md border border-border/60 bg-card hover:border-border transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <button
                    type="button"
                    onClick={() => toggleTask(task.id, !task.completed)}
                    className="text-muted-foreground hover:text-[#5E8C61] transition-colors shrink-0 cursor-pointer"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-[#5E8C61]" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>

                  <div className="min-w-0">
                    <p
                      onClick={() => onOpenTaskModal(task)}
                      className={`text-xs truncate cursor-pointer transition-colors ${
                        task.completed
                          ? 'line-through text-muted-foreground'
                          : 'text-foreground'
                      }`}
                    >
                      {task.title}
                    </p>

                    {linkedSchedule && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5">
                        <Clock className="w-2.5 h-2.5 text-primary" />
                        <span className="truncate">{linkedSchedule.title}</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <PriorityBadge priority={task.priority} />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
