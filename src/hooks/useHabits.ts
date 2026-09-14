import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Habit, HabitLog } from '../types';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { localStore } from '../lib/storage';
import { format, subDays, parseISO, isSameDay } from 'date-fns';

export function useHabits() {
  const { user, isConfigured } = useAuth();
  const queryClient = useQueryClient();
  const todayStr = format(new Date(), 'yyyy-MM-dd');

  const habitsQuery = useQuery({
    queryKey: ['habits', user?.id],
    queryFn: async (): Promise<Habit[]> => {
      if (!isConfigured || !user) {
        return [];
      }

      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching habits from Supabase:', error);
        return localStore.getHabits();
      }

      return data as Habit[];
    },
    enabled: !!user,
  });

  const habitLogsQuery = useQuery({
    queryKey: ['habit_logs', user?.id],
    queryFn: async (): Promise<HabitLog[]> => {
      if (!isConfigured || !user) {
        return [];
      }

      const { data, error } = await supabase
        .from('habit_logs')
        .select('*')
        .eq('user_id', user?.id);

      if (error) {
        console.error('Error fetching habit logs from Supabase:', error);
        return localStore.getHabitLogs();
      }

      return data as HabitLog[];
    },
    enabled: !!user,
  });

  const habits = habitsQuery.data || [];
  const habitLogs = habitLogsQuery.data || [];

  // Streak calculations
  const habitStats = habits.map((habit) => {
    const logsForHabit = habitLogs.filter((l) => l.habit_id === habit.id);
    const completedDates = new Set(logsForHabit.map((l) => l.completed_date));

    // Check if completed today
    const isCompletedToday = completedDates.has(todayStr);

    // Calculate current streak
    let currentStreak = 0;
    let checkDate = new Date();
    
    // If not completed today, start checking from yesterday
    if (!isCompletedToday) {
      checkDate = subDays(checkDate, 1);
    }

    while (completedDates.has(format(checkDate, 'yyyy-MM-dd'))) {
      currentStreak++;
      checkDate = subDays(checkDate, 1);
    }

    // Past 7 days status for visual dots
    const past7Days = Array.from({ length: 7 }).map((_, i) => {
      const date = subDays(new Date(), 6 - i);
      const dateStr = format(date, 'yyyy-MM-dd');
      return {
        dateStr,
        dayName: format(date, 'EEE'),
        dayNumber: format(date, 'd'),
        isCompleted: completedDates.has(dateStr),
        isToday: dateStr === todayStr,
      };
    });

    return {
      habit,
      isCompletedToday,
      currentStreak,
      totalCompletions: completedDates.size,
      past7Days,
    };
  });

  const completedHabitsToday = habitStats.filter((h) => h.isCompletedToday).length;

  // Toggle habit for date mutation
  const toggleMutation = useMutation({
    mutationFn: async ({ habitId, dateStr }: { habitId: string; dateStr: string }) => {
      const existing = habitLogs.find(
        (l) => l.habit_id === habitId && l.completed_date === dateStr
      );

      if (!isConfigured || !user) {
        return;
      }

      if (existing) {
        const { error } = await supabase
          .from('habit_logs')
          .delete()
          .eq('habit_id', habitId)
          .eq('completed_date', dateStr);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('habit_logs').insert([
          {
            habit_id: habitId,
            user_id: user?.id,
            completed_date: dateStr,
          },
        ]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habit_logs'] });
    },
  });

  // Create habit mutation
  const createMutation = useMutation({
    mutationFn: async (newHabit: Omit<Habit, 'id' | 'user_id' | 'created_at'>) => {
      const habitToInsert: Habit = {
        ...newHabit,
        id: 'habit-' + Date.now(),
        user_id: user?.id || 'demo-user',
        created_at: new Date().toISOString(),
      };

      if (!isConfigured || !user) {
        return habitToInsert;
      }

      const { data, error } = await supabase
        .from('habits')
        .insert([{
          ...newHabit,
          user_id: user?.id,
        }])
        .select()
        .single();

      if (error) throw error;
      return data as Habit;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
    },
  });

  // Delete habit mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!isConfigured || !user) {
        return id;
      }

      const { error } = await supabase.from('habits').delete().eq('id', id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      queryClient.invalidateQueries({ queryKey: ['habit_logs'] });
    },
  });

  return {
    habits,
    habitStats,
    completedHabitsToday,
    isLoading: habitsQuery.isLoading || habitLogsQuery.isLoading,
    toggleHabit: (habitId: string, dateStr: string = todayStr) =>
      toggleMutation.mutateAsync({ habitId, dateStr }),
    createHabit: createMutation.mutateAsync,
    deleteHabit: deleteMutation.mutateAsync,
  };
}
