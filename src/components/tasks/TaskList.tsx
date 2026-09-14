import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Task } from '../../types';
import { useTasks } from '../../hooks/useTasks';
import { useSchedules } from '../../hooks/useSchedules';
import { useLanguage } from '../../context/LanguageContext';
import { PriorityBadge, CategoryBadge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { RevealOnScroll } from '../ui/RevealOnScroll';
import { formatRelativeDate, formatTimeRange } from '../../lib/utils';
import {
  CheckSquare,
  Square,
  CheckCircle2,
  Clock,
  Trash2,
  Edit2,
  Search,
  Plus,
  Calendar,
} from 'lucide-react';

interface TaskListProps {
  onOpenTaskModal: (task?: Task) => void;
}

export function TaskList({ onOpenTaskModal }: TaskListProps) {
  const { t } = useTranslation();
  const { dateLocale } = useLanguage();
  const { tasks, toggleTask, deleteTask } = useTasks();
  const { schedules } = useSchedules();

  const [statusFilter, setStatusFilter] = useState<'all' | 'remaining' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTasks = tasks.filter((t) => {
    if (statusFilter === 'remaining' && t.completed) return false;
    if (statusFilter === 'completed' && !t.completed) return false;
    if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        t.title.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const getStatusLabel = (st: 'all' | 'remaining' | 'completed') => {
    switch (st) {
      case 'all': return t('common.all');
      case 'remaining': return t('common.remaining');
      case 'completed': return t('common.completed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <RevealOnScroll direction="up" delay={0}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div>
            <h1 className="font-serif text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
              {t('tasks.title')}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t('tasks.subtitle')}
            </p>
          </div>

          <Button
            onClick={() => onOpenTaskModal()}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            size="md"
          >
            {t('tasks.newTask')}
          </Button>
        </div>
      </RevealOnScroll>

      {/* Filter and Search Toolbar */}
      <RevealOnScroll direction="up" delay={50}>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 p-2 rounded-lg bg-card border border-border">
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('tasks.searchPlaceholder')}
              className="w-full pl-8 pr-3 py-1 text-xs rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Status Tabs */}
            <div className="flex items-center p-0.5 bg-muted rounded-md text-xs">
              {(['all', 'remaining', 'completed'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                    statusFilter === st
                      ? 'bg-card font-medium text-foreground border border-border/50'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {getStatusLabel(st)}
                </button>
              ))}
            </div>

            {/* Priority Select */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-2 py-1 text-xs rounded-md border border-border bg-card text-foreground"
            >
              <option value="all">{t('tasks.allPriorities')}</option>
              <option value="urgent">{t('common.priorities.urgentP1')}</option>
              <option value="high">{t('common.priorities.highP2')}</option>
              <option value="medium">{t('common.priorities.mediumP3')}</option>
              <option value="low">{t('common.priorities.lowP4')}</option>
            </select>
          </div>
        </div>
      </RevealOnScroll>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <RevealOnScroll direction="up" delay={80}>
          <div className="text-center py-16 bg-card rounded-lg border border-dashed border-border">
            <CheckSquare className="w-8 h-8 text-muted-foreground/60 mx-auto mb-2" />
            <h3 className="font-serif text-sm font-semibold text-foreground">
              {t('tasks.emptyTitle')}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t('tasks.emptyDesc')}
            </p>
          </div>
        </RevealOnScroll>
      ) : (
        <div className="space-y-2">
          {filteredTasks.map((task, index) => {
            const linkedSchedule = schedules.find((s) => s.id === task.schedule_id);

            return (
              <RevealOnScroll
                key={task.id}
                direction="up"
                delay={Math.min(index * 30, 200)}
                duration={450}
              >
                <div
                  className={`flex items-start justify-between p-3.5 rounded-md border transition-colors ${
                    task.completed
                      ? 'bg-muted/30 border-border/70 opacity-70'
                      : 'bg-card border-border hover:border-muted-foreground/40'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <button
                      type="button"
                      onClick={() => toggleTask(task.id, !task.completed)}
                      className="mt-0.5 text-muted-foreground hover:text-[#5E8C61] transition-colors shrink-0 cursor-pointer"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-[#5E8C61]" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>

                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <PriorityBadge priority={task.priority} />
                        <CategoryBadge category={task.category} size="sm" />
                        {task.due_date && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground font-mono">
                            <Calendar className="w-3 h-3" />
                            <span>{formatRelativeDate(task.due_date, t, dateLocale)}</span>
                          </span>
                        )}
                      </div>

                      <h3
                        onClick={() => onOpenTaskModal(task)}
                        className={`text-xs sm:text-sm font-medium cursor-pointer transition-colors ${
                          task.completed
                            ? 'line-through text-muted-foreground'
                            : 'text-foreground'
                        }`}
                      >
                        {task.title}
                      </h3>

                      {task.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {task.description}
                        </p>
                      )}

                      {/* Linked Schedule badge */}
                      {linkedSchedule && (
                        <div className="pt-0.5">
                          <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded">
                            <Clock className="w-3 h-3 text-primary" />
                            <span>{t('tasks.linkedBlock')}</span>
                            <span className="font-medium text-foreground">{linkedSchedule.title}</span>
                            <span className="font-mono text-[10px]">
                              ({formatTimeRange(linkedSchedule.start_time, linkedSchedule.end_time)})
                            </span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 ml-3">
                    <button
                      onClick={() => onOpenTaskModal(task)}
                      className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-1 rounded text-muted-foreground hover:text-[#BF4040] hover:bg-[#BF4040]/5 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>
      )}
    </div>
  );
}
