import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Goal, DayProgressStats } from '../types';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { localStore } from '../lib/storage';
import { useSchedules } from './useSchedules';
import { useTasks } from './useTasks';
import { useHabits } from './useHabits';
import { differenceInMinutes, parseISO } from 'date-fns';

export function useGoals() {
  const { user, isDemo, isConfigured } = useAuth();
  const queryClient = useQueryClient();

  const { todaySchedules } = useSchedules();
  const { todayTasks, completedTodayTasks } = useTasks();
  const { habitStats, completedHabitsToday } = useHabits();

  const goalsQuery = useQuery({
    queryKey: ['goals', user?.id, isDemo],
    queryFn: async (): Promise<Goal[]> => {
      if (!isConfigured || isDemo) {
        return localStore.getGoals();
      }

      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching goals from Supabase:', error);
        return localStore.getGoals();
      }

      return data as Goal[];
    },
    enabled: !!user,
  });

  const goals = goalsQuery.data || [];

  // Compute Daily Progress Stats
  let totalScheduleMinutes = 0;
  let completedScheduleMinutes = 0;

  todaySchedules.forEach((s) => {
    try {
      const dur = differenceInMinutes(parseISO(s.end_time), parseISO(s.start_time));
      totalScheduleMinutes += Math.max(0, dur);
      if (s.status === 'completed') {
        completedScheduleMinutes += Math.max(0, dur);
      } else if (s.status === 'active') {
        // give partial credit for active block
        completedScheduleMinutes += Math.floor(Math.max(0, dur) * 0.5);
      }
    } catch {
      // ignore parse error
    }
  });

  const scheduleWeight = totalScheduleMinutes > 0 ? (completedScheduleMinutes / totalScheduleMinutes) : 1;
  const taskWeight = todayTasks.length > 0 ? (completedTodayTasks.length / todayTasks.length) : 1;
  const habitWeight = habitStats.length > 0 ? (completedHabitsToday / habitStats.length) : 1;

  // Composite percentage
  let rawScore = 0;
  let countWeights = 0;

  if (todaySchedules.length > 0) {
    rawScore += scheduleWeight * 40;
    countWeights += 40;
  }
  if (todayTasks.length > 0) {
    rawScore += taskWeight * 35;
    countWeights += 35;
  }
  if (habitStats.length > 0) {
    rawScore += habitWeight * 25;
    countWeights += 25;
  }

  const overallDailyPercentage = countWeights > 0 ? Math.round((rawScore / countWeights) * 100) : 0;

  const dayStats: DayProgressStats = {
    percentage: Math.min(100, Math.max(0, overallDailyPercentage)),
    totalScheduleMinutes,
    completedScheduleMinutes,
    totalTasksToday: todayTasks.length,
    completedTasksToday: completedTodayTasks.length,
    totalHabitsToday: habitStats.length,
    completedHabitsToday,
  };

  // Create Goal
  const createMutation = useMutation({
    mutationFn: async (newGoal: Omit<Goal, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      const goalToInsert: Goal = {
        ...newGoal,
        id: 'goal-' + Date.now(),
        user_id: user?.id || 'demo-user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (!isConfigured || isDemo) {
        const current = localStore.getGoals();
        localStore.setGoals([...current, goalToInsert]);
        return goalToInsert;
      }

      const { data, error } = await supabase
        .from('goals')
        .insert([{ ...newGoal, user_id: user?.id }])
        .select()
        .single();

      if (error) throw error;
      return data as Goal;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });

  // Update Goal Progress
  const updateMutation = useMutation({
    mutationFn: async ({ id, currentValue, status }: { id: string; currentValue: number; status?: Goal['status'] }) => {
      if (!isConfigured || isDemo) {
        const current = localStore.getGoals();
        const next = current.map((g) =>
          g.id === id
            ? {
                ...g,
                current_value: currentValue,
                status: status || (currentValue >= g.target_value ? 'completed' : g.status),
                updated_at: new Date().toISOString(),
              }
            : g
        );
        localStore.setGoals(next);
        return;
      }

      const updateData: any = {
        current_value: currentValue,
        updated_at: new Date().toISOString(),
      };
      if (status) updateData.status = status;

      const { error } = await supabase.from('goals').update(updateData).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });

  // Delete Goal
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!isConfigured || isDemo) {
        const current = localStore.getGoals();
        localStore.setGoals(current.filter((g) => g.id !== id));
        return id;
      }

      const { error } = await supabase.from('goals').delete().eq('id', id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });

  return {
    goals,
    dayStats,
    isLoading: goalsQuery.isLoading,
    createGoal: createMutation.mutateAsync,
    updateGoalProgress: (id: string, currentValue: number, status?: Goal['status']) =>
      updateMutation.mutateAsync({ id, currentValue, status }),
    deleteGoal: deleteMutation.mutateAsync,
  };
}
