import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Habit, TimeOfDay } from '../../types';

interface HabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Habit, 'id' | 'user_id' | 'created_at'>) => Promise<any>;
  initialData?: Habit | null;
}

const HABIT_COLORS = [
  '#5E8C61', // Sage
  '#4A7B9D', // Slate Blue
  '#C05D3B', // Terracotta
  '#7B6B8A', // Dusty Purple
  '#B8860B', // Ochre
  '#BF4040', // Muted Red
  '#4A8B8D', // Soft Teal
];

export function HabitModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: HabitModalProps) {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Health');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('morning');
  const [color, setColor] = useState('#5E8C61');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const timesOfDay: { id: TimeOfDay; labelKey: string }[] = [
    { id: 'morning', labelKey: 'common.timeOfDay.morning' },
    { id: 'afternoon', labelKey: 'common.timeOfDay.afternoon' },
    { id: 'evening', labelKey: 'common.timeOfDay.evening' },
    { id: 'anytime', labelKey: 'common.timeOfDay.anytime' },
  ];

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description || '');
      setCategory(initialData.category || 'Health');
      setTimeOfDay(initialData.time_of_day || 'morning');
      setColor(initialData.color || '#5E8C61');
    } else {
      setTitle('');
      setDescription('');
      setCategory('Health');
      setTimeOfDay('morning');
      setColor('#5E8C61');
    }
    setError(null);
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError(t('habits.modal.errorTitleRequired'));
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onSave({
        title: title.trim(),
        description: description.trim() || undefined,
        category,
        time_of_day: timeOfDay,
        color,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || t('habits.modal.errorSaveFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? t('habits.modal.editTitle') : t('habits.modal.newTitle')}
      description={t('habits.modal.description')}
    >
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {error && (
          <div className="p-2.5 text-xs rounded-md bg-[#BF4040]/8 text-[#BF4040] dark:text-[#D46A6A] border border-[#BF4040]/20">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-foreground mb-1">
            {t('habits.modal.titleLabel')} <span className="text-[#BF4040]">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('habits.modal.titlePlaceholder')}
            className="w-full px-3 py-1.5 text-xs rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-foreground mb-1">
            {t('habits.modal.whenInDay')}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {timesOfDay.map((item) => {
              const isSelected = timeOfDay === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTimeOfDay(item.id)}
                  className={`px-2.5 py-1 rounded text-xs font-medium border text-center transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-primary/10 text-primary border-primary/30 font-semibold'
                      : 'border-border text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {t(item.labelKey)}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              {t('habits.modal.categoryLabel')}
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Health, Learning"
              className="w-full px-2.5 py-1.5 text-xs rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              {t('habits.modal.inkColorLabel')}
            </label>
            <div className="flex items-center gap-1.5 pt-1">
              {HABIT_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  style={{ backgroundColor: c }}
                  className={`w-5 h-5 rounded-full cursor-pointer transition-all ${
                    color === c ? 'ring-2 ring-offset-2 ring-primary dark:ring-offset-card' : 'opacity-70 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-foreground mb-1">
            {t('habits.modal.notesLabel')}
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t('habits.modal.notesPlaceholder')}
            className="w-full px-2.5 py-1.5 text-xs rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" size="sm" isLoading={isSubmitting}>
            {initialData ? t('common.saveChanges') : t('habits.modal.createBtn')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
