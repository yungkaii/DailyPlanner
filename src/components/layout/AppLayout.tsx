import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { CommandMenu } from '../ui/CommandMenu';
import { ScheduleModal } from '../schedules/ScheduleModal';
import { TaskModal } from '../tasks/TaskModal';
import { HabitModal } from '../habits/HabitModal';
import { GoalModal } from '../goals/GoalModal';
import { AuthModal } from '../auth/AuthModal';
import { useSchedules } from '../../hooks/useSchedules';
import { useTasks } from '../../hooks/useTasks';
import { useHabits } from '../../hooks/useHabits';
import { useGoals } from '../../hooks/useGoals';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const { createSchedule } = useSchedules();
  const { createTask } = useTasks();
  const { createHabit } = useHabits();
  const { createGoal } = useGoals();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row antialiased">
      {/* Desktop Sidebar */}
      <Sidebar
        onOpenCommand={() => setIsCommandOpen(true)}
        onOpenScheduleModal={() => setIsScheduleModalOpen(true)}
        onOpenTaskModal={() => setIsTaskModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-8">
        <Header
          onOpenCommand={() => setIsCommandOpen(true)}
          onOpenScheduleModal={() => setIsScheduleModalOpen(true)}
          onOpenTaskModal={() => setIsTaskModalOpen(true)}
          onOpenHabitModal={() => setIsHabitModalOpen(true)}
          onOpenGoalModal={() => setIsGoalModalOpen(true)}
          onOpenAuth={() => setIsAuthModalOpen(true)}
        />

        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Mobile Nav */}
      <MobileNav onOpenCommand={() => setIsCommandOpen(true)} />

      {/* Modals */}
      <CommandMenu
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        onOpenScheduleModal={() => setIsScheduleModalOpen(true)}
        onOpenTaskModal={() => setIsTaskModalOpen(true)}
        onOpenHabitModal={() => setIsHabitModalOpen(true)}
        onOpenGoalModal={() => setIsGoalModalOpen(true)}
      />

      <ScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        onSave={createSchedule}
      />

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={createTask}
      />

      <HabitModal
        isOpen={isHabitModalOpen}
        onClose={() => setIsHabitModalOpen(false)}
        onSave={createHabit}
      />

      <GoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        onSave={createGoal}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}
