import React, { useState } from 'react';
import { TodayHero } from '../components/dashboard/TodayHero';
import { NextUpCard } from '../components/dashboard/NextUpCard';
import { TodayTimeline } from '../components/dashboard/TodayTimeline';
import { QuickTasks } from '../components/dashboard/QuickTasks';
import { HabitStrip } from '../components/dashboard/HabitStrip';
import { GoalsGlimpse } from '../components/dashboard/GoalsGlimpse';
import { ScheduleModal } from '../components/schedules/ScheduleModal';
import { TaskModal } from '../components/tasks/TaskModal';
import { HabitModal } from '../components/habits/HabitModal';
import { RevealOnScroll } from '../components/ui/RevealOnScroll';
import { useSchedules } from '../hooks/useSchedules';
import { useTasks } from '../hooks/useTasks';
import { useHabits } from '../hooks/useHabits';
import { Schedule, Task, Habit } from '../types';

export function DashboardPage() {
  const { todaySchedules, createSchedule, updateSchedule } = useSchedules();
  const { createTask, updateTask } = useTasks();
  const { createHabit } = useHabits();

  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);

  const handleOpenScheduleModal = (sched?: Schedule) => {
    setSelectedSchedule(sched || null);
    setIsScheduleModalOpen(true);
  };

  const handleOpenTaskModal = (task?: Task) => {
    setSelectedTask(task || null);
    setIsTaskModalOpen(true);
  };

  const handleOpenHabitModal = (habit?: Habit) => {
    setSelectedHabit(habit || null);
    setIsHabitModalOpen(true);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 1. Today Hero Banner: Greeting, Live Time & Day Progress Ring */}
      <RevealOnScroll direction="up" delay={0} duration={500}>
        <TodayHero />
      </RevealOnScroll>

      {/* 2. Spotlight Next/Active Activity */}
      <RevealOnScroll direction="up" delay={60} duration={500}>
        <NextUpCard onOpenScheduleModal={handleOpenScheduleModal} />
      </RevealOnScroll>

      {/* 3. Main Grid: Timeline & Quick Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <RevealOnScroll direction="left" delay={100} duration={550}>
            <TodayTimeline
              schedules={todaySchedules}
              onOpenScheduleModal={handleOpenScheduleModal}
            />
          </RevealOnScroll>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <RevealOnScroll direction="right" delay={100} duration={550}>
            <QuickTasks onOpenTaskModal={handleOpenTaskModal} />
          </RevealOnScroll>

          <RevealOnScroll direction="right" delay={150} duration={550}>
            <GoalsGlimpse />
          </RevealOnScroll>
        </div>
      </div>

      {/* 4. Habit Consistency Strip */}
      <RevealOnScroll direction="up" delay={120} duration={550}>
        <HabitStrip onOpenHabitModal={handleOpenHabitModal} />
      </RevealOnScroll>

      {/* Shared Modals */}
      <ScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        initialData={selectedSchedule}
        onSave={async (data) => {
          if (selectedSchedule) {
            await updateSchedule({ ...selectedSchedule, ...data });
          } else {
            await createSchedule(data);
          }
        }}
      />

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        initialData={selectedTask}
        onSave={async (data) => {
          if (selectedTask) {
            await updateTask({ ...selectedTask, ...data });
          } else {
            await createTask(data);
          }
        }}
      />

      <HabitModal
        isOpen={isHabitModalOpen}
        onClose={() => setIsHabitModalOpen(false)}
        initialData={selectedHabit}
        onSave={async (data) => {
          await createHabit(data);
        }}
      />
    </div>
  );
}
