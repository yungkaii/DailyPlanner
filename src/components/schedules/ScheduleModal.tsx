import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Schedule, RecurrenceRule } from '../../types';
import { CATEGORY_COLORS, getLocalizedCategory } from '../../lib/utils';
import { format, addHours, setMinutes } from 'date-fns';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Schedule, 'id' | 'user_id' | 'created_at'>) => Promise<any>;
  initialData?: Schedule | null;
}

const CATEGORIES = ['Deep Work', 'Work', 'Health', 'Meeting', 'Learning', 'Personal', 'Admin'];

export function ScheduleModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: ScheduleModalProps) {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Deep Work');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [recurring, setRecurring] = useState<RecurrenceRule>('none');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setCategory(initialData.category || 'Deep Work');
      setStartTime(format(new Date(initialData.start_time), "yyyy-MM-dd'T'HH:mm"));
      setEndTime(format(new Date(initialData.end_time), "yyyy-MM-dd'T'HH:mm"));
      setRecurring(initialData.recurring || 'none');
      setLocation(initialData.location || '');
      setDescription(initialData.description || '');
    } else {
      const now = new Date();
      const nextHour = addHours(setMinutes(now, 0), 1);
      const afterHour = addHours(nextHour, 1);
      setTitle('');
      setCategory('Deep Work');
      setStartTime(format(nextHour, "yyyy-MM-dd'T'HH:mm"));
      setEndTime(format(afterHour, "yyyy-MM-dd'T'HH:mm"));
      setRecurring('none');
      setLocation('');
      setDescription('');
    }
    setError(null);
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError(t('schedules.modal.errorTitleRequired'));
      return;
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (end <= start) {
      setError(t('schedules.modal.errorEndAfterStart'));
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onSave({
        title: title.trim(),
        category,
        color: CATEGORY_COLORS[category]?.hex || '#C05D3B',
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        recurring,
        status: 'upcoming',
        location: location.trim() || undefined,
        description: description.trim() || undefined,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || t('schedules.modal.errorSaveFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? t('schedules.modal.editTitle') : t('schedules.modal.newTitle')}
      description={t('schedules.modal.description')}
    >
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {error && (
          <div className="p-2.5 text-xs rounded-md bg-[#BF4040]/8 text-[#BF4040] dark:text-[#D46A6A] border border-[#BF4040]/20">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-foreground mb-1">
            {t('schedules.modal.titleLabel')} <span className="text-[#BF4040]">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('schedules.modal.titlePlaceholder')}
            className="w-full px-3 py-1.5 text-xs rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-foreground mb-1">
            {t('schedules.modal.categoryLabel')}
          </label>
          <div className="flex flex-wrap gap-1">
            {CATEGORIES.map((cat) => {
              const isSelected = category === cat;
              const style = CATEGORY_COLORS[cat];
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border transition-colors cursor-pointer ${
                    isSelected
                      ? `${style.bg} ${style.text} ${style.border} font-semibold ring-1 ring-primary/30`
                      : 'border-border text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full mr-1.5"
                    style={{ backgroundColor: style.hex }}
                  />
                  {getLocalizedCategory(cat, t)}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              {t('schedules.modal.startTimeLabel')} <span className="text-[#BF4040]">*</span>
            </label>
            <input
              type="datetime-local"
              required
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              {t('schedules.modal.endTimeLabel')} <span className="text-[#BF4040]">*</span>
            </label>
            <input
              type="datetime-local"
              required
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              {t('schedules.modal.recurringLabel')}
            </label>
            <select
              value={recurring}
              onChange={(e) => setRecurring(e.target.value as RecurrenceRule)}
              className="w-full px-2.5 py-1.5 text-xs rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="none">{t('common.recurrence.none')}</option>
              <option value="daily">{t('common.recurrence.daily')}</option>
              <option value="weekdays">{t('common.recurrence.weekdays')}</option>
              <option value="weekly">{t('common.recurrence.weekly')}</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              {t('schedules.modal.locationLabel')}
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={t('schedules.modal.locationPlaceholder')}
              className="w-full px-2.5 py-1.5 text-xs rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-foreground mb-1">
            {t('schedules.modal.notesLabel')}
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t('schedules.modal.notesPlaceholder')}
            className="w-full px-2.5 py-1.5 text-xs rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" size="sm" isLoading={isSubmitting}>
            {initialData ? t('common.saveChanges') : t('schedules.modal.createBtn')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
