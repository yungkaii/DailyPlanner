import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, isToday, isTomorrow, isYesterday, parseISO } from 'date-fns';
import type { Locale } from 'date-fns';
import { Priority, Schedule, ScheduleStatus } from '../types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimeRange(startIso: string, endIso: string): string {
  try {
    const start = parseISO(startIso);
    const end = parseISO(endIso);
    return `${format(start, 'HH:mm')} – ${format(end, 'HH:mm')}`;
  } catch (e) {
    return '';
  }
}

export function formatRelativeDate(
  dateIso: string,
  t?: (key: string) => string,
  locale?: Locale
): string {
  try {
    const date = parseISO(dateIso);
    const timeFormatted = format(date, 'HH:mm');
    if (isToday(date)) {
      const todayLabel = t ? t('common.today') : 'Today';
      return `${todayLabel}, ${timeFormatted}`;
    }
    if (isTomorrow(date)) {
      const tomorrowLabel = t ? t('common.tomorrow') : 'Tomorrow';
      return `${tomorrowLabel}, ${timeFormatted}`;
    }
    if (isYesterday(date)) {
      const yesterdayLabel = t ? t('common.yesterday') : 'Yesterday';
      return `${yesterdayLabel}, ${timeFormatted}`;
    }
    return format(date, 'd MMM, HH:mm', { locale });
  } catch (e) {
    return dateIso;
  }
}

export function getGreeting(name?: string, t?: (key: string) => string): string {
  const hour = new Date().getHours();
  let greet = t ? t('dashboard.hero.goodMorning') : 'Good morning';
  if (hour >= 12 && hour < 17) {
    greet = t ? t('dashboard.hero.goodAfternoon') : 'Good afternoon';
  } else if (hour >= 17 || hour < 5) {
    greet = t ? t('dashboard.hero.goodEvening') : 'Good evening';
  }
  return name ? `${greet}, ${name}` : greet;
}

export function calculateScheduleStatus(schedule: Schedule, now: Date = new Date()): ScheduleStatus {
  try {
    const start = parseISO(schedule.start_time);
    const end = parseISO(schedule.end_time);
    if (now < start) return 'upcoming';
    if (now >= start && now <= end) return 'active';
    return 'completed';
  } catch (e) {
    return schedule.status || 'upcoming';
  }
}

// Muted, grounded category colors
export const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string; hex: string }> = {
  'Deep Work': { bg: 'bg-[#4A7B9D]/8 dark:bg-[#4A7B9D]/15', text: 'text-[#4A7B9D] dark:text-[#6FA3C7]', border: 'border-[#4A7B9D]/20', hex: '#4A7B9D' },
  'Work': { bg: 'bg-[#5B7A9C]/8 dark:bg-[#5B7A9C]/15', text: 'text-[#5B7A9C] dark:text-[#8CABC5]', border: 'border-[#5B7A9C]/20', hex: '#5B7A9C' },
  'Health': { bg: 'bg-[#5E8C61]/8 dark:bg-[#5E8C61]/15', text: 'text-[#5E8C61] dark:text-[#7BAF7E]', border: 'border-[#5E8C61]/20', hex: '#5E8C61' },
  'Meeting': { bg: 'bg-[#B8860B]/8 dark:bg-[#B8860B]/15', text: 'text-[#B8860B] dark:text-[#D4A843]', border: 'border-[#B8860B]/20', hex: '#B8860B' },
  'Learning': { bg: 'bg-[#7B6B8A]/8 dark:bg-[#7B6B8A]/15', text: 'text-[#7B6B8A] dark:text-[#A294B0]', border: 'border-[#7B6B8A]/20', hex: '#7B6B8A' },
  'Personal': { bg: 'bg-[#C05D3B]/8 dark:bg-[#C05D3B]/15', text: 'text-[#C05D3B] dark:text-[#D4826A]', border: 'border-[#C05D3B]/20', hex: '#C05D3B' },
  'Admin': { bg: 'bg-[#8B8178]/8 dark:bg-[#8B8178]/15', text: 'text-[#8B8178] dark:text-[#A89F96]', border: 'border-[#8B8178]/20', hex: '#8B8178' },
};

export function getCategoryStyle(category: string) {
  return CATEGORY_COLORS[category] || {
    bg: 'bg-primary/8',
    text: 'text-primary',
    border: 'border-primary/15',
    hex: '#C05D3B',
  };
}

export function getLocalizedCategory(category: string, t: (key: string) => string): string {
  const map: Record<string, string> = {
    'Deep Work': 'common.categories.deepWork',
    'Work': 'common.categories.work',
    'Health': 'common.categories.health',
    'Meeting': 'common.categories.meeting',
    'Learning': 'common.categories.learning',
    'Personal': 'common.categories.personal',
    'Admin': 'common.categories.admin',
  };
  const key = map[category];
  return key ? t(key) : category;
}

export const PRIORITY_CONFIG: Record<Priority, { labelKey: string; defaultLabel: string; badgeClass: string; dotClass: string }> = {
  urgent: {
    labelKey: 'common.priorities.urgent',
    defaultLabel: 'Urgent',
    badgeClass: 'bg-[#BF4040]/8 text-[#BF4040] dark:text-[#D46A6A] border-[#BF4040]/20',
    dotClass: 'bg-[#BF4040]',
  },
  high: {
    labelKey: 'common.priorities.high',
    defaultLabel: 'High',
    badgeClass: 'bg-[#B8860B]/8 text-[#B8860B] dark:text-[#D4A843] border-[#B8860B]/20',
    dotClass: 'bg-[#B8860B]',
  },
  medium: {
    labelKey: 'common.priorities.medium',
    defaultLabel: 'Medium',
    badgeClass: 'bg-[#4A7B9D]/8 text-[#4A7B9D] dark:text-[#6FA3C7] border-[#4A7B9D]/20',
    dotClass: 'bg-[#4A7B9D]',
  },
  low: {
    labelKey: 'common.priorities.low',
    defaultLabel: 'Low',
    badgeClass: 'bg-[#8B8178]/8 text-[#8B8178] dark:text-[#A89F96] border-[#8B8178]/20',
    dotClass: 'bg-[#8B8178]',
  },
};
