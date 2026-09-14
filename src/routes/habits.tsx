import React, { useState } from 'react';
import { HabitList } from '../components/habits/HabitList';
import { HabitModal } from '../components/habits/HabitModal';
import { useHabits } from '../hooks/useHabits';
import { Habit } from '../types';

export function HabitsPage() {
  const { createHabit } = useHabits();
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (habit?: Habit) => {
    setSelectedHabit(habit || null);
    setIsModalOpen(true);
  };

  return (
    <div className="animate-in fade-in duration-300">
      <HabitList onOpenHabitModal={handleOpenModal} />

      <HabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={selectedHabit}
        onSave={async (data) => {
          await createHabit(data);
        }}
      />
    </div>
  );
}
