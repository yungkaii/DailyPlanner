import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Task, Priority, Schedule } from '../../types';
import { useSchedules } from '../../hooks/useSchedules';
import { formatTimeRange, getLocalizedCategory } from '../../lib/utils';
import { format } from 'date-fns';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Task, 'id' | 'user_id' | 'created_at'>) => Promise<any>;
  initialData?: Task | null;
  defaultScheduleId?: string | null;
}

const PRIORITIES: { id: Priority; labelKey: string; defaultLabel: string; color: string }[] = [
  { id: 'urgent', labelKey: 'common.priorities.urgentP1', defaultLabel: 'Urgent (P1)', color: 'text-[#BF4040] bg-[#BF4040]/10 border-[#BF4040]/25' },
  { id: 'high', labelKey: 'common.priorities.highP2', defaultLabel: 'High (P2)', color: 'text-[#B8860B] bg-[#B8860B]/10 border-[#B8860B]/25' },
  { id: 'medium', labelKey: 'common.priorities.mediumP3', defaultLabel: 'Medium (P3)', color: 'text-[#4A7B9D] bg-[#4A7B9D]/10 border-[#4A7B9D]/25' },
  { id: 'low', labelKey: 'common.priorities.lowP4', defaultLabel: 'Low (P4)', color: 'text-muted-foreground bg-muted border-border' },
];

const CATEGORIES = ['Work', 'Deep Work', 'Health', 'Meeting', 'Learning', 'Personal', 'Admin'];

export function TaskModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  defaultScheduleId,
}: TaskModalProps) {
  const { t } = useTranslation();
  const { schedules } = useSchedules();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [scheduleId, setScheduleId] = useState<string | ''>('');
  const [category, setCategory] = useState('Work');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description || '');
      setPriority(initialData.priority || 'medium');
      setDueDate(
        initialData.due_date
          ? format(new Date(initialData.due_date), "yyyy-MM-dd'T'HH:mm")
          : ''
      );
      setScheduleId(initialData.schedule_id || '');
      setCategory(initialData.category || 'Work');
    } else {
      const now = new Date();
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate(format(now, "yyyy-MM-dd'T'23:59"));
      setScheduleId(defaultScheduleId || '');
      setCategory('Work');
    }
    setError(null);
  }, [initialData, defaultScheduleId, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError(t('tasks.modal.errorTitleRequired'));
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onSave({
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        due_date: dueDate ? new Date(dueDate).toISOString() : null,
        schedule_id: scheduleId || null,
        category,
        completed: initialData ? initialData.completed : false,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || t('tasks.modal.errorSaveFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? t('tasks.modal.editTitle') : t('tasks.modal.newTitle')}
      description={t('tasks.modal.description')}
    >
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {error && (
          <div className="p-2.5 text-xs rounded-md bg-[#BF4040]/8 text-[#BF4040] dark:text-[#D46A6A] border border-[#BF4040]/20">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-foreground mb-1">
            {t('tasks.modal.titleLabel')} <span className="text-[#BF4040]">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('tasks.modal.titlePlaceholder')}
            className="w-full px-3 py-1.5 text-xs rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-foreground mb-1">
            {t('tasks.modal.priorityLabel')}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {PRIORITIES.map((p) => {
              const isSelected = priority === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPriority(p.id)}
                  className={`px-2.5 py-1 rounded text-xs font-medium border text-center transition-colors cursor-pointer ${
                    isSelected
                      ? `${p.color} ring-1 ring-primary/30 font-semibold`
                      : 'border-border text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {t(p.labelKey, p.defaultLabel)}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              {t('tasks.modal.dueDateLabel')}
            </label>
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              {t('tasks.modal.categoryLabel')}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {getLocalizedCategory(c, t)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Schedule Linking */}
        <div>
          <label className="block text-xs font-medium text-foreground mb-1">
            {t('tasks.modal.linkScheduleLabel')}
          </label>
          <select
            value={scheduleId}
            onChange={(e) => setScheduleId(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">{t('tasks.modal.noScheduleLink')}</option>
            {schedules.map((s: Schedule) => (
              <option key={s.id} value={s.id}>
                {s.title} ({formatTimeRange(s.start_time, s.end_time)})
              </option>
            ))}
          </select>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {t('tasks.modal.linkScheduleHint')}
          </p>
        </div>

        <div>
          <label className="block text-xs font-medium text-foreground mb-1">
            {t('tasks.modal.notesLabel')}
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t('tasks.modal.notesPlaceholder')}
            className="w-full px-2.5 py-1.5 text-xs rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" size="sm" isLoading={isSubmitting}>
            {initialData ? t('common.saveChanges') : t('tasks.modal.createBtn')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
