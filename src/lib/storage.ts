import { Schedule, Task, Habit, HabitLog, Goal } from '../types';
import {
  getInitialSchedules,
  getInitialTasks,
  getInitialHabits,
  getInitialHabitLogs,
  getInitialGoals,
} from './mockData';

const KEYS = {
  SCHEDULES: 'routineup_schedules_v1',
  TASKS: 'routineup_tasks_v1',
  HABITS: 'routineup_habits_v1',
  HABIT_LOGS: 'routineup_habit_logs_v1',
  GOALS: 'routineup_goals_v1',
};

export const localStore = {
  getSchedules(): Schedule[] {
    const data = localStorage.getItem(KEYS.SCHEDULES);
    if (!data) {
      const initial = getInitialSchedules();
      localStorage.setItem(KEYS.SCHEDULES, JSON.stringify(initial));
      return initial;
    }
    try {
      return JSON.parse(data);
    } catch {
      return getInitialSchedules();
    }
  },

  setSchedules(items: Schedule[]) {
    localStorage.setItem(KEYS.SCHEDULES, JSON.stringify(items));
  },

  getTasks(): Task[] {
    const data = localStorage.getItem(KEYS.TASKS);
    if (!data) {
      const initial = getInitialTasks();
      localStorage.setItem(KEYS.TASKS, JSON.stringify(initial));
      return initial;
    }
    try {
      return JSON.parse(data);
    } catch {
      return getInitialTasks();
    }
  },

  setTasks(items: Task[]) {
    localStorage.setItem(KEYS.TASKS, JSON.stringify(items));
  },

  getHabits(): Habit[] {
    const data = localStorage.getItem(KEYS.HABITS);
    if (!data) {
      const initial = getInitialHabits();
      localStorage.setItem(KEYS.HABITS, JSON.stringify(initial));
      return initial;
    }
    try {
      return JSON.parse(data);
    } catch {
      return getInitialHabits();
    }
  },

  setHabits(items: Habit[]) {
    localStorage.setItem(KEYS.HABITS, JSON.stringify(items));
  },

  getHabitLogs(): HabitLog[] {
    const data = localStorage.getItem(KEYS.HABIT_LOGS);
    if (!data) {
      const initial = getInitialHabitLogs();
      localStorage.setItem(KEYS.HABIT_LOGS, JSON.stringify(initial));
      return initial;
    }
    try {
      return JSON.parse(data);
    } catch {
      return getInitialHabitLogs();
    }
  },

  setHabitLogs(items: HabitLog[]) {
    localStorage.setItem(KEYS.HABIT_LOGS, JSON.stringify(items));
  },

  getGoals(): Goal[] {
    const data = localStorage.getItem(KEYS.GOALS);
    if (!data) {
      const initial = getInitialGoals();
      localStorage.setItem(KEYS.GOALS, JSON.stringify(initial));
      return initial;
    }
    try {
      return JSON.parse(data);
    } catch {
      return getInitialGoals();
    }
  },

  setGoals(items: Goal[]) {
    localStorage.setItem(KEYS.GOALS, JSON.stringify(items));
  },

  resetAll() {
    localStorage.removeItem(KEYS.SCHEDULES);
    localStorage.removeItem(KEYS.TASKS);
    localStorage.removeItem(KEYS.HABITS);
    localStorage.removeItem(KEYS.HABIT_LOGS);
    localStorage.removeItem(KEYS.GOALS);
    return {
      schedules: localStore.getSchedules(),
      tasks: localStore.getTasks(),
      habits: localStore.getHabits(),
      habitLogs: localStore.getHabitLogs(),
      goals: localStore.getGoals(),
    };
  }
};
