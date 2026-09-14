import React from 'react';
import { useTranslation } from 'react-i18next';
import { Schedule } from '../../types';
import { formatTimeRange } from '../../lib/utils';
import { CategoryBadge, StatusBadge } from '../ui/Badge';
import { Clock, MapPin, Plus } from 'lucide-react';
import { parseISO, differenceInMinutes } from 'date-fns';

interface TodayTimelineProps {
  schedules: Schedule[];
  onOpenScheduleModal: (schedule?: Schedule) => void;
}

export function TodayTimeline({
  schedules,
  onOpenScheduleModal,
}: TodayTimelineProps) {
  const { t } = useTranslation();
  const sorted = [...schedules].sort(
    (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
  );

  return (
    <div className="rounded-lg bg-card border border-border p-5">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
        <div>
          <h2 className="font-serif text-base font-semibold text-foreground flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <span>{t('dashboard.timeline.title')}</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t('dashboard.timeline.timeBlocksToday', { count: schedules.length })}
          </p>
        </div>

        <button
          onClick={() => onOpenScheduleModal()}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border border-border bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-primary" />
          <span>{t('dashboard.timeline.addBlock')}</span>
        </button>
      </div>

      {sorted.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-border rounded-md">
          <p className="text-xs text-muted-foreground">
            {t('dashboard.timeline.empty')}
          </p>
          <button
            onClick={() => onOpenScheduleModal()}
            className="mt-1.5 text-xs text-primary font-medium hover:underline cursor-pointer"
          >
            {t('dashboard.timeline.planDay')}
          </button>
        </div>
      ) : (
        <div className="relative pl-5 space-y-3 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-px before:bg-border">
          {sorted.map((item) => {
            const start = parseISO(item.start_time);
            const end = parseISO(item.end_time);
            const durationMins = Math.max(0, differenceInMinutes(end, start));
            const isActive = item.status === 'active';
            const isDone = item.status === 'completed';

            return (
              <div
                key={item.id}
                onClick={() => onOpenScheduleModal(item)}
                className={`relative rounded-md p-3 border transition-colors cursor-pointer ${
                  isActive
                    ? 'border-l-3 border-l-primary border-t-border border-r-border border-b-border bg-primary/[0.02]'
                    : isDone
                    ? 'bg-muted/30 border-border/70 opacity-70'
                    : 'bg-card border-border hover:border-muted-foreground/30'
                }`}
              >
                {/* Ruled timeline node dot */}
                <div
                  className={`absolute -left-[19px] top-3.5 w-2 h-2 rounded-full ${
                    isActive
                      ? 'bg-primary'
                      : isDone
                      ? 'bg-[#5E8C61]'
                      : 'bg-muted-foreground/40'
                  }`}
                />

                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono font-medium text-foreground">
                        {formatTimeRange(item.start_time, item.end_time)}
                      </span>
                      <span className="text-[11px] text-muted-foreground font-mono">
                        ({durationMins}m)
                      </span>
                      <CategoryBadge category={item.category} size="sm" />
                      <StatusBadge status={item.status} />
                    </div>

                    <h4
                      className={`text-xs font-medium ${
                        isDone
                          ? 'line-through text-muted-foreground'
                          : 'text-foreground'
                      }`}
                    >
                      {item.title}
                    </h4>

                    {item.description && (
                      <p className="text-[11px] text-muted-foreground line-clamp-1">
                        {item.description}
                      </p>
                    )}
                  </div>

                  {item.location && (
                    <div className="hidden sm:flex items-center gap-1 text-[11px] text-muted-foreground shrink-0">
                      <MapPin className="w-3 h-3" />
                      <span>{item.location}</span>
                    </div>
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
