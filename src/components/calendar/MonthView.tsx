import React from 'react';
import { useTranslation } from 'react-i18next';
import { Schedule } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  format,
  parseISO,
} from 'date-fns';

interface MonthViewProps {
  currentDate: Date;
  schedules: Schedule[];
  onSelectDate: (date: Date) => void;
  onSelectSchedule: (schedule: Schedule) => void;
}

export function MonthView({
  currentDate,
  schedules,
  onSelectDate,
  onSelectSchedule,
}: MonthViewProps) {
  const { t } = useTranslation();
  const { dateLocale } = useLanguage();
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const referenceWeekDays = eachDayOfInterval({
    start: startDate,
    end: new Date(startDate.getTime() + 6 * 24 * 60 * 60 * 1000),
  });

  return (
    <div className="rounded-lg bg-card border border-border p-3.5 sm:p-5">
      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-1.5 mb-1.5 text-center">
        {referenceWeekDays.map((d) => (
          <div
            key={d.toISOString()}
            className="text-xs font-medium text-muted-foreground py-1"
          >
            {format(d, 'EEE', { locale: dateLocale })}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((day) => {
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isDayToday = isToday(day);
          const isSelected = isSameDay(day, currentDate);

          const daySchedules = schedules.filter((s) => {
            try {
              return isSameDay(parseISO(s.start_time), day);
            } catch {
              return false;
            }
          });

          return (
            <div
              key={day.toISOString()}
              onClick={() => onSelectDate(day)}
              className={`min-h-[80px] sm:min-h-[96px] p-2 rounded-md border transition-colors cursor-pointer flex flex-col justify-between ${
                !isCurrentMonth
                  ? 'opacity-25 border-border/50 bg-muted/10'
                  : isSelected
                  ? 'border-primary/50 bg-primary/[0.02]'
                  : 'border-border hover:border-muted-foreground/40 bg-card'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-mono font-medium px-1 py-0.5 rounded ${
                    isDayToday
                      ? 'bg-primary text-primary-foreground font-semibold'
                      : isSelected
                      ? 'text-primary font-semibold'
                      : 'text-foreground'
                  }`}
                >
                  {format(day, 'd')}
                </span>

                {daySchedules.length > 0 && (
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {daySchedules.length}
                  </span>
                )}
              </div>

              {/* Event chips */}
              <div className="space-y-1 mt-1 overflow-hidden">
                {daySchedules.slice(0, 2).map((item) => (
                  <div
                    key={item.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectSchedule(item);
                    }}
                    className="truncate text-[10px] font-medium px-1 py-0.5 rounded text-foreground flex items-center gap-1 border border-border/60 bg-muted/40"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="truncate">{item.title}</span>
                  </div>
                ))}
                {daySchedules.length > 2 && (
                  <span className="text-[10px] text-muted-foreground pl-0.5 font-mono">
                    {t('calendar.moreEvents', { count: daySchedules.length - 2 })}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
