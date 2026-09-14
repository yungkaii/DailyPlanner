import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Schedule, ScheduleStatus } from '../../types';
import { useSchedules } from '../../hooks/useSchedules';
import { formatTimeRange, getLocalizedCategory } from '../../lib/utils';
import { CategoryBadge, StatusBadge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { RevealOnScroll } from '../ui/RevealOnScroll';
import {
  Clock,
  MapPin,
  Repeat,
  Trash2,
  Edit2,
  CheckCircle2,
  Plus,
  Filter,
} from 'lucide-react';

interface ScheduleListProps {
  onOpenScheduleModal: (schedule?: Schedule) => void;
}

export function ScheduleList({ onOpenScheduleModal }: ScheduleListProps) {
  const { t } = useTranslation();
  const { schedules, updateSchedule, deleteSchedule } = useSchedules();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filtered = schedules.filter((s) => {
    if (statusFilter !== 'all' && s.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && s.category !== categoryFilter) return false;
    return true;
  });

  const categories = Array.from(new Set(schedules.map((s) => s.category)));

  const handleToggleCompleted = async (item: Schedule) => {
    const nextStatus: ScheduleStatus =
      item.status === 'completed' ? 'upcoming' : 'completed';
    await updateSchedule({
      ...item,
      status: nextStatus,
    });
  };

  const getStatusFilterLabel = (status: string) => {
    switch (status) {
      case 'all': return t('common.all');
      case 'upcoming': return t('common.upcoming');
      case 'active': return t('common.activeNow');
      case 'completed': return t('common.completed');
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Action */}
      <RevealOnScroll direction="up" delay={0}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div>
            <h1 className="font-serif text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
              {t('schedules.title')}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t('schedules.subtitle')}
            </p>
          </div>

          <Button
            onClick={() => onOpenScheduleModal()}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            size="md"
          >
            {t('schedules.newBlock')}
          </Button>
        </div>
      </RevealOnScroll>

      {/* Filter Controls */}
      <RevealOnScroll direction="up" delay={50}>
        <div className="flex flex-wrap items-center gap-2 p-2 rounded-lg bg-card border border-border">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mr-2">
            <Filter className="w-3.5 h-3.5" />
            <span>{t('schedules.filterByStatus')}</span>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1">
            {['all', 'upcoming', 'active', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                  statusFilter === status
                    ? 'bg-muted font-semibold text-foreground border border-border'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {getStatusFilterLabel(status)}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          {categories.length > 0 && (
            <div className="flex items-center gap-1 ml-auto">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-2.5 py-1 text-xs rounded border border-border bg-card text-foreground"
              >
                <option value="all">{t('schedules.allCategories')}</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {getLocalizedCategory(c, t)}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </RevealOnScroll>

      {/* Schedule Items Grid */}
      {filtered.length === 0 ? (
        <RevealOnScroll direction="up" delay={80}>
          <div className="text-center py-16 bg-card rounded-lg border border-dashed border-border">
            <Clock className="w-8 h-8 text-muted-foreground/60 mx-auto mb-2" />
            <h3 className="font-serif text-sm font-semibold text-foreground">
              {t('schedules.emptyTitle')}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5 max-w-sm mx-auto">
              {t('schedules.emptyDesc')}
            </p>
          </div>
        </RevealOnScroll>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map((item, index) => {
            const isDone = item.status === 'completed';
            const isActive = item.status === 'active';

            return (
              <RevealOnScroll
                key={item.id}
                direction="up"
                delay={Math.min(index * 40, 240)}
                duration={500}
              >
                <div
                  className={`rounded-md p-4 border transition-colors ${
                    isActive
                      ? 'border-l-3 border-l-primary border-t-border border-r-border border-b-border bg-primary/[0.02]'
                      : isDone
                      ? 'bg-muted/30 border-border opacity-70'
                      : 'bg-card border-border hover:border-muted-foreground/40'
                  }`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-1.5 mb-1">
                          <StatusBadge status={item.status} />
                          <CategoryBadge category={item.category} size="sm" />
                          {item.recurring !== 'none' && (
                            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                              <Repeat className="w-3 h-3" />
                              <span>{t(`common.recurrence.${item.recurring}`, item.recurring)}</span>
                            </span>
                          )}
                        </div>

                        <h3
                          className={`font-serif text-base font-semibold ${
                            isDone
                              ? 'line-through text-muted-foreground'
                              : 'text-foreground'
                          }`}
                        >
                          {item.title}
                        </h3>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onOpenScheduleModal(item)}
                          className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteSchedule(item.id)}
                          className="p-1 rounded text-muted-foreground hover:text-[#BF4040] hover:bg-[#BF4040]/5 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {item.description && (
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                    )}

                    <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <span className="font-mono font-medium text-foreground">
                          {formatTimeRange(item.start_time, item.end_time)}
                        </span>
                        {item.location && (
                          <span className="flex items-center gap-1 text-[11px]">
                            <MapPin className="w-3 h-3" />
                            <span>{item.location}</span>
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleToggleCompleted(item)}
                        className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded transition-colors cursor-pointer ${
                          isDone
                            ? 'bg-muted text-muted-foreground hover:bg-muted/80'
                            : 'bg-[#5E8C61]/10 text-[#5E8C61] hover:bg-[#5E8C61]/20'
                        }`}
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{isDone ? t('common.markUpcoming') : t('common.markDone')}</span>
                      </button>
                    </div>
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
