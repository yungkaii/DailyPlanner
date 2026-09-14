import React, { useState } from 'react';
import { CalendarView } from '../components/calendar/CalendarView';
import { ScheduleModal } from '../components/schedules/ScheduleModal';
import { useSchedules } from '../hooks/useSchedules';
import { Schedule } from '../types';

export function CalendarPage() {
  const { schedules, createSchedule, updateSchedule } = useSchedules();
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (item?: Schedule) => {
    setSelectedSchedule(item || null);
    setIsModalOpen(true);
  };

  return (
    <div className="animate-in fade-in duration-300">
      <CalendarView
        schedules={schedules}
        onOpenScheduleModal={handleOpenModal}
      />

      <ScheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={selectedSchedule}
        onSave={async (data) => {
          if (selectedSchedule) {
            await updateSchedule({ ...selectedSchedule, ...data });
          } else {
            await createSchedule(data);
          }
        }}
      />
    </div>
  );
}
