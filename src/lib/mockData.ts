import { format, addHours, setHours, setMinutes, subDays } from 'date-fns';
import { Schedule, Task, Habit, HabitLog, Goal, UserProfile } from '../types';

export const DEMO_USER: UserProfile = {
  id: 'demo-user-123',
  email: 'alex.rivera@routineup.app',
  full_name: 'Alex Rivera',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
};

export function getInitialSchedules(): Schedule[] {
  const now = new Date();
  
  // Set schedules around today's hours
  const block1Start = setMinutes(setHours(now, 8), 30);
  const block1End = setMinutes(setHours(now, 9), 30);

  const block2Start = setMinutes(setHours(now, 10), 0);
  const block2End = setMinutes(setHours(now, 11), 30);

  const block3Start = setMinutes(setHours(now, 13), 30);
  const block3End = setMinutes(setHours(now, 15), 0);

  const block4Start = setMinutes(setHours(now, 16), 0);
  const block4End = setMinutes(setHours(now, 17), 0);

  const block5Start = setMinutes(setHours(now, 18), 0);
  const block5End = setMinutes(setHours(now, 19), 15);

  return [
    {
      id: 'sched-1',
      user_id: DEMO_USER.id,
      title: 'Morning Routine & Daily Planning',
      description: 'Review day priorities, clear inbox zero, and outline deep work goals',
      start_time: block1Start.toISOString(),
      end_time: block1End.toISOString(),
      category: 'Personal',
      color: '#f43f5e',
      recurring: 'daily',
      status: 'completed',
      location: 'Home Study',
    },
    {
      id: 'sched-2',
      user_id: DEMO_USER.id,
      title: 'Deep Work: Core Product Architecture',
      description: 'Design TanStack Router layouts and Supabase real-time sync mechanism',
      start_time: block2Start.toISOString(),
      end_time: block2End.toISOString(),
      category: 'Deep Work',
      color: '#6366f1',
      recurring: 'weekdays',
      status: 'completed',
      location: 'Focus Station',
    },
    {
      id: 'sched-3',
      user_id: DEMO_USER.id,
      title: 'Design Sync & Feature Grooming',
      description: 'Review responsive mobile navigation patterns and timeline micro-interactions',
      start_time: block3Start.toISOString(),
      end_time: block3End.toISOString(),
      category: 'Meeting',
      color: '#f59e0b',
      recurring: 'weekly',
      status: 'active',
      location: 'Google Meet',
    },
    {
      id: 'sched-4',
      user_id: DEMO_USER.id,
      title: 'Habit & Task Module Implementation',
      description: 'Build interactive habit bubble streak grid and priority task filters',
      start_time: block4Start.toISOString(),
      end_time: block4End.toISOString(),
      category: 'Work',
      color: '#3b82f6',
      recurring: 'none',
      status: 'upcoming',
      location: 'RoutineUp Lab',
    },
    {
      id: 'sched-5',
      user_id: DEMO_USER.id,
      title: 'Evening Run & Recovery Workout',
      description: '5k tempo run outdoors + 15 min mobility session',
      start_time: block5Start.toISOString(),
      end_time: block5End.toISOString(),
      category: 'Health',
      color: '#10b981',
      recurring: 'daily',
      status: 'upcoming',
      location: 'Riverside Trail',
    },
  ];
}

export function getInitialTasks(): Task[] {
  const now = new Date();
  const todayIso = now.toISOString();
  const tomorrowIso = addHours(now, 24).toISOString();

  return [
    {
      id: 'task-1',
      user_id: DEMO_USER.id,
      schedule_id: 'sched-2',
      title: 'Refactor TanStack Router route tree definitions',
      description: 'Ensure clean type safety across nested dashboard layout routes',
      priority: 'urgent',
      due_date: todayIso,
      completed: true,
      completed_at: now.toISOString(),
      category: 'Deep Work',
    },
    {
      id: 'task-2',
      user_id: DEMO_USER.id,
      schedule_id: 'sched-3',
      title: 'Prepare timeline UI component prototype',
      description: 'Show active status with subtle glowing indicator and smooth hover cards',
      priority: 'high',
      due_date: todayIso,
      completed: true,
      completed_at: now.toISOString(),
      category: 'Meeting',
    },
    {
      id: 'task-3',
      user_id: DEMO_USER.id,
      schedule_id: 'sched-4',
      title: 'Implement streak calculation for recurring habits',
      description: 'Consecutive day checks using date-fns and local storage cache',
      priority: 'high',
      due_date: todayIso,
      completed: false,
      category: 'Work',
    },
    {
      id: 'task-4',
      user_id: DEMO_USER.id,
      schedule_id: null,
      title: 'Review Supabase Row Level Security policy script',
      description: 'Ensure auth.uid() isolation across profiles, schedules, tasks, and habits',
      priority: 'medium',
      due_date: todayIso,
      completed: false,
      category: 'Admin',
    },
    {
      id: 'task-5',
      user_id: DEMO_USER.id,
      schedule_id: 'sched-5',
      title: 'Hydrate 500ml electrolyte water before 5k run',
      description: 'Pre-workout nutrition and stretching prep',
      priority: 'low',
      due_date: todayIso,
      completed: false,
      category: 'Health',
    },
    {
      id: 'task-6',
      user_id: DEMO_USER.id,
      schedule_id: null,
      title: 'Draft weekly engineering sprint newsletter',
      description: 'Highlight performance gains from client-side TanStack Query cache',
      priority: 'medium',
      due_date: tomorrowIso,
      completed: false,
      category: 'Work',
    },
  ];
}

export function getInitialHabits(): Habit[] {
  return [
    {
      id: 'habit-1',
      user_id: DEMO_USER.id,
      title: 'Morning Meditation (15m)',
      description: 'Mindfulness breathing and mental focus',
      category: 'Health',
      time_of_day: 'morning',
      color: '#10b981',
      created_at: subDays(new Date(), 20).toISOString(),
    },
    {
      id: 'habit-2',
      user_id: DEMO_USER.id,
      title: 'Drink 2.5L Water',
      description: 'Stay hydrated throughout the working day',
      category: 'Health',
      time_of_day: 'anytime',
      color: '#06b6d4',
      created_at: subDays(new Date(), 30).toISOString(),
    },
    {
      id: 'habit-3',
      user_id: DEMO_USER.id,
      title: 'Read 20 Pages Non-Fiction',
      description: 'Engineering systems, psychology, or productivity literature',
      category: 'Learning',
      time_of_day: 'evening',
      color: '#a855f7',
      created_at: subDays(new Date(), 14).toISOString(),
    },
    {
      id: 'habit-4',
      user_id: DEMO_USER.id,
      title: 'Zero Inbox & Daily RoutineUp Review',
      description: 'Clear notifications and prepare schedule for the next morning',
      category: 'Personal',
      time_of_day: 'evening',
      color: '#f43f5e',
      created_at: subDays(new Date(), 10).toISOString(),
    },
  ];
}

export function getInitialHabitLogs(): HabitLog[] {
  const logs: HabitLog[] = [];
  const habits = getInitialHabits();
  const todayStr = format(new Date(), 'yyyy-MM-dd');

  // Populate past 7 days of logs to give realistic streaks
  habits.forEach((habit, hIdx) => {
    for (let i = 1; i <= 6; i++) {
      // simulate mostly consistent streaks
      if (hIdx === 3 && i === 4) continue; // slight break for habit 4
      const dateStr = format(subDays(new Date(), i), 'yyyy-MM-dd');
      logs.push({
        id: `log-${habit.id}-${dateStr}`,
        habit_id: habit.id,
        user_id: DEMO_USER.id,
        completed_date: dateStr,
      });
    }

    // Mark habit 1 and 2 completed for today already!
    if (hIdx === 0 || hIdx === 1) {
      logs.push({
        id: `log-${habit.id}-${todayStr}`,
        habit_id: habit.id,
        user_id: DEMO_USER.id,
        completed_date: todayStr,
      });
    }
  });

  return logs;
}

export function getInitialGoals(): Goal[] {
  return [
    {
      id: 'goal-1',
      user_id: DEMO_USER.id,
      title: 'Launch RoutineUp MVP v1.0',
      description: 'Deliver responsive, polished daily planner with Supabase and TanStack Stack',
      category: 'Work',
      target_date: format(addHours(new Date(), 24 * 14), 'yyyy-MM-dd'),
      current_value: 80,
      target_value: 100,
      unit: '%',
      status: 'in_progress',
    },
    {
      id: 'goal-2',
      user_id: DEMO_USER.id,
      title: 'Read 12 Books This Year',
      description: 'Focus on distributed systems, architecture, and focus mastery',
      category: 'Learning',
      target_date: format(addHours(new Date(), 24 * 90), 'yyyy-MM-dd'),
      current_value: 7,
      target_value: 12,
      unit: 'books',
      status: 'in_progress',
    },
    {
      id: 'goal-3',
      user_id: DEMO_USER.id,
      title: 'Sub-25 Minute 5K Running Target',
      description: 'Consistent weekly mileage and high-intensity interval training',
      category: 'Health',
      target_date: format(addHours(new Date(), 24 * 30), 'yyyy-MM-dd'),
      current_value: 26.4,
      target_value: 24.5,
      unit: 'mins',
      status: 'in_progress',
    },
  ];
}
