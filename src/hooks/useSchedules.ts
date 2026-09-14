import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Schedule } from '../types';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { localStore } from '../lib/storage';
import { calculateScheduleStatus } from '../lib/utils';
import { isToday, parseISO } from 'date-fns';

export function useSchedules() {
  const { user, isDemo, isConfigured } = useAuth();
  const queryClient = useQueryClient();

  const schedulesQuery = useQuery({
    queryKey: ['schedules', user?.id, isDemo],
    queryFn: async (): Promise<Schedule[]> => {
      if (!isConfigured || isDemo) {
        return localStore.getSchedules();
      }

      const { data, error } = await supabase
        .from('schedules')
        .select('*')
        .eq('user_id', user?.id)
        .order('start_time', { ascending: true });

      if (error) {
        console.error('Error fetching schedules from Supabase:', error);
        return localStore.getSchedules();
      }

      return data as Schedule[];
    },
    enabled: !!user,
  });

  const schedules = (schedulesQuery.data || []).map((s) => ({
    ...s,
    status: calculateScheduleStatus(s),
  }));

  const todaySchedules = schedules.filter((s) => {
    try {
      return isToday(parseISO(s.start_time));
    } catch {
      return false;
    }
  });

  // Create Mutation
  const createMutation = useMutation({
    mutationFn: async (newSchedule: Omit<Schedule, 'id' | 'user_id' | 'created_at'>) => {
      const scheduleToInsert: Schedule = {
        ...newSchedule,
        id: 'sched-' + Date.now(),
        user_id: user?.id || 'demo-user',
        created_at: new Date().toISOString(),
      };

      if (!isConfigured || isDemo) {
        const current = localStore.getSchedules();
        const updated = [...current, scheduleToInsert];
        localStore.setSchedules(updated);
        return scheduleToInsert;
      }

      const { data, error } = await supabase
        .from('schedules')
        .insert([{
          ...newSchedule,
          user_id: user?.id,
        }])
        .select()
        .single();

      if (error) throw error;
      return data as Schedule;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
    },
  });

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: async (updated: Schedule) => {
      if (!isConfigured || isDemo) {
        const current = localStore.getSchedules();
        const next = current.map((s) => (s.id === updated.id ? updated : s));
        localStore.setSchedules(next);
        return updated;
      }

      const { data, error } = await supabase
        .from('schedules')
        .update(updated)
        .eq('id', updated.id)
        .select()
        .single();

      if (error) throw error;
      return data as Schedule;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!isConfigured || isDemo) {
        const current = localStore.getSchedules();
        const next = current.filter((s) => s.id !== id);
        localStore.setSchedules(next);
        return id;
      }

      const { error } = await supabase.from('schedules').delete().eq('id', id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
    },
  });

  return {
    schedules,
    todaySchedules,
    isLoading: schedulesQuery.isLoading,
    createSchedule: createMutation.mutateAsync,
    updateSchedule: updateMutation.mutateAsync,
    deleteSchedule: deleteMutation.mutateAsync,
  };
}
