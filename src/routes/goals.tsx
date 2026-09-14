import React, { useState } from 'react';
import { GoalList } from '../components/goals/GoalList';
import { GoalModal } from '../components/goals/GoalModal';
import { useGoals } from '../hooks/useGoals';
import { Goal } from '../types';

export function GoalsPage() {
  const { createGoal } = useGoals();
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (goal?: Goal) => {
    setSelectedGoal(goal || null);
    setIsModalOpen(true);
  };

  return (
    <div className="animate-in fade-in duration-300">
      <GoalList onOpenGoalModal={handleOpenModal} />

      <GoalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={selectedGoal}
        onSave={async (data) => {
          await createGoal(data);
        }}
      />
    </div>
  );
}
