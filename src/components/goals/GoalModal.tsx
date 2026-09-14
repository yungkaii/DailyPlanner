import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Goal, GoalStatus } from '../../types';
import { format, addMonths } from 'date-fns';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Goal, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<any>;
  initialData?: Goal | null;
}

export function GoalModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: GoalModalProps) {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Personal');
  const [targetDate, setTargetDate] = useState('');
  const [currentValue, setCurrentValue] = useState<number>(0);
  const [targetValue, setTargetValue] = useState<number>(100);
  const [unit, setUnit] = useState('%');
  const [status, setStatus] = useState<GoalStatus>('in_progress');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description || '');
      setCategory(initialData.category || 'Personal');
      setTargetDate(initialData.target_date || '');
      setCurrentValue(initialData.current_value || 0);
      setTargetValue(initialData.target_value || 100);
      setUnit(initialData.unit || '%');
      setStatus(initialData.status || 'in_progress');
    } else {
      setTitle('');
      setDescription('');
      setCategory('Personal');
      setTargetDate(format(addMonths(new Date(), 1), 'yyyy-MM-dd'));
      setCurrentValue(0);
      setTargetValue(100);
      setUnit('%');
      setStatus('in_progress');
    }
    setError(null);
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError(t('goals.modal.errorTitleRequired'));
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onSave({
        title: title.trim(),
        description: description.trim() || undefined,
        category,
        target_date: targetDate || null,
        current_value: Number(currentValue),
        target_value: Number(targetValue),
        unit: unit.trim() || '%',
        status,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || t('goals.modal.errorSaveFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? t('goals.modal.editTitle') : t('goals.modal.newTitle')}
      description={t('goals.modal.description')}
    >
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {error && (
          <div className="p-2.5 text-xs rounded-md bg-[#BF4040]/8 text-[#BF4040] dark:text-[#D46A6A] border border-[#BF4040]/20">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-foreground mb-1">
            {t('goals.modal.titleLabel')} <span className="text-[#BF4040]">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('goals.modal.titlePlaceholder')}
            className="w-full px-3 py-1.5 text-xs rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              {t('goals.modal.categoryLabel')}
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Career, Health"
              className="w-full px-2.5 py-1.5 text-xs rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              {t('goals.modal.targetDateLabel')}
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              {t('goals.modal.currentLabel')}
            </label>
            <input
              type="number"
              step="any"
              value={currentValue}
              onChange={(e) => setCurrentValue(Number(e.target.value))}
              className="w-full px-2.5 py-1.5 text-xs rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              {t('goals.modal.targetLabel')}
            </label>
            <input
              type="number"
              step="any"
              value={targetValue}
              onChange={(e) => setTargetValue(Number(e.target.value))}
              className="w-full px-2.5 py-1.5 text-xs rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              {t('goals.modal.unitLabel')}
            </label>
            <input
              type="text"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="%, hrs, km"
              className="w-full px-2.5 py-1.5 text-xs rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-foreground mb-1">
            {t('goals.modal.statusLabel')}
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as GoalStatus)}
            className="w-full px-2.5 py-1.5 text-xs rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="in_progress">{t('common.inProgress')}</option>
            <option value="completed">{t('common.completed')}</option>
            <option value="on_hold">{t('common.onHold')}</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-foreground mb-1">
            {t('goals.modal.notesLabel')}
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t('goals.modal.notesPlaceholder')}
            className="w-full px-2.5 py-1.5 text-xs rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" size="sm" isLoading={isSubmitting}>
            {initialData ? t('common.saveChanges') : t('goals.modal.createBtn')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
