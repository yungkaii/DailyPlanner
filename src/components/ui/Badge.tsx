import React from 'react';
import { useTranslation } from 'react-i18next';
import { cn, getCategoryStyle, getLocalizedCategory, PRIORITY_CONFIG } from '../../lib/utils';
import { Priority, ScheduleStatus } from '../../types';

interface CategoryBadgeProps {
  category: string;
  className?: string;
  size?: 'sm' | 'md';
}

export function CategoryBadge({ category, className, size = 'md' }: CategoryBadgeProps) {
  const { t } = useTranslation();
  const style = getCategoryStyle(category);
  const localizedLabel = getLocalizedCategory(category, t);

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded border',
        size === 'sm' ? 'px-1.5 py-0.5 text-[11px]' : 'px-2 py-0.5 text-xs',
        style.bg,
        style.text,
        style.border,
        className
      )}
    >
      <span
        className="w-1.5 h-1.5 rounded-full mr-1.5 shrink-0"
        style={{ backgroundColor: style.hex }}
      />
      {localizedLabel}
    </span>
  );
}

interface PriorityBadgeProps {
  priority: Priority;
  className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const { t } = useTranslation();
  const config = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.medium;
  const label = t(config.labelKey, config.defaultLabel);

  return (
    <span
      className={cn(
        'inline-flex items-center px-1.5 py-0.5 text-[11px] font-medium rounded border',
        config.badgeClass,
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full mr-1.5 shrink-0', config.dotClass)} />
      {label}
    </span>
  );
}

interface StatusBadgeProps {
  status: ScheduleStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const { t } = useTranslation();

  const statusStyles: Record<ScheduleStatus, { labelKey: string; defaultLabel: string; class: string; dot: string }> = {
    upcoming: {
      labelKey: 'common.upcoming',
      defaultLabel: 'Upcoming',
      class: 'bg-muted text-muted-foreground border-border',
      dot: 'bg-muted-foreground/60',
    },
    active: {
      labelKey: 'common.activeNow',
      defaultLabel: 'Active now',
      class: 'bg-primary/10 text-primary border-primary/25 font-semibold',
      dot: 'bg-primary',
    },
    completed: {
      labelKey: 'common.completed',
      defaultLabel: 'Completed',
      class: 'bg-[#5E8C61]/10 text-[#5E8C61] border-[#5E8C61]/20',
      dot: 'bg-[#5E8C61]',
    },
  };

  const item = statusStyles[status] || statusStyles.upcoming;
  const label = t(item.labelKey, item.defaultLabel);

  return (
    <span
      className={cn(
        'inline-flex items-center px-1.5 py-0.5 text-[11px] font-medium rounded border',
        item.class,
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full mr-1.5 shrink-0', item.dot)} />
      {label}
    </span>
  );
}
