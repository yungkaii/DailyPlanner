import { useState, useEffect } from 'react';
import { format, parseISO, differenceInMinutes, differenceInSeconds } from 'date-fns';
import { Schedule } from '../types';
import { useLanguage } from '../context/LanguageContext';

export function useLiveTime(schedules: Schedule[] = []) {
  const [now, setNow] = useState(new Date());
  const { dateLocale, t } = useLanguage();

  useEffect(() => {
    // Update every second for live countdown precision
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const timeString = format(now, 'HH:mm');
  const secondsString = format(now, 'ss');
  const dateString = format(now, 'EEEE, d MMMM yyyy', { locale: dateLocale });
  const shortDateString = format(now, 'd MMM yyyy', { locale: dateLocale });

  // Find active schedule or next upcoming
  const activeActivity = schedules.find((s) => {
    try {
      const start = parseISO(s.start_time);
      const end = parseISO(s.end_time);
      return now >= start && now <= end;
    } catch {
      return false;
    }
  });

  const nextUpcoming = schedules
    .filter((s) => {
      try {
        const start = parseISO(s.start_time);
        return start > now;
      } catch {
        return false;
      }
    })
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())[0];

  let countdownText = '';
  const remainingLabel = t('dashboard.nextUp.remaining');
  const startsInLabel = t('dashboard.nextUp.startsIn');

  if (activeActivity) {
    const end = parseISO(activeActivity.end_time);
    const minsLeft = Math.max(0, differenceInMinutes(end, now));
    countdownText = minsLeft > 60
      ? `${Math.floor(minsLeft / 60)}h ${minsLeft % 60}m ${remainingLabel}`
      : `${minsLeft}m ${remainingLabel}`;
  } else if (nextUpcoming) {
    const start = parseISO(nextUpcoming.start_time);
    const minsUntil = Math.max(0, differenceInMinutes(start, now));
    const secsUntil = Math.max(0, differenceInSeconds(start, now) % 60);
    if (minsUntil > 60) {
      countdownText = `${startsInLabel} ${Math.floor(minsUntil / 60)}h ${minsUntil % 60}m`;
    } else if (minsUntil > 0) {
      countdownText = `${startsInLabel} ${minsUntil}m`;
    } else {
      countdownText = `${startsInLabel} ${secsUntil}s`;
    }
  }

  return {
    now,
    timeString,
    secondsString,
    dateString,
    shortDateString,
    activeActivity,
    nextUpcoming,
    countdownText,
  };
}
