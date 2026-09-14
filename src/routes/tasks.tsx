import React, { useState } from 'react';
import { TaskList } from '../components/tasks/TaskList';
import { TaskModal } from '../components/tasks/TaskModal';
import { useTasks } from '../hooks/useTasks';
import { Task } from '../types';

export function TasksPage() {
  const { createTask, updateTask } = useTasks();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (task?: Task) => {
    setSelectedTask(task || null);
    setIsModalOpen(true);
  };

  return (
    <div className="animate-in fade-in duration-300">
      <TaskList onOpenTaskModal={handleOpenModal} />

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={selectedTask}
        onSave={async (data) => {
          if (selectedTask) {
            await updateTask({ ...selectedTask, ...data });
          } else {
            await createTask(data);
          }
        }}
      />
    </div>
  );
}
