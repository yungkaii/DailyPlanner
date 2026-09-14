export type Priority = 'urgent' | 'high' | 'medium' | 'low';

export type ScheduleStatus = 'upcoming' | 'active' | 'completed';

export type RecurrenceRule = 'none' | 'daily' | 'weekdays' | 'weekly';

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'anytime';

export type GoalStatus = 'in_progress' | 'completed' | 'on_hold';

export type CalendarViewMode = 'day' | 'week' | 'month';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  timezone?: string;
}

export interface Schedule {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  start_time: string; // ISO string
  end_time: string;   // ISO string
  category: string;
  color: string;
  recurring: RecurrenceRule;
  status: ScheduleStatus;
  location?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Task {
  id: string;
  user_id: string;
  schedule_id?: string | null;
  title: string;
  description?: string;
  priority: Priority;
  due_date?: string | null; // ISO string
  completed: boolean;
  completed_at?: string | null;
  category: string;
  created_at?: string;
  updated_at?: string;
}

export interface Habit {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  category: string;
  time_of_day: TimeOfDay;
  color: string;
  created_at?: string;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  user_id: string;
  completed_date: string; // 'YYYY-MM-DD'
  created_at?: string;
}

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  category: string;
  target_date?: string | null; // 'YYYY-MM-DD'
  current_value: number;
  target_value: number;
  unit: string;
  status: GoalStatus;
  created_at?: string;
  updated_at?: string;
}

export interface DayProgressStats {
  percentage: number;
  totalScheduleMinutes: number;
  completedScheduleMinutes: number;
  totalTasksToday: number;
  completedTasksToday: number;
  totalHabitsToday: number;
  completedHabitsToday: number;
}
