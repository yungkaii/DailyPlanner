import React from 'react';
import { Schedule } from '../../types';
import { formatTimeRange } from '../../lib/utils';
import { CategoryBadge } from '../ui/Badge';
import { parseISO, isSameDay, getHours, getMinutes } from 'date-fns';
import { MapPin } from 'lucide-react';

interface DayViewProps {
  currentDate: Date;
  schedules: Schedule[];
  onSelectSchedule: (schedule: Schedule) => void;
}

const HOURS = Array.from({ length: 16 }, (_, i) => i + 6); // 06:00 to 21:00

export function DayView({
  currentDate,
  schedules,
  onSelectSchedule,
}: DayViewProps) {
  const isSelectedDateToday = isSameDay(currentDate, new Date());
  const now = new Date();
  const currentHour = getHours(now);
  const currentMin = getMinutes(now);

  const daySchedules = schedules.filter((s) => {
    try {
      return isSameDay(parseISO(s.start_time), currentDate);
    } catch {
      return false;
    }
  });

  return (
    <div className="rounded-lg bg-card border border-border p-5 overflow-x-auto">
      <div className="min-w-[550px] space-y-3">
        {HOURS.map((hour) => {
          const hourLabel = `${hour.toString().padStart(2, '0')}:00`;

          const matchingSchedules = daySchedules.filter((s) => {
            try {
              const start = parseISO(s.start_time);
              return getHours(start) === hour;
            } catch {
              return false;
            }
          });

          const isCurrentHourRow = isSelectedDateToday && currentHour === hour;

          return (
            <div key={hour} className="relative flex items-start gap-3 min-h-[56px]">
              {/* Hour Label */}
              <div className="w-12 shrink-0 text-xs font-mono text-muted-foreground pt-1 text-right">
                {hourLabel}
              </div>

              {/* Ruled Grid Line */}
              <div className="flex-1 relative pt-1.5 border-t border-border">
                {/* Terracotta Live Time Line */}
                {isCurrentHourRow && (
                  <div
                    className="absolute left-0 right-0 z-20 flex items-center pointer-events-none"
                    style={{ top: `${(currentMin / 60) * 100}%` }}
                  >
                    <div className="w-2 h-2 rounded-full bg-primary -ml-1" />
                    <div className="flex-1 h-px bg-primary" />
                  </div>
                )}

                {/* Schedules inside this hour */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {matchingSchedules.map((item) => {
                    const isActive = item.status === 'active';
                    const isDone = item.status === 'completed';

                    return (
                      <div
                        key={item.id}
                        onClick={() => onSelectSchedule(item)}
                        className={`rounded-md p-2.5 border transition-colors cursor-pointer ${
                          isActive
                            ? 'border-l-3 border-l-primary border-t-border border-r-border border-b-border bg-primary/[0.02]'
                            : isDone
                            ? 'bg-muted/30 border-border opacity-70'
                            : 'bg-card border-border hover:border-muted-foreground/30'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-mono text-xs font-medium text-foreground">
                            {formatTimeRange(item.start_time, item.end_time)}
                          </span>
                          <CategoryBadge category={item.category} size="sm" />
                        </div>
                        <h4 className="text-xs font-medium text-foreground truncate">
                          {item.title}
                        </h4>
                        {item.location && (
                          <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-1">
                            <MapPin className="w-3 h-3" />
                            <span>{item.location}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
