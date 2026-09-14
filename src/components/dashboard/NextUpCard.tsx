import React from 'react';
import { useTranslation } from 'react-i18next';
import { Schedule } from '../../types';
import { useLiveTime } from '../../hooks/useLiveTime';
import { useSchedules } from '../../hooks/useSchedules';
import { formatTimeRange } from '../../lib/utils';
import { CategoryBadge, StatusBadge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  Clock,
  MapPin,
  CheckCircle2,
  Coffee,
} from 'lucide-react';

interface NextUpCardProps {
  onOpenScheduleModal: (schedule?: Schedule) => void;
}

export function NextUpCard({ onOpenScheduleModal }: NextUpCardProps) {
  const { t } = useTranslation();
  const { todaySchedules, updateSchedule } = useSchedules();
  const { activeActivity, nextUpcoming, countdownText } = useLiveTime(todaySchedules);

  const targetActivity = activeActivity || nextUpcoming;
  const isCurrentlyActive = !!activeActivity;

  const handleMarkCompleted = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (targetActivity) {
      await updateSchedule({
        ...targetActivity,
        status: 'completed',
      });
    }
  };

  if (!targetActivity) {
    return (
      <div className="rounded-lg bg-card border border-border p-6 flex flex-col items-center justify-center text-center">
        <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center text-muted-foreground mb-2.5">
          <Coffee className="w-5 h-5" />
        </div>
        <h3 className="font-serif text-base font-semibold text-foreground">
          {t('dashboard.nextUp.noRemainingTitle')}
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5 max-w-sm">
          {t('dashboard.nextUp.noRemainingDesc')}
        </p>
        <Button
          size="sm"
          variant="outline"
          className="mt-3.5"
          onClick={() => onOpenScheduleModal()}
        >
          {t('dashboard.nextUp.planEvening')}
        </Button>
      </div>
    );
  }

  return (
    <div
      onClick={() => onOpenScheduleModal(targetActivity)}
      className={`rounded-lg bg-card border border-border p-5 cursor-pointer transition-colors ${
        isCurrentlyActive ? 'border-l-4 border-l-primary bg-primary/[0.02]' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs text-muted-foreground">
              {isCurrentlyActive ? t('dashboard.nextUp.currentFocus') : t('dashboard.nextUp.nextUp')}
            </span>
            <StatusBadge status={isCurrentlyActive ? 'active' : 'upcoming'} />
          </div>

          <h3 className="font-serif text-lg sm:text-xl font-semibold text-foreground">
            {targetActivity.title}
          </h3>

          {targetActivity.description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
              {targetActivity.description}
            </p>
          )}
        </div>

        {/* Countdown Badge */}
        {countdownText && (
          <div className="shrink-0 text-right">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-primary/20 bg-primary/8 text-primary text-xs font-mono font-medium">
              <Clock className="w-3.5 h-3.5" />
              <span>{countdownText}</span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3.5 border-t border-border flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="font-mono font-medium text-foreground">
            {formatTimeRange(targetActivity.start_time, targetActivity.end_time)}
          </span>

          <CategoryBadge category={targetActivity.category} />

          {targetActivity.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
              <span>{targetActivity.location}</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isCurrentlyActive && (
            <Button
              size="sm"
              variant="subtle"
              leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
              onClick={handleMarkCompleted}
            >
              {t('common.markDone')}
            </Button>
          )}
          <span className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium">
            {t('common.details')}
          </span>
        </div>
      </div>
    </div>
  );
}
