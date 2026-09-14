import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CalendarViewMode, Schedule } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { DayView } from './DayView';
import { WeekView } from './WeekView';
import { MonthView } from './MonthView';
import { Tabs } from '../ui/Tabs';
import { Button } from '../ui/Button';
import { RevealOnScroll } from '../ui/RevealOnScroll';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
} from 'lucide-react';
import {
  format,
  addDays,
  subDays,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
} from 'date-fns';

interface CalendarViewProps {
  schedules: Schedule[];
  onOpenScheduleModal: (schedule?: Schedule) => void;
}

export function CalendarView({
  schedules,
  onOpenScheduleModal,
}: CalendarViewProps) {
  const { t } = useTranslation();
  const { dateLocale } = useLanguage();
  const [mode, setMode] = useState<CalendarViewMode>('week');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const handlePrev = () => {
    if (mode === 'day') setCurrentDate(subDays(currentDate, 1));
    else if (mode === 'week') setCurrentDate(subWeeks(currentDate, 1));
    else setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNext = () => {
    if (mode === 'day') setCurrentDate(addDays(currentDate, 1));
    else if (mode === 'week') setCurrentDate(addWeeks(currentDate, 1));
    else setCurrentDate(addMonths(currentDate, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const getTitle = () => {
    if (mode === 'day') return format(currentDate, 'EEEE, d MMMM yyyy', { locale: dateLocale });
    if (mode === 'week') return t('calendar.weekOf', { date: format(currentDate, 'd MMM yyyy', { locale: dateLocale }) });
    return format(currentDate, 'MMMM yyyy', { locale: dateLocale });
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <RevealOnScroll direction="up" delay={0}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleToday}>
              {t('calendar.todayBtn')}
            </Button>

            <div className="flex items-center gap-0.5">
              <button
                onClick={handlePrev}
                className="p-1.5 rounded border border-border text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="p-1.5 rounded border border-border text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <h2 className="font-serif text-base sm:text-lg font-semibold text-foreground ml-1.5">
              {getTitle()}
            </h2>
          </div>

          <div className="flex items-center gap-2.5">
            <Tabs
              size="sm"
              activeId={mode}
              onChange={(m) => setMode(m as CalendarViewMode)}
              options={[
                { id: 'day', label: t('calendar.dayTab') },
                { id: 'week', label: t('calendar.weekTab') },
                { id: 'month', label: t('calendar.monthTab') },
              ]}
            />

            <Button
              size="sm"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => onOpenScheduleModal()}
            >
              {t('calendar.newBlock')}
            </Button>
          </div>
        </div>
      </RevealOnScroll>

      {/* Calendar Body */}
      <RevealOnScroll direction="up" delay={60} duration={500}>
        {mode === 'day' && (
          <DayView
            currentDate={currentDate}
            schedules={schedules}
            onSelectSchedule={onOpenScheduleModal}
          />
        )}

        {mode === 'week' && (
          <WeekView
            currentDate={currentDate}
            schedules={schedules}
            onSelectSchedule={onOpenScheduleModal}
            onSelectDate={(d) => {
              setCurrentDate(d);
              setMode('day');
            }}
          />
        )}

        {mode === 'month' && (
          <MonthView
            currentDate={currentDate}
            schedules={schedules}
            onSelectDate={(d) => {
              setCurrentDate(d);
              setMode('day');
            }}
            onSelectSchedule={onOpenScheduleModal}
          />
        )}
      </RevealOnScroll>
    </div>
  );
}
