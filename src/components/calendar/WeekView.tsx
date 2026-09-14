import React from 'react';
import { useTranslation } from 'react-i18next';
import { Schedule } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  isToday,
  format,
  parseISO,
} from 'date-fns';

interface WeekViewProps {
  currentDate: Date;
  schedules: Schedule[];
  onSelectSchedule: (schedule: Schedule) => void;
  onSelectDate: (date: Date) => void;
}

export function WeekView({
  currentDate,
  schedules,
  onSelectSchedule,
  onSelectDate,
}: WeekViewProps) {
  const { t } = useTranslation();
  const { dateLocale } = useLanguage();
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  return (
    <div className="rounded-lg bg-card border border-border p-3.5 sm:p-5 overflow-x-auto">
      <div className="grid grid-cols-7 gap-2 min-w-[700px]">
        {days.map((day) => {
          const isCurrent = isToday(day);
          const isSelected = isSameDay(day, currentDate);

          const daySchedules = schedules
            .filter((s) => {
              try {
                return isSameDay(parseISO(s.start_time), day);
              } catch {
                return false;
              }
            })
            .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());

          return (
            <div
              key={day.toISOString()}
              className={`flex flex-col rounded-md border p-2 min-h-[340px] transition-colors ${
                isSelected
                  ? 'border-primary/40 bg-primary/[0.02]'
                  : 'border-border bg-muted/20'
              }`}
            >
              {/* Day Header */}
              <button
                type="button"
                onClick={() => onSelectDate(day)}
                className={`text-center py-1.5 px-1 rounded mb-2 transition-colors cursor-pointer ${
                  isCurrent
                    ? 'bg-primary text-primary-foreground font-semibold'
                    : 'hover:bg-muted text-foreground'
                }`}
              >
                <span className="block text-[10px] font-medium text-muted-foreground">
                  {format(day, 'EEE', { locale: dateLocale })}
                </span>
                <span className="text-sm font-semibold font-mono">{format(day, 'd')}</span>
              </button>

              {/* Day's schedules */}
              <div className="flex-1 space-y-1.5 overflow-y-auto">
                {daySchedules.length === 0 ? (
                  <p className="text-[11px] text-muted-foreground/60 text-center py-4">
                    {t('calendar.emptyWeekDay')}
                  </p>
                ) : (
                  daySchedules.map((item) => {
                    const isDone = item.status === 'completed';
                    const isActive = item.status === 'active';

                    return (
                      <div
                        key={item.id}
                        onClick={() => onSelectSchedule(item)}
                        className={`p-1.5 rounded border text-left cursor-pointer transition-colors ${
                          isActive
                            ? 'bg-card border-l-2 border-l-primary border-t-border border-r-border border-b-border'
                            : isDone
                            ? 'bg-muted/30 border-border opacity-70'
                            : 'bg-card border-border hover:border-muted-foreground/40'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span className="font-mono text-[10px] text-muted-foreground">
                            {format(parseISO(item.start_time), 'HH:mm')}
                          </span>
                          <span
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ backgroundColor: item.color }}
                          />
                        </div>
                        <p
                          className={`text-xs font-medium line-clamp-2 ${
                            isDone
                              ? 'line-through text-muted-foreground'
                              : 'text-foreground'
                          }`}
                        >
                          {item.title}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
